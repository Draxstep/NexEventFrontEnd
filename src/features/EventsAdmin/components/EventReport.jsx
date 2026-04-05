import React from "react";
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  Heart,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/**
 * Componente EventReport
 * Componente presentacional para mostrar el evento con más interés
 * Sigue principios de presentación limpia y reutilizable
 */
export default function EventReport({
  event,
  onBack,
}) {
  if (!event) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 font-medium">
          No hay datos disponibles para mostrar.
        </p>
      </div>
    );
  }

  // Cálculo de cantidad de interesados
  const interestedCount =
    event.cantidadInteresados !== undefined
      ? event.cantidadInteresados
      : 0;

  // Formato de fecha (manejo de string o Date)
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Formato de hora
  const formatTime = (timeString) => {
    if (!timeString) return "Hora no especificada";
    // Si es HH:MM:SS, tomar solo HH:MM
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Calcular días restantes hasta el evento
  const daysUntilEvent = () => {
    if (!event.fecha) return 0;
    try {
      const eventDate = new Date(event.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar a medianoche
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const daysLeft = daysUntilEvent();

  return (
    <div className="w-full animate-fade-in">
      {/* Header con información principal */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg p-6 sm:p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-300" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Evento Destacado
            </h1>
          </div>
          <div className="bg-blue-500 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Award size={16} className="text-white" />
            <span className="text-sm font-bold text-white">Más Interés</span>
          </div>
        </div>
        <p className="text-blue-100 text-sm sm:text-base">
          Evento con mayor cantidad de personas interesadas hasta el momento
        </p>
      </div>

      {/* Imagen del evento */}
      {event.imagen_url && (
        <div className="relative h-64 sm:h-96 bg-gray-200 overflow-hidden">
          <img
            src={event.imagen_url}
            alt={event.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6 sm:p-8">
        {/* Título del evento */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {event.nombre}
        </h2>

        {/* Descripción */}
        {event.descripcion && (
          <p className="text-gray-600 mb-6 leading-relaxed">
            {event.descripcion}
          </p>
        )}

        {/* Grid de información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Fecha */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600 font-medium">Fecha</p>
              <p className="text-gray-900 font-semibold">
                {formatDate(event.fecha)}
              </p>
            </div>
          </div>

          {/* Hora */}
          {event.hora && (
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Clock className="text-purple-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600 font-medium">Hora</p>
                <p className="text-gray-900 font-semibold">
                  {formatTime(event.hora)}
                </p>
              </div>
            </div>
          )}

          {/* Ubicación */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
            <MapPin className="text-green-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600 font-medium">Ubicación</p>
              <p className="text-gray-900 font-semibold">{event.lugar}</p>
              {event.Ciudad && (
                <p className="text-sm text-gray-500">
                  {event.Ciudad.nombre}
                </p>
              )}
            </div>
          </div>

          {/* Categoría */}
          {event.Categoria && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <Tag className="text-amber-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600 font-medium">Categoría</p>
                <p className="text-gray-900 font-semibold">
                  {event.Categoria.nombre}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas de interés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Personas interesadas */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-6 border border-rose-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium text-sm">
                Personas Interesadas
              </span>
              <Heart className="text-rose-500" size={20} fill="currentColor" />
            </div>
            <p className="text-4xl font-bold text-rose-600 mb-1">
              {interestedCount}
            </p>
            <p className="text-xs text-gray-500">
              Personas han mostrado interés en asistir
            </p>
          </div>

          {/* Días hasta el evento */}
          {daysLeft > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium text-sm">
                  Días Restantes
                </span>
                <Clock className="text-blue-500" size={20} />
              </div>
              <p className="text-4xl font-bold text-blue-600 mb-1">
                {daysLeft}
              </p>
              <p className="text-xs text-gray-500">
                {daysLeft === 1
                  ? "¡El evento es hoy!"
                  : `Tiempo para prepararse`}
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        {event.capacidad && (
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg mb-8">
            <Users size={20} className="text-gray-700" />
            <div>
              <p className="text-sm text-gray-600">Capacidad máxima:</p>
              <p className="font-semibold text-gray-900">
                {event.capacidad} lugares disponibles
              </p>
            </div>
          </div>
        )}

        {event.valor && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg mb-8">
            <div className="bg-blue-600 text-white rounded-full p-2">
              $
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor del evento:</p>
              <p className="font-semibold text-gray-900">
                ${parseFloat(event.valor).toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        )}

        {/* Barra de progreso de interés */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">
              Nivel de Interés
            </p>
            <span className="text-sm font-semibold text-gray-600">
              {interestedCount} personas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (interestedCount / Math.max(interestedCount, 10)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={onBack}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight size={18} className="rotate-180" />
          Volver a Gestión de Eventos
        </button>
      </div>
    </div>
  );
}
