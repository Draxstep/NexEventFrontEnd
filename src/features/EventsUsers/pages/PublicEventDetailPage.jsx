import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import PublicEventDetail from '../components/PublicEventDetail';

export default function PublicEventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchEventoById, checkInteresPrevio, registrarInteres } = useEventsUsers();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 🔥 Cargar evento
  const cargarEvento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchEventoById(id);

      if (!data) {
        throw new Error('El evento que buscas no existe o fue retirado.');
      }

      setEvento(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, fetchEventoById]);

  useEffect(() => {
    window.scrollTo(0, 0);
    cargarEvento();
  }, [cargarEvento]);

  // 🔥 Toast controlado
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleRegistrarInteres = async (eventoId) => {
    try {
      const success = await registrarInteres(eventoId);

      if (success) {
        showToast('¡Gracias por tu interés! Lo hemos registrado.', 'success');
        return true;
      }

      return false;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const renderToast = () => {
    if (!toast.show) return null;

    return (
      <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center animate-fade-in z-[200] max-w-[90vw] sm:max-w-md border border-white/20 backdrop-blur-sm ${
        toast.type === 'error' ? 'bg-red-600/95' : 'bg-gray-800/95'
      }`}>
        {toast.type === 'error'
          ? <AlertCircle size={24} className="mr-3 flex-shrink-0" />
          : <CheckCircle2 size={24} className="mr-3 flex-shrink-0 text-green-400" />
        }
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    );
  };

  // 🔥 Loading state
  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          Cargando detalles del evento...
        </p>
      </div>
    );
  }

  // 🔥 Error state
  if (error || !evento) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-12 px-4">
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center text-red-700 animate-fade-in">
          <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">
            Evento no encontrado
          </h2>
          <p className="text-lg mb-6">
            {error || 'El evento que buscas no existe.'}
          </p>
          <button
            onClick={() => navigate('/eventos')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Volver a la cartelera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {renderToast()}
      <PublicEventDetail
        evento={evento}
        onVolver={() => navigate('/eventos')}
        onInteres={handleRegistrarInteres}
        isInterestedInitial={checkInteresPrevio(evento.id)}
      />
    </div>
  );
}