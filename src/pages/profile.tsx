import { useState } from 'react'
import { useAuth } from '../context/auth-context'
import { usePreferences } from '../context/preferences-context'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useToast } from '../hooks/use-toast'
import { Loader2, Save, RotateCcw } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { preferences, updatePreferences, resetPreferences } = usePreferences()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      await updateProfile({
        name: profileData.name,
        avatar: profileData.avatar,
      })
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle preferences reset
  const handlePreferencesReset = () => {
    resetPreferences()
    toast({
      title: 'Preferences Reset',
      description: 'Your preferences have been reset to default values',
    })
  }

  return (
    <div className="container max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and how you appear on Listalia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>
                    {profileData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Your profile picture will be shown across the app
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                    >
                      Change Picture
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address is used for login and cannot be changed
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how Listalia looks and works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-medium">List View Options</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="view-mode">Default View Mode</Label>
                    <select 
                      id="view-mode"
                      value={preferences.viewMode}
                      onChange={e => updatePreferences({ viewMode: e.target.value as any })}
                      className="w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="grid">Grid View</option>
                      <option value="row">Row View</option>
                      <option value="compact">Compact View</option>
                      <option value="folders">Folders View</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="progress-bar">Show Progress Bars</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Show completion progress for lists
                      </p>
                    </div>
                    <Switch 
                      id="progress-bar" 
                      checked={preferences.showProgressBars}
                      onCheckedChange={value => updatePreferences({ showProgressBars: value })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="progress-style">Progress Bar Style</Label>
                    <select 
                      id="progress-style"
                      value={preferences.progressBarStyle}
                      onChange={e => updatePreferences({ progressBarStyle: e.target.value as any })}
                      className="w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      disabled={!preferences.showProgressBars}
                    >
                      <option value="minimal">Minimal</option>
                      <option value="detailed">Detailed</option>
                      <option value="checklist">Checklist</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Item Display Options</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-completed">Show Completed Items</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Display completed items in lists
                      </p>
                    </div>
                    <Switch 
                      id="show-completed" 
                      checked={preferences.showCompleted}
                      onCheckedChange={value => updatePreferences({ showCompleted: value })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-notes">Show Item Notes</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Display additional notes for list items
                      </p>
                    </div>
                    <Switch 
                      id="show-notes" 
                      checked={preferences.showNotes}
                      onCheckedChange={value => updatePreferences({ showNotes: value })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-images">Show Item Images</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Display images attached to list items
                      </p>
                    </div>
                    <Switch 
                      id="show-images" 
                      checked={preferences.showImages}
                      onCheckedChange={value => updatePreferences({ showImages: value })}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Interaction Preferences</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="completion-mode">Completion Mode</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        How items are marked as complete
                      </p>
                    </div>
                    <select 
                      id="completion-mode"
                      value={preferences.completionMode}
                      onChange={e => updatePreferences({ completionMode: e.target.value as any })}
                      className="w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="tap">Single Tap</option>
                      <option value="double-tap">Double Tap</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="edit-buttons">Show Edit Buttons</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Display edit buttons for items
                      </p>
                    </div>
                    <Switch 
                      id="edit-buttons" 
                      checked={preferences.showEditButtons}
                      onCheckedChange={value => updatePreferences({ showEditButtons: value })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="swipe-actions">Enable Swipe Actions</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Use swipe gestures for quick actions (mobile)
                      </p>
                    </div>
                    <Switch 
                      id="swipe-actions" 
                      checked={preferences.enableSwipeActions}
                      onCheckedChange={value => updatePreferences({ enableSwipeActions: value })}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Accessibility</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast Mode</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Enhance visibility with higher contrast
                      </p>
                    </div>
                    <Switch 
                      id="high-contrast" 
                      checked={preferences.highContrast}
                      onCheckedChange={value => updatePreferences({ highContrast: value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={handlePreferencesReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Security</h3>
                <div className="space-y-2">
                  <Button variant="outline" disabled>Change Password</Button>
                  <p className="text-xs text-muted-foreground">
                    Password changes and two-factor authentication coming soon
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Data Management</h3>
                <div className="space-y-2">
                  <Button variant="outline" disabled>Export Lists</Button>
                  <p className="text-xs text-muted-foreground">
                    Export all your lists and items as a backup
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <div className="space-y-2">
                  <Button variant="destructive" disabled>Delete Account</Button>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete your account and all your data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}