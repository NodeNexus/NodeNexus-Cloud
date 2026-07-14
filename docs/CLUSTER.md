# Kubernetes & Edge Computing

VNAV Cloud contains a built-in control plane for managing Edge device clusters (e.g., Raspberry Pis) via Kubernetes.

## The Cluster Manager
The application uses the `kubernetes-python` SDK to interface with `kube-apiserver`. 
If you are deploying VNAV Cloud inside a cluster, it automatically acquires credentials from the local ServiceAccount. If running externally, provide a `KUBECONFIG`.

## Monitoring Nodes
The **Nodes** dashboard polls the Kubernetes metrics server (if installed) to display real-time CPU and Memory consumption across your entire Edge cluster. 

## Deployments and Pods
Through the VNAV UI, you can dynamically view, restart, and delete Pods or scale Deployments without dropping into the terminal.

## Helm Integration
VNAV Cloud can interface with Helm to install and manage Charts. This allows the VNAV Marketplace to deploy complex, multi-container applications across your Kubernetes cluster seamlessly.
