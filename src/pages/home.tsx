import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/auth-context'
import { ThemeToggle } from '../components/theme-toggle'
import { CheckCircle2, List, Share2, Sparkles } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app/dashboard')
    }
  }, [isAuthenticated, isLoading, navigate])

  // If still checking auth, show minimal loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Listalia" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Listalia</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#about">About</a>
            </Button>
          </div>
          <ThemeToggle />
          <Button asChild>
            <Link to="/auth/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Manage all your lists in one place
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Listalia helps you organize tasks, shopping items, and family chores 
            with a beautiful, intuitive interface.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link to="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 pl-0 md:pl-10">
          <div className="bg-card rounded-lg p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Shopping List</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-xs text-muted-foreground">5 items</span>
              </div>
            </div>
            <div className="space-y-2">
              {['Milk', 'Eggs', 'Bread', 'Apples', 'Coffee'].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center p-2 rounded-md hover:bg-accent"
                >
                  <div className={`h-5 w-5 rounded border mr-3 flex items-center justify-center ${i < 2 ? 'bg-primary border-primary' : 'border-input'}`}>
                    {i < 2 && <div className="h-2 w-2 bg-white rounded-full" />}
                  </div>
                  <span className={i < 2 ? 'line-through text-muted-foreground' : ''}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-accent py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <List className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple List Types</h3>
              <p className="text-muted-foreground">
                Create task lists, shopping lists, and family chore lists with specialized features for each type.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Customization</h3>
              <p className="text-muted-foreground">
                Personalize your lists with custom colors, icons, and organization structures.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md border">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sharing & Collaboration</h3>
              <p className="text-muted-foreground">
                Share lists with family and friends. Collaborate in real-time with shared editing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Listalia?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 text-muted-foreground">
            Listalia combines beautiful design with powerful functionality to create
            the ultimate list management experience.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span>Light & Dark mode</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span>Responsive design</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span>Cloud synchronization</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span>Multiple view options</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to organize your life?
          </h2>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-primary"
            asChild
          >
            <Link to="/auth/signup">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/favicon.svg" alt="Listalia" className="h-8 w-8" />
              <h1 className="text-xl font-bold">Listalia</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Listalia. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}