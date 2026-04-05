import React from 'react';
import { Calendar, Clock, MapPin, Tag, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const buildLocalEventDateTime = (fecha, hora) => {
  if (!fecha) return null;

  const [year, month, day] = String(fecha).split('-').map(Number);
  if (!year || !month || !day) return null;

  const [hour, minute, second] = (hora ? String(hora) : '23:59:59').split(':').map(Number);

  return new Date(
    year,
    month - 1,
    day,
    Number.isFinite(hour) ? hour : 23,
    Number.isFinite(minute) ? minute : 59,
    Number.isFinite(second) ? second : 59
  );
};

const isPastEvent = (fecha, hora, now = new Date()) => {
  const eventDateTime = buildLocalEventDateTime(fecha, hora);
  if (!eventDateTime) return false;
  return eventDateTime.getTime() < now.getTime();
};

const EventCard = ({ evento }) => {
  const past = isPastEvent(evento?.fecha, evento?.hora);

  return (
    // Transformamos el Div en un Link navegable hacia el Deep Link
    <Link 
      to={`/eventos/${evento.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-fade-in group block"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {evento.imagenUrl ? (
          <img 
            src={evento.imagenUrl} 
            alt={`Imagen de ${evento.nombre}`} 
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${past ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
        )}

        {past && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Finalizado
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center">
          <Tag size={12} className="mr-1" /> {evento.categoria}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {evento.nombre}
        </h3>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{evento.fecha}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{evento.hora}</span>
          </div>
          <div className="flex items-start text-sm text-gray-600">
            <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-2">{evento.lugar} ({evento.ciudad})</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center text-blue-700 font-bold">
            <DollarSign size={18} className="mr-0.5" />
            <span>{evento.valor > 0 ? evento.valor.toLocaleString('es-CO') : 'Gratis'}</span>
          </div>
          <span className="text-sm text-blue-600 font-medium group-hover:underline">Ver detalle</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;