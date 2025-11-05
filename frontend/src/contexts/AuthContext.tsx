import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'user' | 'ngo';

interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy credentials for testing
const DUMMY_USERS = {
  'user@demo.com': { password: 'password123', role: 'user' as UserRole, name: 'John Doe' },
  'ngo@demo.com': { password: 'password123', role: 'ngo' as UserRole, name: 'Hope Foundation' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string, role: UserRole): boolean => {
    const userCreds = DUMMY_USERS[email as keyof typeof DUMMY_USERS];
    
    if (userCreds && userCreds.password === password && userCreds.role === role) {
      const userData = { email, role, name: userCreds.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, name: string, role: UserRole): boolean => {
    // In a real app, this would create a new user account
    const userData = { email, role, name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
