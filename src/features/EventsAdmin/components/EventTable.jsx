import React from 'react';
import { Calendar, MapPin, Tag, Eye, Edit2, Power, RefreshCw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const EventTable = ({ 
  eventos, categorias, 
  onVisualizar, onEditar, onToggleEstado,
  sortConfig, requestSort, currentPage, totalPages, onPageChange
}) => {
  
  if (!eventos || eventos.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center text-gray-500 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <p className="text-lg font-medium">No existen eventos registrados actualmente</p>
      </div>
    );
  }

  const getCategoriaNombre = (id) => categorias.find(c => c.id === id)?.nombre || 'Desconocida';

  // Ícono dinámico para las columnas
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <ChevronDown size={14} className="text-gray-300 ml-1 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-blue-600 ml-1" /> : <ChevronDown size={14} className="text-blue-600 ml-1" />;
  };

  // Componente interno para las cabeceras clickeables
  const SortableHeader = ({ label, columnKey }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {label} {getSortIcon(columnKey)}
      </div>
    </th>
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Nombre" columnKey="nombre" />
              <SortableHeader label="Fecha / Hora" columnKey="fecha" />
              <SortableHeader label="Ubicación" columnKey="ciudad" />
              <SortableHeader label="Categoría" columnKey="categoria" />
              <SortableHeader label="Estado" columnKey="estado" />
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventos.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-bold text-gray-900">{item.nombre}</div></td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                   <div className="flex items-center"><Calendar size={14} className="mr-2 text-gray-400"/> {item.fecha}</div>
                   <div className="text-xs text-gray-500 mt-1">{item.hora}</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                   <div className="flex flex-col">
                     <span className="flex items-center"><MapPin size={14} className="mr-1 text-gray-400"/> {item.ciudad}, {item.departamento}</span>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">{item.lugar}</span>
                   </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                   <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full w-fit">
                      <Tag size={12} className="mr-1" /> {getCategoriaNombre(item.categoria)}
                   </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.estado === 'A' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                  <button onClick={() => onVisualizar(item)} className="text-gray-500 hover:text-gray-900" title="Visualizar"><Eye size={18} /></button>
                  <button onClick={() => onEditar(item)} className="text-blue-600 hover:text-blue-900" title="Editar"><Edit2 size={18} /></button>
                  <button onClick={() => onToggleEstado(item)} className={item.estado === 'A' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} title={item.estado === 'A' ? "Deshabilitar" : "Habilitar"}>
                    {item.estado === 'A' ? <Power size={18} /> : <RefreshCw size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER DE PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Anterior
            </button>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span></p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => onPageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;