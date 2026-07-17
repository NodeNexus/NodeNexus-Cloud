import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { TerminalSquare, Download, Copy, Maximize, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/api";

interface Container {
  id: string;
  name: string;
  image: string;
}

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchApi("/system/containers").then(setContainers).catch(console.error);
  }, []);

  const connectToContainer = () => {
    if (!selectedContainer || !terminalRef.current) return;
    
    // Cleanup previous session
    if (wsRef.current) wsRef.current.close();
    if (xtermRef.current) xtermRef.current.dispose();

    const term = new XTerm({
      cursorBlink: true,
      theme: { background: "#09090b" },
      fontFamily: 'monospace',
      fontSize: 14,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln(`Connecting to container ${selectedContainer}...`);

    const ws = new WebSocket(`ws://localhost:8000/ws/terminal/${selectedContainer}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      term.clear();
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      setConnected(false);
      term.writeln("\r\nConnection closed.");
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    const handleResize = () => {
      if (fitAddonRef.current) fitAddonRef.current.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (xtermRef.current) xtermRef.current.dispose();
    };
  }, []);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Browser Terminal</h1>
          <p className="text-text-secondary">Direct shell access to your compute resources.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-surface text-text-primary border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
            value={selectedContainer}
            onChange={(e) => setSelectedContainer(e.target.value)}
          >
            <option value="">Select a container...</option>
            {containers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.image})</option>
            ))}
          </select>
          <Button size="sm" onClick={connectToContainer} disabled={!selectedContainer}>
            <Play size={14} className="mr-2" /> Connect
          </Button>
          <Button variant="outline" size="sm" onClick={() => fitAddonRef.current?.fit()}>
            <Maximize size={14} className="mr-2" /> Fit Window
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-[#09090b] border border-border rounded-lg overflow-hidden flex flex-col relative shadow-inner">
        <div className="h-10 bg-surface border-b border-border flex items-center px-4 gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-success' : 'bg-danger'}`}></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <div className="ml-4 text-xs text-text-tertiary font-mono">
            {connected ? `Connected to ${selectedContainer}` : 'Disconnected'}
          </div>
        </div>
        
        <div className="flex-1 p-2 overflow-hidden w-full h-full" ref={terminalRef}></div>
      </div>
    </div>
  );
}
