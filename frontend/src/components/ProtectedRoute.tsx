import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[]; // Tillåtna roller, t.ex. ['forum_admin', 'super_admin']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext)!;

  if (!user) {
    // Om användaren inte är inloggad, skicka till inloggningssidan
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Om användaren inte har rätt roll, visa en 403-sida eller skicka till hemsidan
    return <Navigate to="/" />;
  }

  // Visa barnkomponenterna om användaren är tillåten
  return <Outlet />;
};

export default ProtectedRoute;
