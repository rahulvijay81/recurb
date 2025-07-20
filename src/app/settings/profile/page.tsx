"use client";

import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import currencies from "@/data/currencies.json";

import { useState } from "react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    phone: user?.phone || "",
    timezone: user?.timezone || "",
    currency: user?.currency || "USD",
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.name || "Enter your name"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.email || "Enter your email"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              {isEditing ? (
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.company || "Enter company name"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.phone || "Enter phone number"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              {isEditing ? (
                <Input
                  id="timezone"
                  value={formData.timezone}
                  placeholder="Enter timezone"
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                />
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.timezone || "Enter timezone"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              {isEditing ? (
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm p-2 bg-muted rounded-md">
                  {user?.currency || "USD"}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}