import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ListTodo, HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <ListTodo className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/">
              <HomeIcon className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/app/dashboard">
              <ListTodo className="mr-2 h-5 w-5" />
              My Lists
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}