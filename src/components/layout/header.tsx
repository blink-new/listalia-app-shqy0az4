import { useLocation, Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme-toggle'
import { Menu, Search, Bell, Plus } from 'lucide-react'
import { useLists } from '../../context/lists-context'
import { cn } from '../../lib/utils'
import { useIsMobile } from '../../hooks/use-mobile'

type HeaderProps = {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const { lists } = useLists()
  const isMobile = useIsMobile()
  
  // Generate breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname
    
    if (path === '/app/dashboard') {
      return 'Dashboard'
    }
    
    if (path.startsWith('/app/list/')) {
      const listId = path.split('/').pop()
      const list = lists.find(l => l.id === listId)
      return list ? list.title : 'List Detail'
    }

    if (path === '/app/profile') {
      return 'Profile'
    }
    
    return ''
  }

  return (
    <header className="h-14 border-b flex items-center gap-4 px-4 bg-background">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleSidebar}
        className="shrink-0"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 flex items-center">
        <h1 className={cn(
          "text-lg font-semibold transition-opacity duration-200",
          isMobile && sidebarOpen && "opacity-0"
        )}>
          {getBreadcrumb()}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {!isMobile && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search..." 
              className="h-9 w-60 rounded-md border border-input bg-background px-8 text-sm ring-offset-background"
            />
          </div>
        )}
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button 
          size="sm" 
          className="h-9 gap-1"
          asChild
        >
          <Link to="/app/dashboard">
            <Plus className="h-4 w-4" />
            <span className={cn(!isMobile ? "block" : "hidden")}>New List</span>
          </Link>
        </Button>
        
        <ThemeToggle />
      </div>
    </header>
  )
}
