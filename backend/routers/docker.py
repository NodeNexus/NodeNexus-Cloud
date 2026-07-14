from fastapi import APIRouter, Depends
from schemas.docker import ContainerInfo, ImageInfo, DockerActionResponse
from services.docker_service import DockerService

router = APIRouter(prefix="/docker", tags=["Docker"])

def get_docker_service() -> DockerService:
    return DockerService()

@router.get("/containers", response_model=list[ContainerInfo])
async def list_containers(service: DockerService = Depends(get_docker_service)):
    return await service.list_containers()

@router.get("/images", response_model=list[ImageInfo])
async def list_images(service: DockerService = Depends(get_docker_service)):
    return await service.list_images()

@router.post("/start/{id}", response_model=DockerActionResponse)
async def start_container(id: str, service: DockerService = Depends(get_docker_service)):
    return await service.start_container(id)

@router.post("/stop/{id}", response_model=DockerActionResponse)
async def stop_container(id: str, service: DockerService = Depends(get_docker_service)):
    return await service.stop_container(id)

@router.post("/restart/{id}", response_model=DockerActionResponse)
async def restart_container(id: str, service: DockerService = Depends(get_docker_service)):
    return await service.restart_container(id)

@router.delete("/container/{id}", response_model=DockerActionResponse)
async def delete_container(id: str, service: DockerService = Depends(get_docker_service)):
    return await service.delete_container(id)

@router.get("/logs/{id}")
async def get_logs(id: str, service: DockerService = Depends(get_docker_service)):
    logs = await service.get_logs(id)
    return {"logs": logs}
