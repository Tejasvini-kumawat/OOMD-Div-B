import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Image as ImageIcon, MapPin, BookText, List, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { registerUser } from '@/api';
import { useMutation } from '@tanstack/react-query';

export default function Signup() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'user' | 'ngo'>('user');
  const [logo, setLogo] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [signup, setSigningUp] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success) {
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user));
         localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id); // Can be ngo or user
      localStorage.setItem('user', JSON.stringify(data.user)); // // Store whole user object
      localStorage.setItem('role', data.user.role);
        toast({
          title: "Account created!",
          description: "Welcome to GiveHope",
        });

        navigate(data.user.role === "user" ? "/user/dashboard" : "/ngo/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "Try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("role", role);

    if (role === "ngo") {
      if (logo) formData.append("logo", logo); // backend expects req.file
      formData.append("category", category);
      formData.append("location", location);
      formData.append("description", description);
    }

    setSigningUp(true);
    signupMutation.mutate(formData, {
      onSettled: () => setSigningUp(false),
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Heart className="w-8 h-8" />
            <span>GiveHope</span>
          </Link>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Choose your account type and get started</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as 'user' | 'ngo')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="ngo">NGO</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{role === 'user' ? 'Full Name' : 'Organization Name'}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={role === 'user' ? 'John Doe' : 'Your NGO Name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* NGO Fields */}
              {role === 'ngo' && (
                <>
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="logo">Organization Logo</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    {preview && (
                      <div className="mt-2">
                        <img
                          src={preview}
                          alt="Logo preview"
                          className="h-20 w-20 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="relative">
                      <List className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="category"
                        type="text"
                        placeholder="e.g. Education, Health, Environment"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="City, State"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <div className="relative">
                      <BookText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="description"
                        type="text"
                        placeholder="Brief about your organization"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    pattern="[0-9]{10}"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={signup}>
                {signup ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
