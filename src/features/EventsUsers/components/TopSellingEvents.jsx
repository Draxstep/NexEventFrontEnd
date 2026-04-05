import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { topSellingEventsMock } from '../../../mockData';


const TopSellingCard = ({ evento }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-fade-in group">
      {/* Contenedor de la Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {evento.imagen_url ? (
          <img 
            src={evento.imagen_url} 
            alt={`Portada de ${evento.nombre}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 font-medium">
            Sin imagen disponible
          </div>
        )}
        
        {/* Etiqueta (Badge) de Top Ventas */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
          <TrendingUp size={14} className="mr-1" /> Top Ventas
        </div>
      </div>
      
      {/* Contenido y Textos */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {evento.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
          {evento.descripcion}
        </p>
        
        {/* Acción Final CTA */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button className="flex items-center justify-center w-full bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-300">
            <span>Ver más detalles</span>
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal TopSellingEvents que recibe la prop "events"
// Por defecto está inyectando mockData si no se pasan ventos para probar el diseño.
const TopSellingEvents = ({ events = topSellingEventsMock }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-2xl mx-4 my-8">
        <TrendingUp size={48} className="text-gray-300 mb-4" />
        <p className="text-lg font-medium">Aún no hay eventos destacados en ventas.</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header de la sección */}
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-100">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
            <TrendingUp size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Eventos <span className="text-orange-500">Más Vendidos</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">Los eventos top del momento basados en ventas reales.</p>
          </div>
        </div>
        
        {/* Grid de Eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evento) => (
            <TopSellingCard key={evento.id} evento={evento} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellingEvents;
