import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import EventsManagment from '../features/EventsAdmin/pages/EventsManagment.jsx';
import EventReportPage from '../features/EventsAdmin/pages/EventReportPage.jsx';
import PublicEvents from '../features/EventsUsers/pages/PublicEvents.jsx';
import PublicEventDetailPage from '../features/EventsUsers/pages/PublicEventDetailPage.jsx';
import UserFavorites from '../features/EventsUsers/pages/UserFavorites.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    errorElement: <div className="p-10 text-center text-red-500 font-bold">Error 404: Página no encontrada</div>,
    children: [
      {
        index: true, 
        element: <PublicEvents />,
      },
      {
        path: 'eventos',
        element: <Navigate to="/" replace />, // Redirigimos /eventos a la raíz para mantener consistencia
      },
      {
        path: 'eventos/:id', 
        element: <PublicEventDetailPage />,
      },
      {
        // Protegemos esta ruta usando el componente ProtectedRoute
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'gestion-eventos',
            element: <EventsManagment />, 
          },
          {
            path: 'reportes',
            element: <EventReportPage />,
          }
        ]
      },
      {
        element: <ProtectedRoute />, 
        children: [
          {
            path: 'mis-favoritos',
            element: <UserFavorites />,
          }
        ]
      }
      
    ],
  },
]);