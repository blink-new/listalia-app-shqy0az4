import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLists } from '../context/lists-context'
import { usePreferences } from '../context/preferences-context'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { Switch } from '../components/ui/switch'
import { Label } from '../components/ui/label'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Circle, 
  Image,
  FileText,
  EyeOff,
  Eye
} from 'lucide-react'
import { cn } from '../lib/utils'

export default function ListDetail() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const { getList, addItem, updateItem, deleteItem } = useLists()
  const { preferences } = usePreferences()
  const [list, setList] = useState(listId !== 'new' ? getList(listId!) : null)
  const [newItemText, setNewItemText] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false)
  
  // Refresh list when it changes
  useEffect(() => {
    if (listId && listId !== 'new') {
      setList(getList(listId))
    }
  }, [listId, getList])
  
  // Check if list exists
  if (listId !== 'new' && !list) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">List Not Found</h2>
        <p className="text-muted-foreground mb-4">The list you're looking for doesn't exist or was deleted</p>
        <Button onClick={() => navigate('/app/dashboard')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }
  
  // Calculate list stats
  const getCompletionPercentage = () => {
    if (!list || list.items.length === 0) return 0
    const completedItems = list.items.filter(item => item.completed).length
    return Math.round((completedItems / list.items.length) * 100)
  }
  
  // Filter items based on preferences
  const getFilteredItems = () => {
    if (!list) return []
    
    let items = [...list.items]
    
    // Sort by order
    items.sort((a, b) => a.order - b.order)
    
    // Filter completed items if needed
    if (!preferences.showCompleted) {
      items = items.filter(item => !item.completed)
    }
    
    return items
  }

  // Handle adding a new item
  const handleAddItem = async () => {
    if (!list || !newItemText.trim()) return
    
    try {
      await addItem(list.id, {
        text: newItemText.trim(),
        completed: false,
      })
      
      setNewItemText('')
      setIsAddingItem(false)
      // Refresh list data
      setList(getList(list.id))
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }
  
  // Handle toggling item completion
  const handleToggleComplete = async (itemId: string, completed: boolean) => {
    if (!list) return
    
    try {
      await updateItem(list.id, itemId, { completed })
      // Refresh list data
      setList(getList(list.id))
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }
  
  // Handle deleting an item
  const handleDeleteItem = async (itemId: string) => {
    if (!list) return
    
    try {
      await deleteItem(list.id, itemId)
      // Refresh list data
      setList(getList(list.id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Handle go back
  const handleGoBack = () => {
    navigate('/app/dashboard')
  }

  return (
    <div>
      {/* List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {list?.title || 'New List'}
            </h1>
            {list?.description && (
              <p className="text-muted-foreground">
                {list.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {listId !== 'new' && (
            <>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* List Progress */}
      {list && list.items.length > 0 && preferences.showProgressBars && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">{getCompletionPercentage()}% Complete</span>
                <p className="text-sm text-muted-foreground">
                  {list.items.filter(item => item.completed).length} of {list.items.length} items completed
                </p>
              </div>
              <Badge variant="outline">
                {list.type === 'shopping' ? 'Shopping List' : 
                 list.type === 'chore' ? 'Family Chores' : 'Task List'}
              </Badge>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </CardContent>
        </Card>
      )}
      
      {/* View Options */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-completed" 
            checked={preferences.showCompleted}
            onCheckedChange={value => 
              preferences.updatePreferences({ showCompleted: value })
            }
          />
          <Label htmlFor="show-completed">Show Completed</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-notes" 
            checked={preferences.showNotes}
            onCheckedChange={value => 
              preferences.updatePreferences({ showNotes: value })
            }
          />
          <Label htmlFor="show-notes">Show Notes</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-images" 
            checked={preferences.showImages}
            onCheckedChange={value => 
              preferences.updatePreferences({ showImages: value })
            }
          />
          <Label htmlFor="show-images">Show Images</Label>
        </div>
      </div>
            
      {/* List Items */}
      {list && (
        <div className="space-y-2">
          {getFilteredItems().map(item => (
            <div 
              key={item.id} 
              className={cn(
                "flex items-start p-3 rounded-md border",
                item.completed && "bg-accent/50"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Checkbox 
                  checked={item.completed}
                  onCheckedChange={checked => 
                    handleToggleComplete(item.id, checked as boolean)
                  }
                />
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <p className={cn(
                  "font-medium",
                  item.completed && "line-through text-muted-foreground"
                )}>
                  {item.text}
                </p>
                
                {/* Show notes if enabled and present */}
                {preferences.showNotes && item.notes && (
                  <div className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {item.notes}
                  </div>
                )}
                
                {/* Show image if enabled and present */}
                {preferences.showImages && item.image && (
                  <div className="mt-2">
                    <img 
                      src={item.image} 
                      alt={item.text} 
                      className="w-full max-w-xs rounded-md object-cover"
                    />
                  </div>
                )}
                
                {/* Assigned to (for chores) */}
                {list.type === 'chore' && item.assignedTo && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      Assigned to: {item.assignedTo}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="ml-2 flex items-center">
                {preferences.showEditButtons && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {/* Add Item Form */}
          {!isAddingItem ? (
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-dashed"
              onClick={() => setIsAddingItem(true)}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          ) : (
            <div className="p-3 rounded-md border">
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Add an item..."
                  value={newItemText}
                  onChange={e => setNewItemText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddItem()
                  }}
                  autoFocus
                />
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Notes
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <Image className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setNewItemText('')
                      setIsAddingItem(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleAddItem}
                    disabled={!newItemText.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {list.items.length === 0 && !isAddingItem && (
            <div className="text-center py-12">
              <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">No items yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first item to this list
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* New List Form (if this is new list creation) */}
      {listId === 'new' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Create New List</h3>
          <p className="text-muted-foreground">
            This feature is coming soon! You'll be able to create new lists with custom names, descriptions, and types.
          </p>
          <Button onClick={handleGoBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}