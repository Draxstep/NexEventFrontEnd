import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  RefreshCw, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Edit2,
  Power,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Search
} from 'lucide-react';

import Breadcrumb from '../components/Breadcrumb';

// ========== COMPONENTE: ESTADÍSTICAS ==========
const StatsCard = React.memo(({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm">Total Eventos</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
        </div>
        <Calendar className="w-8 h-8 text-blue-200" />
      </div>
    </div>

    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm">Activos</p>
          <p className="text-3xl font-bold mt-1">{stats.activos}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
           <span className="font-bold text-lg">A</span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm">Inactivos</p>
          <p className="text-3xl font-bold mt-1">{stats.inactivos}</p>
        </div>
        <Power className="w-8 h-8 text-gray-200" />
      </div>
    </div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// ========== COMPONENTE: BARRA DE FILTROS ==========
const EventosFilterBar = React.memo(({ 
  filters, 
  onFilterChange, 
  onClearFilters
}) => {
  const hasFilters = filters.search || filters.estado;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700 mb-1">
             Búsqueda
           </label>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               placeholder="Buscar por nombre o ubicación..."
               value={filters.search}
               onChange={(e) => onFilterChange('search', e.target.value)}
               className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             />
           </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filters.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
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
});

EventosFilterBar.displayName = 'EventosFilterBar';

export default function EventsManagment() {
  // Mock Data
  const [eventos, setEventos] = useState([
    { id: 1, nombre_evento: 'Concierto Rock', fecha: '2026-05-15', ubicacion: 'Estadio Nacional', capacidad: 50000, estado: 'A' },
    { id: 2, nombre_evento: 'Feria de Tecnología', fecha: '2026-06-20', ubicacion: 'Centro de Convenciones', capacidad: 10000, estado: 'A' },
    { id: 3, nombre_evento: 'Obra de Teatro Clásica', fecha: '2026-04-10', ubicacion: 'Teatro Municipal', capacidad: 500, estado: 'I' },
  ]);

  const [view, setView] = useState('list'); // 'list' | 'form'
  const [showStats, setShowStats] = useState(true);
  const [filters, setFilters] = useState({ search: '', estado: '' });
  
  const initialFormState = { id: null, nombre_evento: '', fecha: '', ubicacion: '', capacidad: '', estado: 'A' };
  const [formData, setFormData] = useState(initialFormState);

  // Estadísticas calculadas al vuelo
  const stats = useMemo(() => ({
    total: eventos.length,
    activos: eventos.filter(e => e.estado === 'A').length,
    inactivos: eventos.filter(e => e.estado === 'I').length
  }), [eventos]);

  // Filtrado
  const filteredEventos = useMemo(() => {
    return eventos.filter(e => {
      const matchSearch = e.nombre_evento.toLowerCase().includes(filters.search.toLowerCase()) || 
                          e.ubicacion.toLowerCase().includes(filters.search.toLowerCase());
      const matchEstado = filters.estado ? e.estado === filters.estado : true;
      return matchSearch && matchEstado;
    });
  }, [eventos, filters]);

  // Actions
  const handleNuevo = () => {
    setFormData(initialFormState);
    setView('form');
  };

  const handleEditar = (item) => {
    setFormData(item);
    setView('form');
  };

  const handleVolverLista = () => {
    setView('list');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardar = (e) => {
    e.preventDefault();
    if (formData.id) {
      setEventos(prev => prev.map(ev => ev.id === formData.id ? formData : ev));
    } else {
      setEventos(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setView('list');
  };

  const toggleEstado = (id) => {
    setEventos(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, estado: ev.estado === 'A' ? 'I' : 'A' };
      }
      return ev;
    }));
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', estado: '' });
  };

  // UI Helpers
  const getEstadoBadge = (estado) => {
    const isActive = estado === 'A';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  // ========== VISTA LISTA ==========
  const renderListView = () => (
    <div className="space-y-6">
      {showStats && <StatsCard stats={stats} />}

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header Tabla */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Gestión de Eventos</h2>
                <p className="text-blue-100 text-sm">Catálogo de eventos programados</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
                title="Alternar estadísticas"
              >
                {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <button
                onClick={handleNuevo}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
              >
                <Plus size={18} />
                <span>Nuevo Evento</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <EventosFilterBar 
            filters={filters} 
            onFilterChange={updateFilter} 
            onClearFilters={clearFilters}
          />

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Nombre Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Fecha / Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEventos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No se encontraron eventos.
                    </td>
                  </tr>
                ) : (
                  filteredEventos.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{item.nombre_evento}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col space-y-1">
                            <div className="text-sm text-gray-700 flex items-center">
                              <Calendar size={14} className="mr-1 text-gray-400"/> {item.fecha}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit flex items-center">
                              <MapPin size={12} className="mr-1"/> {item.ubicacion}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center text-sm text-gray-600">
                            <Users size={14} className="mr-2 text-gray-400" />
                            {item.capacidad}
                         </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEstadoBadge(item.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                        <button
                          onClick={() => handleEditar(item)}
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors"
                          title="Editar información"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleEstado(item.id)}
                          className={`${item.estado === 'A' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} inline-flex items-center transition-colors`}
                          title={item.estado === 'A' ? "Inactivar" : "Activar"}
                        >
                          {item.estado === 'A' ? <Power size={16} /> : <RefreshCw size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ========== VISTA FORMULARIO ==========
  const renderFormView = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {formData.id ? 'Editar Evento' : 'Registrar Evento'}
              </h2>
              <p className="text-blue-100 text-sm">Información del evento</p>
            </div>
          </div>
          <button
            onClick={handleVolverLista}
            className="text-white hover:bg-white/20 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>
        </div>
      </div>

      <form onSubmit={guardar} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna Izquierda: Identidad */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
               Datos Principales
             </h3>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento *</label>
               <input
                 required
                 name="nombre_evento"
                 value={formData.nombre_evento}
                 onChange={handleChange}
                 placeholder="Ej: Concierto Rock"
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
               <div className="relative">
                 <Calendar className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <input
                   required
                   type="date"
                   name="fecha"
                   value={formData.fecha}
                   onChange={handleChange}
                   className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
               <select
                 name="estado"
                 value={formData.estado}
                 onChange={handleChange}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 <option value="A">Activo</option>
                 <option value="I">Inactivo</option>
               </select>
             </div>
          </div>

          {/* Columna Derecha: Detalles Adicionales */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
               Ubicación y Capacidad
             </h3>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
               <div className="relative">
                 <MapPin className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <input
                   required
                   name="ubicacion"
                   value={formData.ubicacion}
                   onChange={handleChange}
                   placeholder="Ej: Estadio Nacional"
                   className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
               <div className="relative">
                 <Users className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <input
                   required
                   type="number"
                   name="capacidad"
                   value={formData.capacidad}
                   onChange={handleChange}
                   placeholder="Ej: 50000"
                   className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
             </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 font-medium"
          >
            <Save size={20} />
            <span>{formData.id ? 'Actualizar Evento' : 'Guardar Evento'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData(initialFormState)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Limpiar</span>
          </button>
        </div>
      </form>
    </div>
  );

  // ========== RENDER PRINCIPAL ==========
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb
        items={[
          { label: 'Inicio', path: '/' },
          { label: 'Eventos', path: '/eventos' },
          { label: 'Gestión de Eventos' },
        ]}
      />

      {view === 'list' ? renderListView() : renderFormView()}
    </div>
  );
}
