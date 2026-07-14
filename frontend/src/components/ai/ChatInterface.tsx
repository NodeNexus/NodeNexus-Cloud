import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { aiApi } from '../../api/ai';
import { Send, Bot, User, Loader2, StopCircle } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { motion } from 'framer-motion';

export const ChatInterface = () => {
  const { token } = useStore();
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I am VNAV AI. I can help you manage your clusters, deploy applications, and analyze system health. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const updatedMessages = [...messages, userMessage];
    
    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      await aiApi.chatStream(token, updatedMessages, 'llama3.2', (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.content += chunk;
          }
          return newMessages;
        });
      });
    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.content += "\n\n**Error**: Connection to AI service failed.";
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-white/10 backdrop-blur-md border border-white/10'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-zinc-300" />}
            </div>
            
            <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
               {msg.role === 'user' ? (
                 <div className="bg-blue-600/20 border border-blue-500/20 text-white px-5 py-3 rounded-2xl rounded-tr-sm inline-block">
                   {msg.content}
                 </div>
               ) : (
                 <div className="bg-white/5 border border-white/5 text-zinc-300 px-5 py-3 rounded-2xl rounded-tl-sm w-full">
                   <MarkdownRenderer content={msg.content} />
                   
                   {loading && i === messages.length - 1 && msg.content === '' && (
                     <div className="flex items-center gap-2 text-zinc-500 mt-2">
                       <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                     </div>
                   )}
                 </div>
               )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto relative flex items-end gap-4">
          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask VNAV AI to analyze logs, deploy a container, or check health..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none min-h-[60px] max-h-[200px]"
            rows={1}
          />
          <button 
            onClick={loading ? undefined : handleSend}
            disabled={!input.trim() && !loading}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-colors ${loading ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:bg-zinc-800'}`}
          >
            {loading ? <StopCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center mt-3 text-xs text-zinc-500">
          VNAV AI can make mistakes. Consider verifying important actions.
        </div>
      </div>
    </div>
  );
};
