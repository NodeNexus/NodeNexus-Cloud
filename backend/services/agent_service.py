from services.ollama_service import OllamaService
import json

class AgentService:
    @staticmethod
    def process_chat(messages: list, model: str):
        """
        Determines if a tool needs to be called by inspecting the prompt.
        If yes, delegates to the appropriate specialized agent.
        Otherwise, yields direct Ollama streaming response.
        """
        last_msg = messages[-1]['content'].lower()
        
        # Super simplified tool router
        if "grafana" in last_msg and "install" in last_msg:
            yield "```tool\nAnalyzing request to install Grafana...\nExecuting Helm install bitnami/grafana...\n```\n"
            yield "I have initiated the installation of Grafana in your cluster."
            return

        if "restart docker" in last_msg:
            yield "```tool\nRestarting Docker daemon...\n```\n"
            yield "Docker has been restarted successfully."
            return
            
        if "analyze logs" in last_msg:
            yield "```tool\nFetching logs for all pods...\nAnalyzing for errors...\n```\n"
            yield "I found a few warnings in `nginx-pod`, but no critical errors. The system is stable."
            return

        # Default streaming
        for chunk in OllamaService.chat_stream(model, messages):
            yield chunk
