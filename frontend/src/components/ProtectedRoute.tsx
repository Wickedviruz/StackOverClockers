import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Tillåtna roller, t.ex. ['forum_admin', 'super_admin']
  children: React.ReactNode; // Barn-komponenter
  fallback?: React.ReactNode; // Alternativ komponent att visa om rollen är ogiltig
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [], children, fallback = null }) => {
  const { user } = useContext(AuthContext)!;

  if (!user) {
    // Om användaren inte är inloggad, skicka till inloggningssidan
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Om användaren inte har rätt roll
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />;
  }

  // Returnera barn-komponenten direkt om tillåtet
  return <>{children}</>;
};

export default ProtectedRoute;
