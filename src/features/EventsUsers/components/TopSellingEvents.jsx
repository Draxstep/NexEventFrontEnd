import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔹 Skeleton — se muestra mientras carga la petición (#70)
const TopSellingCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-200" />
    <div className="p-6 flex flex-col gap-3">
      <div className="h-5 bg-gray-200 rounded-full w-3/4" />
      <div className="h-4 bg-gray-200 rounded-full w-full" />
      <div className="h-4 bg-gray-200 rounded-full w-5/6" />
      <div className="h-10 bg-gray-200 rounded-xl mt-4" />
    </div>
  </div>
);

// 🔹 Card individual de cada evento
const TopSellingCard = ({ evento, rank }) => {
  const navigate = useNavigate();

  // Soporta tanto imagen_url (backend) como imagenUrl (adaptado)
  const imagen = evento.imagenUrl || evento.imagen_url;

  const rankColors = {
    1: 'bg-yellow-400 text-yellow-900',
    2: 'bg-gray-300 text-gray-700',
    3: 'bg-orange-300 text-orange-900',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-fade-in group">
      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {imagen ? (
          <img
            src={imagen}
            alt={`Portada de ${evento.nombre}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 font-medium">
            Sin imagen disponible
          </div>
        )}

        {/* Badge de ranking */}
        <div className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shadow-md ${rankColors[rank] || 'bg-gray-200 text-gray-600'}`}>
          #{rank}
        </div>

        {/* Badge Top Ventas */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
          <TrendingUp size={14} className="mr-1" /> Top Ventas
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {evento.nombre}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
          {evento.descripcion || 'Sin descripción disponible.'}
        </p>

        {/* CTA */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button
            onClick={() => navigate(`/eventos/${evento.id}`)}
            className="flex items-center justify-center w-full bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-300"
          >
            <span>Ver más detalles</span>
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 🔹 Componente principal
// Props:
//   events    — array de eventos adaptados
//   isLoading — boolean que viene de PublicEvents.jsx (#70)
const TopSellingEvents = ({ events = [], isLoading = false }) => {

  // 🔸 Estado Loading: 3 skeletons con animación de pulso (#70)
  if (isLoading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TopSellingCardSkeleton />
            <TopSellingCardSkeleton />
            <TopSellingCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  // 🔸 Estado Empty: mensaje cuando no hay eventos activos (#70)
  if (!events || events.length === 0) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-2xl">
            <TrendingUp size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium">¡Próximamente nuevos eventos destacados!</p>
          </div>
        </div>
      </section>
    );
  }

  // 🔸 Estado normal: muestra las cards
  return (
    <section className="py-12 bg-white w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 3).map((evento, index) => (
            <TopSellingCard key={evento.id} evento={evento} rank={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellingEvents;
