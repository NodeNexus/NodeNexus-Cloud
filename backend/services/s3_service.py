from minio import Minio
import asyncio
import os

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

class S3Service:
    def __init__(self):
        self.client = Minio(
            MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=False
        )

    async def list_buckets(self):
        def _list():
            buckets = self.client.list_buckets()
            return [{"name": b.name, "creation_date": b.creation_date} for b in buckets]
        return await asyncio.to_thread(_list)

    async def create_bucket(self, bucket_name: str):
        def _create():
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
            return {"name": bucket_name, "status": "created"}
        return await asyncio.to_thread(_create)

    async def delete_bucket(self, bucket_name: str):
        def _delete():
            self.client.remove_bucket(bucket_name)
            return {"name": bucket_name, "status": "deleted"}
        return await asyncio.to_thread(_delete)

s3_service = S3Service()
