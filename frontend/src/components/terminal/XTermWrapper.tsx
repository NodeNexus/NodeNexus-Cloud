import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface XTermWrapperProps {
  cwd?: string;
  onDisconnect?: () => void;
}

export const XTermWrapper: React.FC<XTermWrapperProps> = ({ cwd = "/", onDisconnect }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#09090b', // zinc-950
        foreground: '#f4f4f5', // zinc-50
        cursor: '#f4f4f5',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle Resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Initialize WebSocket
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use localhost:8000 since Vite runs on 5173 but our API is typically on 8000
    // We should ideally use the same host but port 8000, or proxy.
    const wsUrl = `${wsProtocol}//127.0.0.1:8000/terminal/ws?cwd=${encodeURIComponent(cwd)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      term.writeln('\x1b[32m[Connected to Terminal]\x1b[0m');
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      term.writeln('\x1b[31m\r\n[Disconnected from Terminal]\x1b[0m');
      if (onDisconnect) onDisconnect();
    };

    ws.onerror = () => {
      term.writeln('\x1b[31m\r\n[WebSocket Error]\x1b[0m');
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    wsRef.current = ws;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      term.dispose();
    };
  }, [cwd, onDisconnect]);

  return (
    <div className="w-full h-full p-2 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
};
