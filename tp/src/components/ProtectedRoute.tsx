import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Garde de route : si pas d’utilisateur Redux, redirection vers /login avec mémorisation de l’URL.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector((s: RootState) => s.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
