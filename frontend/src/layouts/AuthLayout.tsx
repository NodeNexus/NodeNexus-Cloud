import { Outlet } from "react-router-dom"
import { useTheme } from "../providers/ThemeProvider"

export const AuthLayout = () => {
  // Use the theme to ensure it properly switches if the user had previous preferences
  useTheme()

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          VNAV Cloud
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Sign in to access your cluster operations center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 py-8 px-4 shadow sm:rounded-3xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
