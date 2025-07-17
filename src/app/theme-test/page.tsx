"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function ThemeTestPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Theme Test Page</h1>
        <ThemeToggle />
      </div>
      
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card">Card Example</TabsTrigger>
          <TabsTrigger value="components">UI Components</TabsTrigger>
        </TabsList>
        <TabsContent value="card">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Card</CardTitle>
              <CardDescription>
                This is an example of how a subscription card would look.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Netflix" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" placeholder="$9.99" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="components">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold">Buttons</h2>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold">Colors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary text-primary-foreground rounded-md">Primary</div>
                <div className="p-4 bg-secondary text-secondary-foreground rounded-md">Secondary</div>
                <div className="p-4 bg-accent text-accent-foreground rounded-md">Accent</div>
                <div className="p-4 bg-muted text-muted-foreground rounded-md">Muted</div>
                <div className="p-4 bg-destructive text-destructive-foreground rounded-md">Destructive</div>
                <div className="p-4 bg-card text-card-foreground rounded-md border">Card</div>
                <div className="p-4 bg-popover text-popover-foreground rounded-md border">Popover</div>
                <div className="p-4 bg-background text-foreground rounded-md border">Background</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}