'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Building2, User, Check, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Database', icon: Database },
  { id: 2, title: 'Organization', icon: Building2 },
  { id: 3, title: 'Admin Account', icon: User },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    dbType: 'sqlite' as 'sqlite' | 'postgres' | 'mysql',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    orgName: '',
    orgPlan: 'pro' as 'free' | 'pro' | 'team',
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-center">Welcome to Recurb</CardTitle>
          <CardDescription className="text-center text-base">Let's set up your subscription management instance</CardDescription>
          
          {/* Progress Steps */}
          <div className="flex items-start justify-center pt-8 max-w-md mx-auto">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    step > s.id ? "bg-primary text-primary-foreground" :
                    step === s.id ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  )}>
                    {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    step >= s.id ? "text-slate-900 dark:text-slate-100" : "text-slate-500"
                  )}>{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "h-[2px] w-16 mx-2 mt-5 transition-all duration-200",
                    step > s.id ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {/* Step 1: Database */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="dbType">Database Type</Label>
                <Select value={formData.dbType} onValueChange={(v: any) => setFormData({ ...formData, dbType: v })}>
                  <SelectTrigger id="dbType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqlite">SQLite (Recommended)</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">SQLite is perfect for getting started. You can migrate later.</p>
              </div>
            </div>
          )}

          {/* Step 2: Organization */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName"
                  placeholder="Acme Inc."
                  value={formData.orgName} 
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })} 
                />
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="adminName">Full Name</Label>
                <Input 
                  id="adminName"
                  placeholder="John Doe"
                  value={formData.adminName} 
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Address</Label>
                <Input 
                  id="adminEmail"
                  type="email" 
                  placeholder="admin@example.com"
                  value={formData.adminEmail} 
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <div className="relative">
                  <Input 
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={formData.adminPassword} 
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })} 
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={handleNext} className="flex-1">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
