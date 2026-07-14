import json
import os
from pathlib import Path
from core.plugins.plugin_schema import PluginManifest
import logging

logger = logging.getLogger(__name__)

class PluginLoader:
    def __init__(self, plugin_dir: str = "plugins"):
        self.plugin_dir = Path(plugin_dir)

    def load_all_plugins(self) -> dict[str, PluginManifest]:
        plugins = {}
        if not self.plugin_dir.exists():
            logger.warning(f"Plugin directory {self.plugin_dir} does not exist. Creating it.")
            self.plugin_dir.mkdir(parents=True, exist_ok=True)
            return plugins

        for item in self.plugin_dir.iterdir():
            if item.is_dir():
                manifest_path = item / "plugin.json"
                if manifest_path.exists():
                    try:
                        with open(manifest_path, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            manifest = PluginManifest(**data)
                            plugins[manifest.id] = manifest
                    except Exception as e:
                        logger.error(f"Failed to load plugin {manifest_path}: {e}")
        return plugins
