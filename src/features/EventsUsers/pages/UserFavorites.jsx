import React, { useEffect } from 'react';
import { AlertCircle, Heart } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import EventGrid from '../components/EventGrid';

export default function UserFavorites() {

  const {
    eventosFavoritos,
    loadingFavoritos,
    errorFavoritos,
    fetchEventosFavoritos,
    eliminarInteres
  } = useEventsUsers();

  useEffect(() => {
    fetchEventosFavoritos();
  }, [fetchEventosFavoritos]);

  const eventosAdaptados = eventosFavoritos.map(evento => ({
    id: evento.id,
    nombre: evento.nombre,
    imagenUrl: evento.imagen_url,
    fecha: evento.fecha,
    hora: evento.hora || 'Sin hora',
    lugar: evento.lugar || 'Lugar no especificado',
    ciudad: evento.ciudad || '',
    categoria: evento.categoria || 'General',
    valor: evento.valor || 0,
    extra: (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          eliminarInteres(evento.id);
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-all"
        title="Quitar de favoritos"
      >
        <Heart size={18} className="text-blue-600 fill-blue-600" />
      </button>
    )
  }));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Mis Eventos Favoritos
        </h1>
      </div>

      {loadingFavoritos ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : errorFavoritos ? (
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center text-red-700">
          <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
          <p className="text-lg font-bold">{errorFavoritos}</p>
        </div>
      ) : eventosFavoritos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No tienes eventos favoritos aún.
        </div>
      ) : (
        <EventGrid eventos={eventosAdaptados} />
      )}
    </div>
  );
}