import React from "react";
import EventCard from "./EventCard";
import { TrendingUp } from "lucide-react";

export default function TopSellingEvents({ events }) {
  if (!events || events.length === 0) {
    return null; // No renderizar nada si no hay eventos
  }

  return (
    <div className="mb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-blue-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-900">Eventos Populares</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {events.map((evento, index) => (
          <div key={evento.id} className="relative transform transition-transform duration-300 hover:-translate-y-2">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-10 border-2 border-white">
              #{index + 1}
            </div>
            <EventCard evento={evento} />
          </div>
        ))}
      </div>
       <hr className="my-8 border-t-2 border-gray-200" />
    </div>
  );
}