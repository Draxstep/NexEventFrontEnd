import React from 'react';
import { ArrowLeft, Calendar, MapPin, Tag, Clock, DollarSign, AlignLeft, Image as ImageIcon } from 'lucide-react';

const EventDetail = ({ evento, categorias, onVolver }) => {
  if (!evento) return null;

  const categoriaNombre = categorias.find(c => c.id === evento.categoria)?.nombre || 'Desconocida';
  const estadoLabel = evento.estado === 'A' ? 'Activo' : 'Deshabilitado';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full overflow-hidden">
      <div className="bg-blue-700 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white truncate pr-4">Detalle del Evento</h2>
        <button onClick={onVolver} className="text-white hover:bg-blue-800 p-2 rounded-lg flex items-center transition-colors flex-shrink-0">
          <ArrowLeft size={18} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Volver</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="text-2xl font-extrabold text-gray-900">{evento.nombre}</h3>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${evento.estado === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {estadoLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start"><Calendar className="text-gray-400 mr-3 mt-1" size={20}/><div><p className="text-sm text-gray-500">Fecha</p><p className="font-medium">{evento.fecha}</p></div></div>
            <div className="flex items-start"><Clock className="text-gray-400 mr-3 mt-1" size={20}/><div><p className="text-sm text-gray-500">Hora</p><p className="font-medium">{evento.hora}</p></div></div>
            <div className="flex items-start"><MapPin className="text-gray-400 mr-3 mt-1" size={20}/><div><p className="text-sm text-gray-500">Ubicación</p><p className="font-medium">{evento.lugar} ({evento.ciudad}, {evento.departamento})</p></div></div>
            <div className="flex items-start"><Tag className="text-gray-400 mr-3 mt-1" size={20}/><div><p className="text-sm text-gray-500">Categoría</p><p className="font-medium">{categoriaNombre}</p></div></div>
            <div className="flex items-start"><DollarSign className="text-gray-400 mr-3 mt-1" size={20}/><div><p className="text-sm text-gray-500">Valor</p><p className="font-medium">{evento.valor > 0 ? `$${evento.valor}` : 'Gratuito'}</p></div></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <AlignLeft className="text-gray-400 mr-3 mt-1" size={20}/>
              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-medium text-gray-700 whitespace-pre-wrap">{evento.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <ImageIcon className="text-gray-400 mr-3 mt-1" size={20}/>
              <div>
                <p className="text-sm text-gray-500">Imagen Representativa</p>
                {/* Placeholder visual, ya que no estamos subiendo a un backend real aún */}
                <div className="mt-2 w-full max-w-xs h-32 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  {evento.imagen ? evento.imagen.name || 'Imagen cargada' : 'Sin imagen'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;