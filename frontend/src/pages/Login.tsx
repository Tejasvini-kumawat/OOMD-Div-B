import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/api';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'ngo'>('user');

  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id); // Can be ngo or user
      localStorage.setItem('user', JSON.stringify(data.user)); // // Store whole user object
      localStorage.setItem('role', data.user.role);

      toast({
        title: 'Welcome back!',
        description: 'Login successful',
      });
      navigate(role === 'user' ? '/user/dashboard' : '/ngo/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-hero">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Heart className="w-8 h-8" />
            <span>GiveHope</span>
          </Link>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Choose your account type and sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as 'user' | 'ngo')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="ngo">NGO</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder={role === 'user' ? 'user@demo.com' : 'ngo@demo.com'} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="password123" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
