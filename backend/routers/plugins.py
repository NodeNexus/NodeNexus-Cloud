from fastapi import APIRouter, HTTPException
from core.plugins.plugin_registry import PluginRegistry
from core.plugins.plugin_manager import PluginManager
from core.plugins.plugin_schema import PluginStatusResponse

router = APIRouter(prefix="/plugins", tags=["Plugins"])

registry = PluginRegistry()
registry.initialize() # Load all manifests at startup
manager = PluginManager()

@router.get("", response_model=list[PluginStatusResponse])
async def list_plugins():
    plugins = registry.get_all()
    results = []
    for p in plugins:
        status = manager.get_plugin_status(p)
        results.append(PluginStatusResponse(
            manifest=p,
            installed=status["installed"],
            status=status["status"]
        ))
    return results

@router.get("/categories")
async def get_categories():
    plugins = registry.get_all()
    categories = list(set([p.category for p in plugins]))
    return categories

@router.post("/{plugin_id}/install")
async def install_plugin(plugin_id: str):
    plugin = registry.get_by_id(plugin_id)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found in registry")
    
    try:
        res = manager.install_plugin(plugin)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{plugin_id}/uninstall")
async def uninstall_plugin(plugin_id: str):
    plugin = registry.get_by_id(plugin_id)
    if not plugin:
        raise HTTPException(status_code=404, detail="Plugin not found in registry")
    
    try:
        res = manager.uninstall_plugin(plugin)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
