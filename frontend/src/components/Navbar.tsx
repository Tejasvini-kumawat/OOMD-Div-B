import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function Navbar() {
 
  const navigate = useNavigate();

  const role  =  localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogoClick = () => {
    if (!token) {
      navigate('/');
      return;
    }

    // Redirect based on user role
    if (user.role === 'ngo') {
      navigate('/ngo/dashboard');
    } else if (user.role === 'user') {
      navigate('/user/dashboard');
    } else {
      navigate('/');
    }
  };
   

  const handleLogout = () => {
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
   
    navigate('/');
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <div
             onClick={handleLogoClick}
             className="flex items-center gap-2 text-xl font-bold cursor-pointer text-primary"
          >
            <Heart className="w-6 h-6" />
            <span>GiveHope</span>
          </div>
  
          

          <div className="flex items-center gap-4">
            { token ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user.name}</span>
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
