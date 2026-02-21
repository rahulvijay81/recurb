import Link from "next/link";
import { Database, Users, Settings, Info } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/system" className="p-6 border rounded-lg hover:bg-accent">
          <Info className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-semibold">System Info</h2>
          <p className="text-sm text-muted-foreground">View system details</p>
        </Link>
        
        <Link href="/admin/database" className="p-6 border rounded-lg hover:bg-accent">
          <Database className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-semibold">Database</h2>
          <p className="text-sm text-muted-foreground">Database status</p>
        </Link>
        
        <Link href="/admin/users" className="p-6 border rounded-lg hover:bg-accent">
          <Users className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">Manage users</p>
        </Link>
        
        <Link href="/admin/features" className="p-6 border rounded-lg hover:bg-accent">
          <Settings className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-semibold">Features</h2>
          <p className="text-sm text-muted-foreground">Feature toggles</p>
        </Link>
      </div>
    </div>
  );
}
