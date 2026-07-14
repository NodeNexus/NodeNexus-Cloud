# AI Operations Center (VNAV AI)

VNAV Cloud integrates a powerful AI agent system natively using Ollama.

## Ollama Integration
The platform automatically detects if Ollama is running locally. You can pull models (e.g., `llama3`, `mistral`) directly through the VNAV AI UI.

## Adding New Tools
The AI Agents are equipped with function-calling capabilities. To add a new tool to the AI:
1. Define the tool schema in `backend/schemas/ai.py`.
2. Implement the actual Python function in the appropriate agent service (e.g., `docker_agent.py`, `system_agent.py`).
3. Add the function to the routing logic in `routers/ai.py`.

## Modifying Prompts
The core system prompts that define the AI's personality and constraints are located in `backend/services/agent_service.py`. Modify these to adjust how the AI interacts with the user regarding cluster infrastructure.
