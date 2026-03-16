import React, { useEffect, useState} from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import { useNavigate } from 'react-router-dom';
import ModalConfirmation from '../../EventsAdmin/components/ModalConfirmation';

export default function UserFavorites() {

  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

  const confirmDeletion = (id) => {
    setEventToDelete(id);
    setShowConfirmation(true);
  };

  const cancelDeletion = () => {
    setEventToDelete(null);
    setShowConfirmation(false);
  };

  const executeDeletion = async () => {
    if (eventToDelete) {
      await eliminarInteres(eventToDelete);
      setShowConfirmation(false);
      setEventToDelete(null);
    }
  };

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventosFavoritos.map(evento => (

            <div
              key={evento.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div
                onClick={() => navigate(`/eventos/${evento.id}`)}
                className="cursor-pointer"
              >
                <img
                  src={evento.imagen_url}
                  alt={evento.nombre}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {evento.nombre}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {evento.fecha}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={() => confirmDeletion(evento.id)}
                  className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Quitar de favoritos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ModalConfirmation
        isOpen={showConfirmation}
        titulo="Eliminar favorito"
        mensaje="¿Estás seguro de que deseas quitar este evento de tus favoritos?"
        onConfirm={executeDeletion}
        onCancel={cancelDeletion}
        isDanger={true}
      />
    </div>
  );
}