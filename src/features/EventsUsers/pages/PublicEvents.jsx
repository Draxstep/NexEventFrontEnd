import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import EventGrid from '../components/EventGrid';
import PublicEventFilterBar from '../components/PublicEventFilterBar';

export default function PublicEvents() {
  const { 
    eventos, loading, error, fetchEventos, 
    filters, categoriasDisponibles, updateFilter, clearFilters 
  } = useEventsUsers();

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-screen flex flex-col">
      
      {/* Cabecera Principal */}
      <div className="mb-6 md:mb-8 animate-fade-in text-center sm:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Próximos Eventos</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Descubre las mejores actividades, conciertos y obras teatrales cerca de ti. Selecciona un evento para conocer más detalles.
        </p>
      </div>

      {/* Nueva Barra de Filtros Públicos */}
      {!loading && !error && (
        <PublicEventFilterBar 
          filters={filters}
          categoriasDisponibles={categoriasDisponibles}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      {/* Ruteador de Vistas Interno */}
      <div className="flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Buscando eventos increíbles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center text-red-700 animate-fade-in">
            <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
            <p className="text-lg font-bold">{error}</p>
          </div>
        ) : (
          <EventGrid eventos={eventos} />
        )}
      </div>
    </div>
  );
}