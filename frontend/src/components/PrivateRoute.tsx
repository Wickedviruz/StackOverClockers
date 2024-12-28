import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: number;
  username: string;
  exp: number;
  is_admin: boolean;
}

interface PrivateRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('access_token');
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && !decoded.is_admin) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error('Invalid token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
