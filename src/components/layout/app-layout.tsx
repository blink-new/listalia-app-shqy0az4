import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { useAuth } from '../../context/auth-context'
import { useLists } from '../../context/lists-context'
import { usePreferences } from '../../context/preferences-context'
import { useIsMobile } from '../../hooks/use-mobile'

export default function AppLayout() {
  const { isLoading: isAuthLoading } = useAuth()
  const { isLoading: isListsLoading } = useLists()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])
  
  // If still loading, show loading state
  if (isAuthLoading || isListsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <Header 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-auto p-4 transition-all duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  )
}