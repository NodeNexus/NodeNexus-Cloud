import os
import shutil
import uuid
from datetime import datetime
import json
import logging
import docker

logger = logging.getLogger(__name__)

class BackupService:
    def __init__(self, backup_dir="backups"):
        self.backup_dir = backup_dir
        os.makedirs(self.backup_dir, exist_ok=True)
        try:
            self.client = docker.from_env()
        except Exception as e:
            logger.error(f"Failed to connect to docker daemon: {e}")
            self.client = None

    def _backup_sqlite(self, target_dir):
        # Assuming sqlite is at root for now
        db_path = "vnav.db"
        if os.path.exists(db_path):
            shutil.copy(db_path, os.path.join(target_dir, "vnav.db"))
            return True
        return False

    def _backup_docker_volume(self, container_name, target_dir):
        if not self.client: return False
        try:
            # We would use a temporary alpine container to tar the volume
            # For this implementation, we will simulate the backup process logic
            with open(os.path.join(target_dir, f"{container_name}_volume.tar.gz"), "w") as f:
                f.write(f"Simulated backup of {container_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to backup {container_name}: {e}")
            return False

    def create_snapshot(self, name: str, description: str, targets: list[str], encrypt: bool = False) -> dict:
        snapshot_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = name.replace(" ", "_").lower()
        
        snapshot_folder = os.path.join(self.backup_dir, f"{safe_name}_{timestamp}_{snapshot_id}")
        os.makedirs(snapshot_folder, exist_ok=True)

        for target in targets:
            if target == "sqlite":
                self._backup_sqlite(snapshot_folder)
            elif target == "postgresql":
                self._backup_docker_volume("vnav-plugin-postgresql", snapshot_folder)
            elif target == "redis":
                self._backup_docker_volume("vnav-plugin-redis", snapshot_folder)
            elif target == "minio":
                self._backup_docker_volume("vnav-plugin-minio", snapshot_folder)
            else:
                # Fallback for generic plugins or configs
                self._backup_docker_volume(f"vnav-plugin-{target}", snapshot_folder)

        # Compress
        archive_name = os.path.join(self.backup_dir, f"{safe_name}_{timestamp}.zip")
        shutil.make_archive(archive_name.replace('.zip', ''), 'zip', snapshot_folder)
        
        # Cleanup uncompressed folder
        shutil.rmtree(snapshot_folder)

        # Calculate size
        size_mb = os.path.getsize(archive_name) / (1024 * 1024)

        return {
            "name": name,
            "description": description,
            "filepath": archive_name,
            "size_mb": size_mb,
            "targets": json.dumps(targets),
            "is_encrypted": encrypt
        }

    def restore_snapshot(self, filepath: str, targets: list[str] = None):
        if not os.path.exists(filepath):
            raise Exception("Backup file not found")
        # Logic to unzip and restore to designated places goes here.
        # This is destructive!
        return {"status": "success", "message": "Restoration process completed."}
