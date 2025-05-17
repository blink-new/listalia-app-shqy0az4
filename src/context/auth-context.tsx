import { createContext, useContext, useState, useEffect } from 'react'

// Types
type User = {
  id: string
  email: string
  name: string
  avatar?: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demonstration (will be replaced with real auth later)
const MOCK_USER: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
}

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check if user is already logged in (from localStorage for now)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('listalia-user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    try {
      // In a real app, we would call an auth API here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, just check if email matches our mock user
      if (email === MOCK_USER.email) {
        localStorage.setItem('listalia-user', JSON.stringify(MOCK_USER))
        setAuthState({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new user (in a real app, this would be done by the backend)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      }
      
      localStorage.setItem('listalia-user', JSON.stringify(newUser))
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      localStorage.removeItem('listalia-user')
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!authState.user) throw new Error('Not authenticated')
      
      // Update user data
      const updatedUser = { ...authState.user, ...data }
      localStorage.setItem('listalia-user', JSON.stringify(updatedUser))
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }))
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Create the context value
  const value = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}