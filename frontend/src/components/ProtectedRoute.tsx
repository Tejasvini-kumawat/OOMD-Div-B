import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'user' | 'ngo';
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

 

  return <>{children}</>;
}
