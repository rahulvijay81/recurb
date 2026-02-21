'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: { id: number; name: string; description?: string; permissions: string[] } | null;
  onSuccess: () => void;
}

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      setSelectedPermissions(role.permissions);
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions([]);
    }
  }, [role, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = role ? `/api/admin/roles/${role.id}` : '/api/admin/roles';
    const method = role ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, permissions: selectedPermissions }),
    });
    
    onSuccess();
    onOpenChange(false);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const permissionGroups = Object.entries(PERMISSIONS).reduce((acc, [key, value]) => {
    const [group] = value.split(':');
    if (!acc[group]) acc[group] = [];
    acc[group].push({ key, value });
    return acc;
  }, {} as Record<string, Array<{ key: string; value: string }>>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create Role'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Manager" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this role's purpose" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">{group}</h4>
                    <div className="grid gap-2 pl-4">
                      {perms.map(({ key, value }) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={value}
                            checked={selectedPermissions.includes(value)}
                            onCheckedChange={() => togglePermission(value)}
                          />
                          <label htmlFor={value} className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {key.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{role ? 'Update' : 'Create'} Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
