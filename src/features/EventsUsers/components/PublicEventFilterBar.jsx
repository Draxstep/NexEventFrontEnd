import React from 'react';
import { Search, XCircle } from 'lucide-react';

const PublicEventFilterBar = ({ filters, onFilterChange, onClearFilters, categoriasDisponibles }) => {
  const hasFilters = filters.search || filters.categoria;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Input de Búsqueda de Texto Libre */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre del evento, ciudad o lugar..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
          />
        </div>

        {/* Select de Categoría */}
        <div className="w-full md:w-64">
          <select
            value={filters.categoria}
            onChange={(e) => onFilterChange('categoria', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón para limpiar filtros (solo aparece si hay algo escrito/seleccionado) */}
      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-red-500 font-medium flex items-center transition-colors"
          >
            <XCircle size={16} className="mr-1.5" /> Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicEventFilterBar;