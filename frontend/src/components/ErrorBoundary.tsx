import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
          <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl max-w-lg w-full text-center flex flex-col items-center">
            <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="text-zinc-400 mb-8 text-sm">
              The application encountered an unexpected error. Our team has been notified.
            </p>
            <div className="bg-black/50 p-4 rounded-xl w-full text-left overflow-x-auto text-xs font-mono text-rose-300 mb-8">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
