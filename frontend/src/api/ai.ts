const API_BASE = "http://127.0.0.1:8000";

const fetchWithAuth = async (url: string, token: string | null, options: any = {}) => {
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
};

export const aiApi = {
  getModels: (token: string | null) => fetchWithAuth("/ai/models", token),
  getHistory: (token: string | null) => fetchWithAuth("/ai/history", token),
  chatStream: async (token: string | null, messages: any[], model: string, onChunk: (chunk: string) => void) => {
    const res = await fetch(`${API_BASE}/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, model, stream: true })
    });
    
    if (!res.body) throw new Error("No response body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value));
    }
  }
};
