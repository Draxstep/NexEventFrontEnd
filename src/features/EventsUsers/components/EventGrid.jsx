import React from 'react';
import { CalendarX } from 'lucide-react';
import EventCard from './EventCard';

const EventGrid = ({ eventos }) => {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <CalendarX size={48} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Sin eventos a la vista</h3>
        <p className="text-gray-500 max-w-md">Actualmente no hay eventos disponibles. Vuelve a revisar más adelante.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
      {eventos.map(evento => (
        <EventCard key={evento.id} evento={evento} />
      ))}
    </div>
  );
};

export default EventGrid;