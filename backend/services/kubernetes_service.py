from kubernetes import client, config
from kubernetes.client.rest import ApiException
import logging

logger = logging.getLogger(__name__)

class KubernetesService:
    def __init__(self):
        self.initialized = False
        try:
            # For local dev, try to load kube config
            config.load_kube_config()
            self.core_v1 = client.CoreV1Api()
            self.apps_v1 = client.AppsV1Api()
            self.initialized = True
        except Exception as e:
            logger.warning(f"Could not initialize Kubernetes client: {e}")

    def get_nodes(self):
        if not self.initialized: return []
        try:
            nodes = self.core_v1.list_node()
            result = []
            for node in nodes.items:
                status = "Ready" if any(c.type == "Ready" and c.status == "True" for c in node.status.conditions) else "NotReady"
                addr = next((a.address for a in node.status.addresses if a.type == "InternalIP"), None)
                result.append({
                    "name": node.metadata.name,
                    "status": status,
                    "os": node.status.node_info.os_image,
                    "architecture": node.status.node_info.architecture,
                    "ip": addr
                })
            return result
        except ApiException as e:
            logger.error(f"Error fetching nodes: {e}")
            return []

    def get_pods(self, namespace="default"):
        if not self.initialized: return []
        try:
            pods = self.core_v1.list_namespaced_pod(namespace)
            result = []
            for p in pods.items:
                restarts = sum([c.restart_count for c in (p.status.container_statuses or [])])
                result.append({
                    "name": p.metadata.name,
                    "namespace": p.metadata.namespace,
                    "node_name": p.spec.node_name,
                    "status": p.status.phase,
                    "restarts": restarts,
                    "created_at": p.metadata.creation_timestamp,
                    "labels": p.metadata.labels or {}
                })
            return result
        except ApiException as e:
            logger.error(f"Error fetching pods: {e}")
            return []

    def get_deployments(self, namespace="default"):
        if not self.initialized: return []
        try:
            deps = self.apps_v1.list_namespaced_deployment(namespace)
            result = []
            for d in deps.items:
                result.append({
                    "name": d.metadata.name,
                    "namespace": d.metadata.namespace,
                    "replicas": d.spec.replicas or 0,
                    "available_replicas": d.status.available_replicas or 0,
                    "ready_replicas": d.status.ready_replicas or 0,
                    "created_at": d.metadata.creation_timestamp
                })
            return result
        except ApiException as e:
            logger.error(f"Error fetching deployments: {e}")
            return []

    def restart_pod(self, name: str, namespace: str = "default"):
        if not self.initialized: return False
        try:
            self.core_v1.delete_namespaced_pod(name, namespace)
            return True
        except ApiException as e:
            logger.error(f"Error restarting pod: {e}")
            return False

k8s_client = KubernetesService()
