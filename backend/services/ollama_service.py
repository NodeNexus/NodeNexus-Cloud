import ollama
import logging

logger = logging.getLogger(__name__)

class OllamaService:
    @staticmethod
    def get_models():
        try:
            res = ollama.list()
            return [{"name": m.model, "size": str(m.size), "modified_at": str(m.modified_at)} for m in res.models]
        except Exception as e:
            logger.error(f"Failed to fetch ollama models: {e}")
            return []

    @staticmethod
    def pull_model(model_name: str):
        try:
            # Note: pulling is blocking/long in synchronous, use stream=True usually, but for simple endpoint we'll start it
            ollama.pull(model_name)
            return True
        except Exception as e:
            logger.error(f"Failed to pull model {model_name}: {e}")
            return False

    @staticmethod
    def delete_model(model_name: str):
        try:
            ollama.delete(model_name)
            return True
        except Exception as e:
            logger.error(f"Failed to delete model {model_name}: {e}")
            return False

    @staticmethod
    def chat_stream(model: str, messages: list):
        try:
            response = ollama.chat(model=model, messages=messages, stream=True)
            for chunk in response:
                yield chunk['message']['content']
        except Exception as e:
            logger.error(f"Ollama chat error: {e}")
            yield f"Error connecting to local Ollama instance: {e}"
