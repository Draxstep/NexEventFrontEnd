import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const AuthCallback = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const isAdmin = user.publicMetadata?.role === 'admin';
        if (isAdmin) {
          navigate('/gestion-eventos', { replace: true });
        } else {
          // Si no es admin, a la raíz
          navigate('/', { replace: true });
        }
      } else {
        // Fallback en caso de que no haya usuario
        navigate('/', { replace: true });
      }
    }
  }, [user, isLoaded, navigate]);

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default AuthCallback;
