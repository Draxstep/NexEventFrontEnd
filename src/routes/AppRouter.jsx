import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';
import EventsManagment from '../features/EventsAdmin/pages/EventsManagment.jsx';

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
        element: <div className="p-10 text-center text-gray-500">Página de Catálogo de Eventos (En construcción)</div>,
      },
      {
        path: 'gestion-eventos',
        element: <EventsManagment />, 
      },
    ],
  },
]);