import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    // Podría ser un loader general
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  const userRole = user?.publicMetadata?.role;

  // Si requiere un rol especifico y el usuario no lo tiene
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  // Si todo esta bien, renderiza la ruta hija
  return <Outlet />;
};

export default ProtectedRoute;
