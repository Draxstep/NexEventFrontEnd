import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const EventFilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const hasFilters = filters.search || filters.estado;

  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda general */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Evento</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, ciudad o lugar..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="A">Activos</option>
            <option value="I">Inactivos / Deshabilitados</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center"
          >
            <RotateCcw size={14} className="mr-1" /> Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default EventFilterBar;