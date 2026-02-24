import React, { useMemo } from 'react';
import { Can } from '../../../components/security/PermissionWrappers';
import { 
  Tag, 
  Plus, 
  RefreshCw, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Edit2,
  Globe,
  Phone,
  Power,
  ChevronDown,
  ChevronUp,
  MapPin,
  Barcode,
  Search
} from 'lucide-react';

// Importación de componentes UI (Simulación basada en referencia)
import Breadcrumb from '../../../components/Breadcrumb';
import Toast, { ToastContainer } from '../../../components/Toast';
import Modal, { ModalFooter, ModalSecondaryButton } from '../../../components/Modal';
import { FormField, Input } from '../../../components/FormComponents';
import { 
  Pagination, 
  SortableColumnHeader, 
  EmptyState 
} from '../../../components/FilterComponents';

import { useMarcasGestion } from '../../../hooks/useMarcasGestion';

// ========== COMPONENTE: ESTADÍSTICAS ==========
const StatsCard = React.memo(({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm">Total Marcas</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
        </div>
        <Tag className="w-8 h-8 text-blue-200" />
      </div>
    </div>

    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm">Activas</p>
          <p className="text-3xl font-bold mt-1">{stats.activas}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
           <span className="font-bold text-lg">A</span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-100 text-sm">Inactivas</p>
          <p className="text-3xl font-bold mt-1">{stats.inactivas}</p>
        </div>
        <Power className="w-8 h-8 text-gray-200" />
      </div>
    </div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// ========== COMPONENTE: BARRA DE FILTROS ==========
const MarcasFilterBar = React.memo(({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  CONSTANTS
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
             <Input
               type="text"
               placeholder="Buscar por nombre, código o país..."
               value={filters.search}
               onChange={(e) => onFilterChange('search', e.target.value)}
               className="pl-10"
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
            {CONSTANTS.ESTADOS.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
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

MarcasFilterBar.displayName = 'MarcasFilterBar';

export default function GestionMarcasMedidores() {
  const {
    // Data & State
    formData, view, loading, modals, toasts, errors, CONSTANTS,
    paginationInfo, filters, sortConfig, selectedItem, marcas,
    
    // Actions
    handleChange, guardar, cargarDatos,
    handleNuevo, handleEditar, handleVolverLista,
    updateFilter, clearFilters, handleSort, goToPage, changeItemsPerPage,
    
    // Status Logic
    abrirModalEstado, cerrarModalEstado, confirmarCambioEstado,
    removeToast
  } = useMarcasGestion();

  const [showStats, setShowStats] = React.useState(true);

  // Estadísticas calculadas al vuelo
  const stats = useMemo(() => ({
    total: marcas.length,
    activas: marcas.filter(m => m.estado === 'A').length,
    inactivas: marcas.filter(m => m.estado === 'I').length
  }), [marcas]);

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
                <Tag size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Marcas de Medidores</h2>
                <p className="text-blue-100 text-sm">Catálogo de fabricantes y proveedores</p>
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
                onClick={cargarDatos}
                disabled={loading.general}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading.general ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              <Can permission="MARCAS.CREAR" showDisabled>
                <button
                  onClick={handleNuevo}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
                >
                  <Plus size={18} />
                  <span>Nueva Marca</span>
                </button>
              </Can>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <MarcasFilterBar 
            filters={filters} 
            onFilterChange={updateFilter} 
            onClearFilters={clearFilters}
            CONSTANTS={CONSTANTS}
          />

          {loading.general ? (
             <div className="text-center py-12">
               <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
               <p className="mt-4 text-gray-600">Cargando catálogo...</p>
             </div>
          ) : paginationInfo.totalItems === 0 ? (
             <EmptyState hasFilters={filters.search || filters.estado} onClearFilters={clearFilters} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                         <SortableColumnHeader label="Nombre Marca" sortKey="nombre_marca" currentSortKey={sortConfig.key} sortDirection={sortConfig.direction} onSort={handleSort} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                         <SortableColumnHeader label="Origen / Código" sortKey="pais_origen" currentSortKey={sortConfig.key} sortDirection={sortConfig.direction} onSort={handleSort} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                         Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                         <SortableColumnHeader label="Estado" sortKey="estado" currentSortKey={sortConfig.key} sortDirection={sortConfig.direction} onSort={handleSort} />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginationInfo.currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{item.nombre_marca}</div>
                          {item.sitio_web && (
                             <a href={item.sitio_web} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                               <Globe size={10} className="mr-1"/> {item.sitio_web}
                             </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col space-y-1">
                              {item.pais_origen && (
                                <div className="text-sm text-gray-700 flex items-center">
                                  <MapPin size={14} className="mr-1 text-gray-400"/> {item.pais_origen}
                                </div>
                              )}
                              {item.codigo_proveedor && (
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit flex items-center">
                                  <Barcode size={12} className="mr-1"/> {item.codigo_proveedor}
                                </div>
                              )}
                              {!item.pais_origen && !item.codigo_proveedor && <span className="text-gray-400 text-sm">-</span>}
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.telefono_soporte ? (
                             <div className="flex items-center text-sm text-gray-600">
                                <Phone size={14} className="mr-2 text-gray-400" />
                                {item.telefono_soporte}
                             </div>
                          ) : (
                             <span className="text-gray-400 text-xs italic">Sin contacto</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEstadoBadge(item.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                          <Can permission="MARCAS.EDITAR" showDisabled>
                            <button
                              onClick={() => handleEditar(item)}
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors"
                              title="Editar información"
                            >
                              <Edit2 size={16} />
                            </button>
                          </Can>
                          <Can permission="MARCAS.ESTADO" showDisabled>
                            <button
                              onClick={() => abrirModalEstado(item)}
                              className={`${item.estado === 'A' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} inline-flex items-center transition-colors`}
                              title={item.estado === 'A' ? "Inactivar" : "Activar"}
                            >
                              {item.estado === 'A' ? <Power size={16} /> : <RefreshCw size={16} />}
                            </button>
                          </Can>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paginationInfo.totalPages > 1 && (
                <Pagination 
                   {...paginationInfo}
                   onPageChange={goToPage}
                   onItemsPerPageChange={changeItemsPerPage}
                />
              )}
            </>
          )}
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
              <Tag size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {formData.id ? 'Editar Marca' : 'Registrar Marca'}
              </h2>
              <p className="text-blue-100 text-sm">Información del fabricante</p>
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
             
             <FormField label="Nombre de Marca" required error={errors.nombre_marca}>
               <Input
                 name="nombre_marca"
                 value={formData.nombre_marca}
                 onChange={handleChange}
                 placeholder="Ej: LANDIS+GYR"
                 error={errors.nombre_marca}
               />
             </FormField>

             <FormField label="Código Proveedor" hint="Identificación interna (Max 20)">
               <Input
                 name="codigo_proveedor"
                 value={formData.codigo_proveedor}
                 onChange={handleChange}
                 placeholder="Ej: PROV-001"
                 maxLength={20}
               />
             </FormField>

             <FormField label="Estado">
               <select
                 name="estado"
                 value={formData.estado}
                 onChange={handleChange}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 {CONSTANTS.ESTADOS.map(e => (
                   <option key={e.value} value={e.value}>{e.label}</option>
                 ))}
               </select>
             </FormField>
          </div>

          {/* Columna Derecha: Detalles Adicionales */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
               Ubicación y Contacto
             </h3>

             <FormField label="País de Origen">
               <div className="relative">
                 <MapPin className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <Input
                   name="pais_origen"
                   value={formData.pais_origen}
                   onChange={handleChange}
                   placeholder="Ej: Alemania"
                   className="pl-10"
                 />
               </div>
             </FormField>

             <FormField label="Sitio Web">
                <div className="relative">
                 <Globe className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <Input
                   name="sitio_web"
                   value={formData.sitio_web}
                   onChange={handleChange}
                   placeholder="www.ejemplo.com"
                   className="pl-10"
                 />
                </div>
             </FormField>

             <FormField label="Teléfono de Soporte">
                <div className="relative">
                 <Phone className="absolute top-2.5 left-3 text-gray-400" size={18} />
                 <Input
                   name="telefono_soporte"
                   value={formData.telefono_soporte}
                   onChange={handleChange}
                   placeholder="+57 300 123 4567"
                   className="pl-10"
                   maxLength={20}
                 />
                </div>
             </FormField>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 mt-4">
          <Can permission={formData.id ? 'MARCAS.EDITAR' : 'MARCAS.CREAR'} showDisabled>
            <button
              type="submit"
              disabled={loading.submit}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center space-x-2 font-medium"
            >
              {loading.submit ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{formData.id ? 'Actualizar Marca' : 'Guardar Marca'}</span>
                </>
              )}
            </button>
          </Can>
          
          <button
            type="button"
            onClick={() => { setFormData(initialFormState); setErrors({}); }}
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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Inicio', path: '/menu' },
          { label: 'Catastro', path: '/clientes' },
          { label: 'Marcas de Medidores' },
        ]}
      />

      {view === 'list' ? renderListView() : renderFormView()}

      {/* MODAL: CAMBIAR ESTADO */}
      <Modal
        isOpen={modals.confirmChangeStatus}
        onClose={cerrarModalEstado}
        title={selectedItem?.estado === 'A' ? "Inactivar Marca" : "Activar Marca"}
        size="md"
      >
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${selectedItem?.estado === 'A' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-start space-x-3">
              {selectedItem?.estado === 'A' ? (
                 <Power size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                 <RefreshCw size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${selectedItem?.estado === 'A' ? 'text-red-900' : 'text-green-900'}`}>
                  ¿Confirmar cambio de estado para "{selectedItem?.nombre_marca}"?
                </p>
                <p className={`text-sm mt-1 ${selectedItem?.estado === 'A' ? 'text-red-800' : 'text-green-800'}`}>
                  {selectedItem?.estado === 'A' 
                    ? "La marca pasará a estado Inactivo y no podrá ser seleccionada para nuevos registros."
                    : "La marca pasará a estado Activo y estará disponible en el sistema."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter>
          <button
            onClick={confirmarCambioEstado}
            disabled={loading.submit}
            className={`${selectedItem?.estado === 'A' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors`}
          >
            {loading.submit ? 'Procesando...' : 'Confirmar'}
          </button>
          <ModalSecondaryButton onClick={cerrarModalEstado}>
            Cancelar
          </ModalSecondaryButton>
        </ModalFooter>
      </Modal>

      <ToastContainer>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </ToastContainer>
    </div>
  );
}