import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLists } from '../context/lists-context'
import { usePreferences } from '../context/preferences-context'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Plus, Grid, List as ListIcon, AlignLeft, Folder, Search as SearchIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { ListType } from '../context/lists-context'

export default function Dashboard() {
  const { lists, folders } = useLists()
  const { preferences, updatePreferences } = usePreferences()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<ListType | 'all'>('all')

  // Filter lists by search term and type
  const filteredLists = lists.filter(list => {
    // Apply search filter
    const matchesSearch = search === '' || 
      list.title.toLowerCase().includes(search.toLowerCase()) ||
      (list.description && list.description.toLowerCase().includes(search.toLowerCase()))
    
    // Apply type filter
    const matchesType = filterType === 'all' || list.type === filterType
    
    return matchesSearch && matchesType
  })

  // Render the appropriate list view based on preferences
  const renderListView = () => {
    switch (preferences.viewMode) {
      case 'grid':
        return renderGridView()
      case 'row':
        return renderRowView()
      case 'compact':
        return renderCompactView()
      case 'folders':
        return renderFoldersView()
      default:
        return renderGridView()
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = (list: typeof lists[0]) => {
    if (list.items.length === 0) return 0
    const completedItems = list.items.filter(item => item.completed).length
    return Math.round((completedItems / list.items.length) * 100)
  }

  // Render grid view (cards)
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredLists.map(list => (
        <Card key={list.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <Link to={`/app/list/${list.id}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">
                  {list.type === 'shopping' ? 'Shopping' : 
                   list.type === 'chore' ? 'Chores' : 'Tasks'}
                </Badge>
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: list.color }}
                />
              </div>
              <CardTitle>{list.title}</CardTitle>
              {list.description && (
                <CardDescription className="line-clamp-2">
                  {list.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              {preferences.showProgressBars && list.items.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{getCompletionPercentage(list)}%</span>
                  </div>
                  <Progress value={getCompletionPercentage(list)} className="h-1.5" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                <div>
                  {list.items.length} items
                </div>
                <div>
                  {new Date(list.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
      
      {/* Add New List Card */}
      <Card className="border-dashed hover:shadow-md transition-shadow">
        <Link to="/app/list/new" className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-primary/10 p-3 rounded-full mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium">Create New List</p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Add tasks, shopping items, or family chores
          </p>
        </Link>
      </Card>
    </div>
  )

  // Render row view (table-like)
  const renderRowView = () => (
    <div className="space-y-2">
      {filteredLists.map(list => (
        <Link 
          key={list.id} 
          to={`/app/list/${list.id}`}
          className="flex items-center p-3 rounded-lg hover:bg-accent border"
        >
          <div 
            className="h-10 w-10 rounded-md mr-4 flex items-center justify-center"
            style={{ backgroundColor: list.color }}
          >
            {list.type === 'shopping' ? 
              <ListIcon className="h-5 w-5 text-white" /> : 
              <AlignLeft className="h-5 w-5 text-white" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{list.title}</h3>
            {list.description && (
              <p className="text-sm text-muted-foreground truncate">
                {list.description}
              </p>
            )}
          </div>
          <div className="ml-4 text-right">
            <div className="text-sm">{list.items.length} items</div>
            <div className="text-xs text-muted-foreground">
              {new Date(list.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      ))}
      
      {/* Add New List (Row) */}
      <Link 
        to="/app/list/new"
        className="flex items-center p-3 rounded-lg hover:bg-accent border border-dashed"
      >
        <div className="h-10 w-10 rounded-md mr-4 bg-primary/10 flex items-center justify-center">
          <Plus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Create New List</h3>
          <p className="text-sm text-muted-foreground">
            Add tasks, shopping items, or family chores
          </p>
        </div>
      </Link>
    </div>
  )

  // Render compact view (minimal)
  const renderCompactView = () => (
    <div className="space-y-1">
      {filteredLists.map(list => (
        <Link 
          key={list.id} 
          to={`/app/list/${list.id}`}
          className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
        >
          <div 
            className="h-2 w-2 rounded-full mr-3"
            style={{ backgroundColor: list.color }}
          />
          <span className="flex-1 truncate">{list.title}</span>
          <span className="text-xs text-muted-foreground">
            {list.items.length} items
          </span>
        </Link>
      ))}
      
      {/* Add New List (Compact) */}
      <Link 
        to="/app/list/new"
        className="flex items-center py-2 px-3 rounded-md hover:bg-accent text-primary"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span>Create New List</span>
      </Link>
    </div>
  )

  // Render folders view (grouped by folder)
  const renderFoldersView = () => (
    <div className="space-y-6">
      {/* Lists without folders */}
      <div>
        <h3 className="font-medium mb-2">No Folder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
          {filteredLists
            .filter(list => !list.folderId)
            .map(list => (
              <Link 
                key={list.id} 
                to={`/app/list/${list.id}`}
                className="flex items-center p-2 rounded-md hover:bg-accent"
              >
                <div 
                  className="h-3 w-3 rounded-full mr-3"
                  style={{ backgroundColor: list.color }}
                />
                <span className="flex-1 truncate">{list.title}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {list.items.length}
                </span>
              </Link>
            ))}
        </div>
      </div>
      
      {/* Lists grouped by folder */}
      {folders.map(folder => {
        const folderLists = filteredLists.filter(list => list.folderId === folder.id)
        if (folderLists.length === 0) return null
        
        return (
          <div key={folder.id}>
            <h3 className="font-medium mb-2 flex items-center">
              <Folder className="h-4 w-4 mr-2" style={{ color: folder.color }} />
              {folder.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
              {folderLists.map(list => (
                <Link 
                  key={list.id} 
                  to={`/app/list/${list.id}`}
                  className="flex items-center p-2 rounded-md hover:bg-accent"
                >
                  <div 
                    className="h-3 w-3 rounded-full mr-3"
                    style={{ backgroundColor: list.color }}
                  />
                  <span className="flex-1 truncate">{list.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {list.items.length}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
      
      {/* Add New List (Folder View) */}
      <Link 
        to="/app/list/new"
        className="flex items-center py-2 px-3 rounded-md hover:bg-accent text-primary"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span>Create New List</span>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold">Your Lists</h1>
        
        <Button asChild>
          <Link to="/app/list/new" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search and Filter */}
        <div className="w-full md:w-64 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search lists..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filterType === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button 
                variant={filterType === 'task' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('task')}
              >
                Tasks
              </Button>
              <Button 
                variant={filterType === 'shopping' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('shopping')}
              >
                Shopping
              </Button>
              <Button 
                variant={filterType === 'chore' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('chore')}
              >
                Chores
              </Button>
            </div>
          </div>
        </div>
        
        {/* Lists */}
        <div className="flex-1">
          {/* View Mode Selector */}
          <Tabs 
            defaultValue={preferences.viewMode} 
            className="mb-6"
            onValueChange={(value) => updatePreferences({ viewMode: value as any })}
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="row">
                <ListIcon className="h-4 w-4 mr-2" />
                Row
              </TabsTrigger>
              <TabsTrigger value="compact">
                <AlignLeft className="h-4 w-4 mr-2" />
                Compact
              </TabsTrigger>
              <TabsTrigger value="folders">
                <Folder className="h-4 w-4 mr-2" />
                Folders
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={preferences.viewMode}>
              {renderListView()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}