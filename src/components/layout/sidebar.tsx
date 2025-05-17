import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useLists } from '../../context/lists-context'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { 
  Home, 
  Plus, 
  FolderPlus, 
  ShoppingCart, 
  CheckSquare, 
  Users,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react'
import { ListType } from '../../context/lists-context'
import { useAuth } from '../../context/auth-context'
import { useIsMobile } from '../../hooks/use-mobile'

type SidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { lists, folders } = useLists()
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  const getListIcon = (type: ListType) => {
    switch (type) {
      case 'shopping':
        return <ShoppingCart className="h-4 w-4" />
      case 'chore':
        return <Users className="h-4 w-4" />
      case 'task':
      default:
        return <CheckSquare className="h-4 w-4" />
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!open) {
    return (
      <div 
        className="w-2 h-full cursor-pointer hover:bg-accent" 
        onClick={() => setOpen(true)}
      />
    )
  }

  return (
    <aside className={cn(
      "w-64 h-full bg-sidebar border-r border-sidebar-border transition-all duration-200",
      isMobile && "fixed z-40 shadow-lg"
    )}>
      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Main Navigation */}
      <div className="p-2">
        <Link to="/app/dashboard">
          <Button 
            variant={location.pathname === '/app/dashboard' ? 'default' : 'ghost'} 
            className="w-full justify-start"
            size="sm"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Lists</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        {/* Folders */}
        <div className="px-2 pb-2">
          {folders.map(folder => (
            <div key={folder.id} className="mb-1">
              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md"
                onClick={() => toggleFolder(folder.id)}
              >
                {expandedFolders[folder.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="truncate">{folder.name}</span>
              </button>

              {expandedFolders[folder.id] && (
                <div className="ml-6 mt-1 space-y-1">
                  {lists
                    .filter(list => list.folderId === folder.id)
                    .map(list => (
                      <Link 
                        key={list.id} 
                        to={`/app/list/${list.id}`}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-sidebar-accent rounded-md",
                          location.pathname === `/app/list/${list.id}` && "bg-sidebar-accent"
                        )}
                      >
                        {getListIcon(list.type)}
                        <span className="truncate">{list.title}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}

          {/* Lists without folders */}
          {lists
            .filter(list => !list.folderId)
            .map(list => (
              <Link 
                key={list.id} 
                to={`/app/list/${list.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-sidebar-accent rounded-md",
                  location.pathname === `/app/list/${list.id}` && "bg-sidebar-accent"
                )}
              >
                {getListIcon(list.type)}
                <span className="truncate">{list.title}</span>
              </Link>
            ))}
        </div>
      </ScrollArea>

      {/* Bottom Utilities */}
      <div className="absolute bottom-0 w-full p-2 border-t border-sidebar-border">
        <div className="flex justify-between">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
