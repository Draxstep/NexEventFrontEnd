import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import EventsManagment from '../features/EventsAdmin/pages/EventsManagment.jsx';
import PublicEvents from '../features/EventsUsers/pages/PublicEvents.jsx';
import PublicEventDetailPage from '../features/EventsUsers/pages/PublicEventDetailPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    errorElement: <div className="p-10 text-center text-red-500 font-bold">Error 404: Página no encontrada</div>,
    children: [
      {
        index: true, 
        element: <Home />,
      },
      {
        path: 'eventos',
        element: <PublicEvents />,
      },
      {
        path: 'eventos/:id', 
        element: <PublicEventDetailPage />,
      },
      {
        path: 'gestion-eventos',
        element: <EventsManagment />, 
      },
      
    ],
  },
]);