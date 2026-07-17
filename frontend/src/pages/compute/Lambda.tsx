import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Play, Code2, Terminal as TerminalIcon } from "lucide-react";
import { fetchApi } from "@/lib/api";

export function Lambda() {
  const [code, setCode] = useState<string>("def handler(event, context):\n    print('Hello from VNAV Lambda!')\n    return {'statusCode': 200, 'body': 'Success'}\n\nhandler({}, {})");
  const [runtime, setRuntime] = useState<string>("python:3.11-alpine");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInvoke = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const data = await fetchApi("/lambda/invoke", {
        method: "POST",
        body: JSON.stringify({ code, runtime })
      });
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during invocation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Lambda Functions</h1>
          <p className="text-text-secondary">Run code without thinking about servers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleInvoke} disabled={loading}>
            <Play size={14} className={`mr-2 ${loading ? "animate-pulse" : ""}`} /> 
            {loading ? "Executing..." : "Invoke Function"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="flex items-center text-lg"><Code2 size={18} className="mr-2 text-primary" /> Function Code</CardTitle>
                <CardDescription>Write your code below. It will be executed in an ephemeral container.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={runtime.includes("python") ? "default" : "outline"} className="cursor-pointer" onClick={() => { setRuntime("python:3.11-alpine"); setCode("print('Hello from Python!')") }}>Python</Badge>
                <Badge variant={runtime.includes("node") ? "default" : "outline"} className="cursor-pointer" onClick={() => { setRuntime("node:18-alpine"); setCode("console.log('Hello from Node.js!');") }}>Node.js</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 rounded-md border border-[#333] focus:outline-none focus:border-primary resize-none scrollbar-thin"
                spellCheck="false"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card className="border-border h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg"><TerminalIcon size={18} className="mr-2 text-primary" /> Execution Results</CardTitle>
              <CardDescription>Output logs from your last invocation.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 bg-[#0d0d0d] rounded-md p-4 border border-[#333] font-mono text-xs overflow-y-auto whitespace-pre-wrap scrollbar-thin h-80">
                {loading ? (
                  <span className="text-text-tertiary">Waiting for container to spin up and execute...</span>
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : output ? (
                  <span className="text-green-400">{output}</span>
                ) : (
                  <span className="text-text-tertiary">No output yet. Click 'Invoke' to test your function.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
