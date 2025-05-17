import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'

// Types
export type ListType = 'task' | 'shopping' | 'chore'

export type ListItem = {
  id: string
  text: string
  completed: boolean
  notes?: string
  image?: string
  createdAt: string
  assignedTo?: string
  order: number
}

export type List = {
  id: string
  title: string
  description?: string
  type: ListType
  color: string
  icon: string
  items: ListItem[]
  folderId?: string
  collaborators: string[]
  createdAt: string
  updatedAt: string
  userId: string
}

export type Folder = {
  id: string
  name: string
  color: string
  createdAt: string
  userId: string
}

type ListsContextType = {
  lists: List[]
  folders: Folder[]
  createList: (list: Omit<List, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'collaborators'>) => Promise<List>
  updateList: (id: string, data: Partial<List>) => Promise<List>
  deleteList: (id: string) => Promise<void>
  getList: (id: string) => List | undefined
  createFolder: (name: string, color: string) => Promise<Folder>
  updateFolder: (id: string, data: Partial<Folder>) => Promise<Folder>
  deleteFolder: (id: string) => Promise<void>
  addItem: (listId: string, item: Omit<ListItem, 'id' | 'createdAt' | 'order'>) => Promise<ListItem>
  updateItem: (listId: string, itemId: string, data: Partial<ListItem>) => Promise<ListItem>
  deleteItem: (listId: string, itemId: string) => Promise<void>
  reorderItems: (listId: string, itemIds: string[]) => Promise<void>
  isLoading: boolean
}

// Create context
const ListsContext = createContext<ListsContextType | undefined>(undefined)

// Mock data
const MOCK_LISTS: List[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    description: 'Things to buy this weekend',
    type: 'shopping',
    color: '#4f46e5',
    icon: 'ShoppingCart',
    items: [
      { id: '1-1', text: 'Milk', completed: false, createdAt: new Date().toISOString(), order: 0 },
      { id: '1-2', text: 'Eggs', completed: true, createdAt: new Date().toISOString(), order: 1 },
      { id: '1-3', text: 'Bread', completed: false, createdAt: new Date().toISOString(), order: 2 },
    ],
    collaborators: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '2',
    title: 'Work Tasks',
    description: 'Things to do for work',
    type: 'task',
    color: '#10b981',
    icon: 'Briefcase',
    items: [
      { id: '2-1', text: 'Finish report', completed: false, createdAt: new Date().toISOString(), order: 0 },
      { id: '2-2', text: 'Call client', completed: false, createdAt: new Date().toISOString(), order: 1 },
    ],
    folderId: '1',
    collaborators: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '3',
    title: 'Home Chores',
    description: 'Things to do around the house',
    type: 'chore',
    color: '#f59e0b',
    icon: 'Home',
    items: [
      { id: '3-1', text: 'Clean bathroom', completed: false, assignedTo: 'John', createdAt: new Date().toISOString(), order: 0 },
      { id: '3-2', text: 'Vacuum living room', completed: true, assignedTo: 'Sarah', createdAt: new Date().toISOString(), order: 1 },
    ],
    collaborators: ['family'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '1',
  },
]

const MOCK_FOLDERS: Folder[] = [
  {
    id: '1',
    name: 'Work',
    color: '#10b981',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
]

// Provider component
export const ListsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth()
  const [lists, setLists] = useState<List[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load lists from localStorage or use mock data
  useEffect(() => {
    const loadLists = async () => {
      try {
        if (isAuthenticated && user) {
          const storedLists = localStorage.getItem(`listalia-lists-${user.id}`)
          const storedFolders = localStorage.getItem(`listalia-folders-${user.id}`)
          
          if (storedLists) {
            setLists(JSON.parse(storedLists))
          } else {
            // Use mock data for demo
            setLists(MOCK_LISTS)
            localStorage.setItem(`listalia-lists-${user.id}`, JSON.stringify(MOCK_LISTS))
          }
          
          if (storedFolders) {
            setFolders(JSON.parse(storedFolders))
          } else {
            // Use mock data for demo
            setFolders(MOCK_FOLDERS)
            localStorage.setItem(`listalia-folders-${user.id}`, JSON.stringify(MOCK_FOLDERS))
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading lists:', error)
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadLists()
    } else {
      setLists([])
      setFolders([])
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  // Save lists to localStorage
  const saveLists = (newLists: List[]) => {
    if (user) {
      localStorage.setItem(`listalia-lists-${user.id}`, JSON.stringify(newLists))
      setLists(newLists)
    }
  }

  // Save folders to localStorage
  const saveFolders = (newFolders: Folder[]) => {
    if (user) {
      localStorage.setItem(`listalia-folders-${user.id}`, JSON.stringify(newFolders))
      setFolders(newFolders)
    }
  }

  // List CRUD operations
  const createList = async (listData: Omit<List, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'collaborators'>) => {
    if (!user) throw new Error('Not authenticated')
    
    const now = new Date().toISOString()
    const newList: List = {
      ...listData,
      id: Math.random().toString(36).substring(2, 9),
      collaborators: [],
      createdAt: now,
      updatedAt: now,
      userId: user.id,
    }
    
    const updatedLists = [...lists, newList]
    saveLists(updatedLists)
    return newList
  }

  const updateList = async (id: string, data: Partial<List>) => {
    if (!user) throw new Error('Not authenticated')
    
    const listIndex = lists.findIndex(list => list.id === id)
    if (listIndex === -1) throw new Error('List not found')
    
    const updatedList = {
      ...lists[listIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    const updatedLists = [...lists]
    updatedLists[listIndex] = updatedList
    saveLists(updatedLists)
    return updatedList
  }

  const deleteList = async (id: string) => {
    if (!user) throw new Error('Not authenticated')
    
    const updatedLists = lists.filter(list => list.id !== id)
    saveLists(updatedLists)
  }

  const getList = (id: string) => {
    return lists.find(list => list.id === id)
  }

  // Folder CRUD operations
  const createFolder = async (name: string, color: string) => {
    if (!user) throw new Error('Not authenticated')
    
    const newFolder: Folder = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      color,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    
    const updatedFolders = [...folders, newFolder]
    saveFolders(updatedFolders)
    return newFolder
  }

  const updateFolder = async (id: string, data: Partial<Folder>) => {
    if (!user) throw new Error('Not authenticated')
    
    const folderIndex = folders.findIndex(folder => folder.id === id)
    if (folderIndex === -1) throw new Error('Folder not found')
    
    const updatedFolder = {
      ...folders[folderIndex],
      ...data,
    }
    
    const updatedFolders = [...folders]
    updatedFolders[folderIndex] = updatedFolder
    saveFolders(updatedFolders)
    return updatedFolder
  }

  const deleteFolder = async (id: string) => {
    if (!user) throw new Error('Not authenticated')
    
    // Update lists that were in this folder
    const updatedLists = lists.map(list => 
      list.folderId === id ? { ...list, folderId: undefined } : list
    )
    saveLists(updatedLists)
    
    // Delete the folder
    const updatedFolders = folders.filter(folder => folder.id !== id)
    saveFolders(updatedFolders)
  }

  // Item CRUD operations
  const addItem = async (listId: string, itemData: Omit<ListItem, 'id' | 'createdAt' | 'order'>) => {
    if (!user) throw new Error('Not authenticated')
    
    const listIndex = lists.findIndex(list => list.id === listId)
    if (listIndex === -1) throw new Error('List not found')
    
    const newItem: ListItem = {
      ...itemData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      order: lists[listIndex].items.length,
    }
    
    const updatedList = {
      ...lists[listIndex],
      items: [...lists[listIndex].items, newItem],
      updatedAt: new Date().toISOString(),
    }
    
    const updatedLists = [...lists]
    updatedLists[listIndex] = updatedList
    saveLists(updatedLists)
    return newItem
  }

  const updateItem = async (listId: string, itemId: string, data: Partial<ListItem>) => {
    if (!user) throw new Error('Not authenticated')
    
    const listIndex = lists.findIndex(list => list.id === listId)
    if (listIndex === -1) throw new Error('List not found')
    
    const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId)
    if (itemIndex === -1) throw new Error('Item not found')
    
    const updatedItem = {
      ...lists[listIndex].items[itemIndex],
      ...data,
    }
    
    const updatedItems = [...lists[listIndex].items]
    updatedItems[itemIndex] = updatedItem
    
    const updatedList = {
      ...lists[listIndex],
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    }
    
    const updatedLists = [...lists]
    updatedLists[listIndex] = updatedList
    saveLists(updatedLists)
    return updatedItem
  }

  const deleteItem = async (listId: string, itemId: string) => {
    if (!user) throw new Error('Not authenticated')
    
    const listIndex = lists.findIndex(list => list.id === listId)
    if (listIndex === -1) throw new Error('List not found')
    
    const updatedItems = lists[listIndex].items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index })) // Update order
    
    const updatedList = {
      ...lists[listIndex],
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    }
    
    const updatedLists = [...lists]
    updatedLists[listIndex] = updatedList
    saveLists(updatedLists)
  }

  const reorderItems = async (listId: string, itemIds: string[]) => {
    if (!user) throw new Error('Not authenticated')
    
    const listIndex = lists.findIndex(list => list.id === listId)
    if (listIndex === -1) throw new Error('List not found')
    
    // Create a map for quick lookup of items
    const itemMap = new Map(
      lists[listIndex].items.map(item => [item.id, item])
    )
    
    // Create new ordered items array
    const updatedItems = itemIds.map((id, index) => {
      const item = itemMap.get(id)
      if (!item) throw new Error(`Item ${id} not found`)
      return { ...item, order: index }
    })
    
    const updatedList = {
      ...lists[listIndex],
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    }
    
    const updatedLists = [...lists]
    updatedLists[listIndex] = updatedList
    saveLists(updatedLists)
  }

  const value = {
    lists,
    folders,
    createList,
    updateList,
    deleteList,
    getList,
    createFolder,
    updateFolder,
    deleteFolder,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    isLoading,
  }

  return <ListsContext.Provider value={value}>{children}</ListsContext.Provider>
}

// Custom hook to use lists context
export const useLists = () => {
  const context = useContext(ListsContext)
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider')
  }
  return context
}