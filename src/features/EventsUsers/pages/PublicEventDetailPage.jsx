import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import PublicEventDetail from '../components/PublicEventDetail';
import { useClerk } from '@clerk/clerk-react';

const buildLocalEventDateTime = (fecha, hora) => {
  if (!fecha) return null;

  const [year, month, day] = String(fecha).split('-').map(Number);
  if (!year || !month || !day) return null;

  const [hour, minute, second] = (hora ? String(hora) : '23:59:59').split(':').map(Number);

  const d = new Date(
    year,
    month - 1,
    day,
    Number.isFinite(hour) ? hour : 23,
    Number.isFinite(minute) ? minute : 59,
    Number.isFinite(second) ? second : 59
  );

  return Number.isNaN(d.getTime()) ? null : d;
};

const isPastEvent = (fecha, hora, now = new Date()) => {
  const dt = buildLocalEventDateTime(fecha, hora);
  if (!dt) return false;
  return dt.getTime() < now.getTime();
};

export default function PublicEventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSignIn, isSignedIn } = useClerk();

  const {
    fetchEventoById,
    conteo,
    registrarInteres,
    fetchConteo,
    verificarInteres,
    interesado,
    eliminarInteres
  } = useEventsUsers();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [blocked, setBlocked] = useState(false);

  /* =========================
      CARGAR EVENTO
  ========================== */
  const cargarEvento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setBlocked(false);

      const data = await fetchEventoById(id);

      if (!data) {
        throw new Error(
          'El evento que buscas no existe o fue retirado.'
        );
      }

      // Bloqueo: si el evento ya finalizó, no permitimos ver detalles.
      if (isPastEvent(data.fecha, data.hora)) {
        setBlocked(true);
        setEvento(null);
        return null;
      }

      setEvento(data);

      // Cargar conteo apenas tengamos el evento
      await fetchConteo(data.id);
      return data;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id, fetchEventoById, fetchConteo]);

  useEffect(() => {

    const init = async () => {
      window.scrollTo(0, 0);

      const eventoData = await cargarEvento();

      if (eventoData) {
        await verificarInteres(eventoData.id);
      }
    };

    init();

  }, [cargarEvento, verificarInteres]);

  /* =========================
      TOAST
  ========================== */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /* =========================
      REGISTRAR INTERÉS
  ========================== */
  const handleRegistrarInteres = async () => {
    if (!evento) return;
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const success = await registrarInteres(evento.id);
    if (success) {
      showToast(
        '¡Gracias por tu interés! Lo hemos registrado.',
        'success'
      );
    } else {
      showToast(
        'No se pudo registrar el interés.',
        'error'
      );
    }
    return success;
  };

  const handleEliminarInteres = async () => {
    if (!evento) return;

    const success = await eliminarInteres(evento.id);

    if (success) {
      showToast(
        'Tu interés ha sido eliminado.',
        'success'
      );
    } else {
      showToast(
        'No se pudo eliminar el interés.',
        'error'
      );
    }
    return success;
  };
  /* =========================
      ESTADOS
  ========================== */

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

  if (error || !evento) {
    if (blocked) {
      return (
        <div className="w-full max-w-3xl mx-auto mt-12 px-4">
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl text-center text-gray-700 animate-fade-in">
            <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">Evento finalizado</h2>
            <p className="text-lg mb-6">
              Este evento ya finalizó y sus detalles no están disponibles.
            </p>
            <button
              onClick={() => navigate('/eventos')}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Volver a la cartelera
            </button>
          </div>
        </div>
      );
    }

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

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center animate-fade-in z-[200] max-w-[90vw] sm:max-w-md border border-white/20 backdrop-blur-sm ${toast.type === 'error'
              ? 'bg-red-600/95'
              : 'bg-gray-800/95'
            }`}
        >
          {toast.type === 'error'
            ? <AlertCircle size={24} className="mr-3 flex-shrink-0" />
            : <CheckCircle2 size={24} className="mr-3 flex-shrink-0 text-green-400" />
          }
          <span className="text-sm font-medium">
            {toast.message}
          </span>
        </div>
      )}

      <PublicEventDetail
        evento={evento}
        conteoIntereses={conteo}
        onVolver={() => navigate('/eventos')}
        onInteres={handleRegistrarInteres}
        isInterested={interesado}
        onEliminarInteres={handleEliminarInteres}
      />
    </div>
  );
}