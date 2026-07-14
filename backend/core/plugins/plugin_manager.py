import docker
from core.plugins.plugin_schema import PluginManifest
import logging

logger = logging.getLogger(__name__)

class PluginManager:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            logger.error(f"Failed to connect to docker daemon: {e}")
            self.client = None

    def get_plugin_status(self, manifest: PluginManifest) -> dict:
        if not self.client:
            return {"installed": False, "status": "docker_unavailable"}
            
        container_name = f"vnav-plugin-{manifest.id}"
        try:
            container = self.client.containers.get(container_name)
            return {"installed": True, "status": container.status}
        except docker.errors.NotFound:
            return {"installed": False, "status": "uninstalled"}
        except Exception as e:
            logger.error(f"Error checking plugin status: {e}")
            return {"installed": False, "status": "error"}

    def install_plugin(self, manifest: PluginManifest):
        if not self.client:
            raise Exception("Docker client not available")
            
        container_name = f"vnav-plugin-{manifest.id}"
        
        # Check if already installed
        try:
            self.client.containers.get(container_name)
            return {"status": "already_installed"}
        except docker.errors.NotFound:
            pass

        # Pull image
        try:
            if manifest.docker_image:
                logger.info(f"Pulling image {manifest.docker_image} for {manifest.id}")
                self.client.images.pull(manifest.docker_image)
        except Exception as e:
            logger.error(f"Failed to pull image {manifest.docker_image}: {e}")
            raise Exception(f"Failed to pull image: {e}")

        # Run container
        try:
            ports = {f"{k}/tcp": v for k, v in manifest.ports.items()} if manifest.ports else None
            
            # Simplified volume handling for plugins
            volumes = None
            if manifest.volumes:
                volumes = {}
                for host_path, container_path in manifest.volumes.items():
                    # If host_path is relative, we'd normally resolve it to a plugin data dir
                    # For simplicity, passing it as is
                    volumes[host_path] = {'bind': container_path, 'mode': 'rw'}

            container = self.client.containers.run(
                manifest.docker_image,
                name=container_name,
                ports=ports,
                volumes=volumes,
                environment=manifest.environment,
                detach=True,
                restart_policy={"Name": "unless-stopped"}
            )
            return {"status": "installed", "container_id": container.id}
        except Exception as e:
            logger.error(f"Failed to run plugin container {manifest.id}: {e}")
            raise Exception(f"Failed to start container: {e}")

    def uninstall_plugin(self, manifest: PluginManifest):
        if not self.client:
            raise Exception("Docker client not available")
            
        container_name = f"vnav-plugin-{manifest.id}"
        try:
            container = self.client.containers.get(container_name)
            container.stop()
            container.remove(v=True) # Remove anonymous volumes
            return {"status": "uninstalled"}
        except docker.errors.NotFound:
            return {"status": "not_found"}
        except Exception as e:
            logger.error(f"Failed to uninstall plugin {manifest.id}: {e}")
            raise Exception(f"Failed to uninstall: {e}")
