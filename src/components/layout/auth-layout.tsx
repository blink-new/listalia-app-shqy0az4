import { Outlet } from 'react-router-dom'
import { ThemeToggle } from '../theme-toggle'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Listalia" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Listalia</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Listalia. All rights reserved.</p>
      </footer>
    </div>
  )
}