from core.plugins.plugin_loader import PluginLoader
from core.plugins.plugin_schema import PluginManifest

class PluginRegistry:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PluginRegistry, cls).__new__(cls)
            cls._instance.plugins = {}
            cls._instance.loader = PluginLoader(plugin_dir="plugins")
        return cls._instance

    def initialize(self):
        self.plugins = self.loader.load_all_plugins()

    def get_all(self) -> list[PluginManifest]:
        return list(self.plugins.values())

    def get_by_id(self, plugin_id: str) -> PluginManifest:
        return self.plugins.get(plugin_id)

    def get_by_category(self, category: str) -> list[PluginManifest]:
        return [p for p in self.plugins.values() if p.category.lower() == category.lower()]
