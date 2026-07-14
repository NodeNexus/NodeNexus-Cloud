import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { Containers } from "./pages/Containers"
import { Marketplace } from "./pages/Marketplace"
import { Monitoring } from "./pages/Monitoring"
import { Settings } from "./pages/Settings"
import { TerminalPage } from "./pages/Terminal"
import { FileManager } from "./pages/FileManager"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="containers" element={<Containers />} />
            <Route path="terminal" element={<TerminalPage />} />
            <Route path="files" element={<FileManager />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
