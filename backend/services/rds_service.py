import asyncio
from services.ec2_service import ec2_service

class RDSService:
    async def list_databases(self):
        instances = await ec2_service.list_instances()
        # Filter for instances with rds tag or known db images
        dbs = [i for i in instances if "postgres" in i["image"] or "mysql" in i["image"]]
        return dbs

    async def create_database(self, engine: str, instance_type: str = "t2.micro"):
        image = "postgres:15-alpine" if engine == "postgres" else "mysql:8.0"
        
        # We use EC2 service to launch the database container
        return await ec2_service.run_instance(image=image, instance_type=instance_type)

    async def delete_database(self, instance_id: str):
        return await ec2_service.terminate_instance(instance_id)

rds_service = RDSService()
