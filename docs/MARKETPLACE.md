# Marketplace

The VNAV Marketplace is the central hub for extending your cluster's capabilities.

## Architecture
The Marketplace reads from a Plugin Registry. It displays all available applications categorised logically (e.g., Monitoring, Databases, CI/CD).

## 1-Click Install
When an admin clicks "Install", the system:
1. Pulls the requested `docker_image`.
2. Validates the required ports to ensure no conflicts exist.
3. Creates persistent volumes.
4. Starts the container on the `vnav-network`.
5. Updates the local SQLite database to reflect the installed plugin state.

## Updates and Rollbacks
The Marketplace natively supports semantic versioning. If an app update fails, you can roll back to the previous version using the VNAV Update Center interface.
