import React from "react";
import { TerminalSquare, Download, Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Terminal() {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Browser Terminal</h1>
          <p className="text-text-secondary">Direct shell access to your compute resources.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Copy size={14} className="mr-2" /> Copy Log</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-2" /> Download</Button>
        </div>
      </div>

      <div className="flex-1 bg-[#09090b] border border-border rounded-lg overflow-hidden flex flex-col font-mono text-sm relative shadow-inner">
        <div className="h-10 bg-surface border-b border-border flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-danger"></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <div className="ml-4 text-xs text-text-tertiary">vnav-homelab@pi-node-1:~</div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto text-text-secondary">
          <div className="mb-2"><span className="text-success">vnav-homelab@pi-node-1</span>:<span className="text-info">~</span>$ docker ps</div>
          <div className="mb-4 text-text-tertiary">
            CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                                       NAMES<br/>
            09f3b2a3c749   vnav-web-backend         "uvicorn main:app --…"   12 minutes ago   Up 12 minutes   0.0.0.0:8000-&gt;8000/tcp                  vnav-backend<br/>
            2a8c91b5d1e2   nginx:alpine             "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes   0.0.0.0:80-&gt;80/tcp                        vnav-frontend
          </div>
          <div className="mb-2 flex items-center">
            <span className="text-success">vnav-homelab@pi-node-1</span>:<span className="text-info">~</span>$ 
            <span className="ml-2 w-2 h-4 bg-primary animate-pulse inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
