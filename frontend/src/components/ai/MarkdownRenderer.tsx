import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            
            // Special handling for tool blocks
            if (!inline && match && match[1] === 'tool') {
               return (
                 <div className="bg-black/50 border border-blue-500/20 rounded-xl p-4 my-4">
                   <div className="text-xs text-blue-400 font-bold mb-2 uppercase tracking-wider">Tool Execution</div>
                   <div className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">{String(children).replace(/\n$/, '')}</div>
                 </div>
               )
            }

            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-4 border border-white/10">
                <div className="bg-zinc-800/80 px-4 py-2 text-xs font-mono text-zinc-400 border-b border-white/5 flex justify-between">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, background: 'transparent', padding: '1rem' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code {...props} className="bg-zinc-800 px-1.5 py-0.5 rounded-md text-sm text-pink-400 font-mono">
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
