import { useState, useEffect } from 'react'
import { 
  createBrowserRouter, 
  RouterProvider,
  Navigate,
  RouteObject 
} from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './context/auth-context'
import { ListsProvider } from './context/lists-context'
import { PreferencesProvider } from './context/preferences-context'
import { Toaster } from './components/ui/toaster'

// Pages
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import ListDetail from './pages/list-detail'
import Profile from './pages/profile'
import NotFound from './pages/not-found'

// Layout
import AppLayout from './components/layout/app-layout'
import AuthLayout from './components/layout/auth-layout'

// Helpers
import { ProtectedRoute } from './components/protected-route'

// Create routes
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'list/:listId',
        element: <ListDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

// Create router
const router = createBrowserRouter(routes)

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="listalia-theme">
      <AuthProvider>
        <PreferencesProvider>
          <ListsProvider>
            <RouterProvider router={router} />
            <Toaster />
          </ListsProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App