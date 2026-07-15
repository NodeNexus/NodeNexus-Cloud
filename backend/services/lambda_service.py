import docker
import asyncio
import uuid

class LambdaService:
    def __init__(self):
        self.client = docker.from_env()

    async def invoke_function(self, code: str, runtime: str = "python:3.11-alpine"):
        def _invoke():
            name = f"lambda-{uuid.uuid4().hex[:8]}"
            # We create an ephemeral container that runs the code and returns the output
            try:
                if "python" in runtime:
                    cmd = ["python", "-c", code]
                elif "node" in runtime:
                    cmd = ["node", "-e", code]
                else:
                    return {"error": "Unsupported runtime"}

                container = self.client.containers.run(
                    runtime,
                    command=cmd,
                    remove=True,
                    mem_limit="128m",
                    labels={"vnav.service": "lambda"}
                )
                return {"result": container.decode('utf-8')}
            except Exception as e:
                return {"error": str(e)}
        return await asyncio.to_thread(_invoke)

lambda_service = LambdaService()
