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
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Profile } from "./pages/Profile"
import { Users } from "./pages/admin/Users"
import { Roles } from "./pages/admin/Roles"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AdminRoute } from "./components/auth/AdminRoute"

import { Cluster } from "./pages/cluster/Cluster"
import { Nodes } from "./pages/cluster/Nodes"
import { Pods } from "./pages/cluster/Pods"
import { Deployments } from "./pages/cluster/Deployments"
import { Helm } from "./pages/cluster/Helm"
import { EdgeDevices } from "./pages/cluster/EdgeDevices"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="containers" element={<Containers />} />
              <Route path="terminal" element={<TerminalPage />} />
              <Route path="files" element={<FileManager />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              
              <Route path="cluster" element={<Cluster />} />
              <Route path="nodes" element={<Nodes />} />
              <Route path="pods" element={<Pods />} />
              <Route path="deployments" element={<Deployments />} />
              <Route path="helm" element={<Helm />} />
              <Route path="edge" element={<EdgeDevices />} />

              <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
              <Route path="roles" element={<AdminRoute><Roles /></AdminRoute>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
