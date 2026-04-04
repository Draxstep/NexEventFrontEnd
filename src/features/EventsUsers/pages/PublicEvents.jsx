import React from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEventsUsers } from '../hooks/useEventsUsers';
import EventGrid from '../components/EventGrid';
import PublicEventFilterBar from '../components/PublicEventFilterBar';

export default function PublicEvents() {
  const { 
    eventos, 
    eventosHistoricos,
    loading, 
    error, 
    filters, 
    categoriasDisponibles, 
    updateFilter, 
    clearFilters,
    currentPage,
    totalPages,
    goToPage
  } = useEventsUsers();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-screen flex flex-col">
      
      {/* Cabecera Principal */}
      <div className="mb-6 md:mb-8 animate-fade-in text-center sm:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Próximos Eventos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Descubre las mejores actividades, conciertos y obras teatrales cerca de ti.
          Selecciona un evento para conocer más detalles.
        </p>
      </div>

      {/* Barra de Filtros */}
      {!loading && !error && (
        <PublicEventFilterBar 
          filters={filters}
          categoriasDisponibles={categoriasDisponibles}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      {/* Contenido */}
      <div className="flex-1 w-full flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 flex-1">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">
              Buscando eventos increíbles...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center text-red-700 animate-fade-in my-auto">
            <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
            <p className="text-lg font-bold">{error}</p>
          </div>
        ) : eventos.length === 0 && (!eventosHistoricos || eventosHistoricos.length === 0) ? (
          <div className="text-center py-20 text-gray-500 flex-1 flex flex-col justify-center">
            <p className="text-lg font-medium">
              No hay eventos disponibles en este momento.
            </p>
          </div>
        ) : (
          <>
            {/* Próximos */}
            {eventos.length > 0 ? (
              <EventGrid eventos={eventos} />
            ) : (
              <div className="text-center py-14 text-gray-500">
                <p className="text-lg font-medium">
                  No hay eventos próximos en este momento.
                </p>
              </div>
            )}
            
            {/* Controles de paginación UI */}
            {eventos.length > 0 && totalPages > 1 && (
              <div className="mt-12 mb-8 flex justify-center items-center space-x-2 animate-fade-in">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Mostrar solo páginas iniciales, finales y cercanas a la actual para no saturar si hay muchas
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-full text-sm font-semibold transition-all shadow-sm ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white border-transparent' 
                              : 'bg-white text-gray-700 border-gray-200 border hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-1 text-gray-400 self-end mb-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Históricos */}
            {eventosHistoricos && eventosHistoricos.length > 0 && (
              <div className="mt-10 pt-10 border-t border-gray-100">
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                    Eventos históricos
                  </h2>
                </div>

                <EventGrid eventos={eventosHistoricos} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}