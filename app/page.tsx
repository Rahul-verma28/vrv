import { UserManagement } from '@/components/userManagement'
import { RoleManagement } from '@/components/roleManagement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
            <TabsContent value="roles" className="space-y-4">
              <RoleManagement />
            </TabsContent>
          </Tabs>
      </main>
    </div>
  )
}

export default App



