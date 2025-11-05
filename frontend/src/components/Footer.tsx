import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">GiveHope</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering compassion by connecting donors with verified NGOs to bring real change.
            </p>
          </div>

          {/* Join Our Mission */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="font-semibold text-foreground">Join Our Mission</h3>
            <p className="text-muted-foreground text-sm">
              Be part of a community that believes in making the world a better place — one act of kindness at a time.
            </p>
            {/* <Button asChild className="mt-2">
              <Link to="/signup">Get Involved</Link>
            </Button> */}
          </div>

          {/* Contact & Socials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@givehope.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 7249721249</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>PCCoE, Pune</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} GiveHope. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
