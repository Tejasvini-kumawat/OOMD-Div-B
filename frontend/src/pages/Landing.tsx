import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useEffect } from 'react';

export default function Landing() {
  
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     navigate(user.role === 'user' ? '/user/dashboard' : '/ngo/dashboard');
  //   }
  // }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: Heart,
      title: 'Easy Donations',
      description: 'Donate items to verified NGOs with a simple process',
    },
    {
      icon: Users,
      title: 'Connect with NGOs',
      description: 'Browse and connect with NGOs making real impact',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your donation history and status updates',
    },
    {
      icon: Shield,
      title: 'Verified Organizations',
      description: 'All NGOs are verified for transparency and trust',
    },
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">

        <div className="container mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Make a Difference Today
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Connect with verified NGOs and donate items to causes you care about. 
              Every contribution creates meaningful impact.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

          </motion.div>

        </div>

      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose GiveHope?</h2>
            <p className="text-muted-foreground text-lg">
              A platform built for transparency, trust, and impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-gradient-card border-border hover:shadow-lg transition-shadow">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of donors supporting meaningful causes
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg">
                Join Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
