import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'

// Types
type ViewMode = 'row' | 'grid' | 'compact' | 'folders'
type ProgressBarStyle = 'minimal' | 'detailed' | 'checklist'
type CompletionMode = 'tap' | 'double-tap'

type Preferences = {
  // UI Preferences
  viewMode: ViewMode
  showCompleted: boolean
  showNotes: boolean
  showImages: boolean
  highContrast: boolean
  showProgressBars: boolean
  progressBarStyle: ProgressBarStyle
  
  // Interaction Preferences
  completionMode: CompletionMode
  showEditButtons: boolean
  enableSwipeActions: boolean
}

type PreferencesContextType = {
  preferences: Preferences
  updatePreferences: (newPreferences: Partial<Preferences>) => void
  resetPreferences: () => void
}

// Default preferences
const DEFAULT_PREFERENCES: Preferences = {
  viewMode: 'grid',
  showCompleted: true,
  showNotes: true,
  showImages: true,
  highContrast: false,
  showProgressBars: true,
  progressBarStyle: 'minimal',
  completionMode: 'tap',
  showEditButtons: true,
  enableSwipeActions: true,
}

// Create context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

// Provider component
export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)

  // Load preferences from localStorage
  useEffect(() => {
    if (user) {
      const storedPreferences = localStorage.getItem(`listalia-preferences-${user.id}`)
      if (storedPreferences) {
        try {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(storedPreferences),
          })
        } catch (error) {
          console.error('Error parsing preferences:', error)
        }
      }
    } else {
      setPreferences(DEFAULT_PREFERENCES)
    }
  }, [user])

  // Update preferences
  const updatePreferences = (newPreferences: Partial<Preferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences }
    setPreferences(updatedPreferences)
    
    if (user) {
      localStorage.setItem(
        `listalia-preferences-${user.id}`,
        JSON.stringify(updatedPreferences)
      )
    }
  }

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES)
    
    if (user) {
      localStorage.setItem(
        `listalia-preferences-${user.id}`,
        JSON.stringify(DEFAULT_PREFERENCES)
      )
    }
  }

  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

// Custom hook to use preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}