import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardLayout as Layout } from "./layouts/DashboardLayout"
import { AuthLayout } from "./layouts/AuthLayout"
import { GlobalLoader } from "./components/GlobalLoader"

// Lazy load all pages for production code splitting
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })))
const Register = lazy(() => import("./pages/Register").then(m => ({ default: m.Register })))
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })))
const TerminalPage = lazy(() => import("./pages/Terminal").then(m => ({ default: m.TerminalPage })))
const FileManager = lazy(() => import("./pages/FileManager").then(m => ({ default: m.FileManager })))
const Containers = lazy(() => import("./pages/Containers").then(m => ({ default: m.Containers })))
const Marketplace = lazy(() => import("./pages/Marketplace").then(m => ({ default: m.Marketplace })))
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })))
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })))

const Cluster = lazy(() => import("./pages/cluster/Cluster").then(m => ({ default: m.Cluster })))
const Nodes = lazy(() => import("./pages/cluster/Nodes").then(m => ({ default: m.Nodes })))
const Pods = lazy(() => import("./pages/cluster/Pods").then(m => ({ default: m.Pods })))

const AI = lazy(() => import("./pages/ai/AI").then(m => ({ default: m.AI })))
const AutomationBuilder = lazy(() => import("./pages/ai/AutomationBuilder").then(m => ({ default: m.AutomationBuilder })))

const MonitoringDashboard = lazy(() => import("./pages/monitoring/Dashboard").then(m => ({ default: m.Dashboard })))
const Alerts = lazy(() => import("./pages/monitoring/Alerts").then(m => ({ default: m.Alerts })))
const Notifications = lazy(() => import("./pages/monitoring/Notifications").then(m => ({ default: m.Notifications })))
const Integrations = lazy(() => import("./pages/monitoring/Integrations").then(m => ({ default: m.Integrations })))

const BackupsDashboard = lazy(() => import("./pages/backups/Dashboard").then(m => ({ default: m.Dashboard })))
const Schedules = lazy(() => import("./pages/backups/Schedules").then(m => ({ default: m.Schedules })))
const RestoreWizard = lazy(() => import("./pages/backups/RestoreWizard").then(m => ({ default: m.RestoreWizard })))

const UpdatesDashboard = lazy(() => import("./pages/updates/Dashboard").then(m => ({ default: m.Dashboard })))
const UpdatesHistory = lazy(() => import("./pages/updates/History").then(m => ({ default: m.History })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      suspense: true,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="containers" element={<Containers />} />
            <Route path="terminal" element={<TerminalPage />} />
            <Route path="files" element={<FileManager />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            
            <Route path="monitoring" element={<MonitoringDashboard />} />
            <Route path="monitoring/health" element={<MonitoringDashboard />} />
            <Route path="monitoring/alerts" element={<Alerts />} />
            <Route path="monitoring/notifications" element={<Notifications />} />
            <Route path="monitoring/integrations" element={<Integrations />} />
            
            <Route path="backups" element={<BackupsDashboard />} />
            <Route path="backups/schedules" element={<Schedules />} />
            <Route path="backups/restore" element={<RestoreWizard />} />
            
            <Route path="updates" element={<UpdatesDashboard />} />
            <Route path="updates/history" element={<UpdatesHistory />} />
            
            <Route path="cluster" element={<Cluster />} />
            <Route path="nodes" element={<Nodes />} />
            <Route path="pods" element={<Pods />} />
            
            <Route path="ai" element={<AI />} />
            <Route path="ai/automation" element={<AutomationBuilder />} />
          </Route>
        </Routes>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
