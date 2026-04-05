import React from "react";
import { ArrowRight, Trophy, Heart } from "lucide-react";

/**
 * Componente EventReport
 * Componente presentacional para mostrar el ranking de los eventos con más interés
 */
export default function EventReport({ ranking = [], onBack }) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg animate-fade-in">
        <p className="text-gray-500 font-medium">
          No hay datos disponibles para generar un ranking en este momento.
        </p>
        <button
          onClick={onBack}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Volver a Gestión de Eventos
        </button>
      </div>
    );
  }

  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Contenido principal */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
        {/* Tabla de Ranking de Eventos */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-yellow-500" size={32} />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-yellow-200 pb-1 inline-block">
                Ranking de Eventos por Interés
              </h2>
            </div>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <th className="py-4 px-6 font-semibold w-24 text-center">Posición</th>
                  <th className="py-4 px-6 font-semibold">Evento</th>
                  <th className="py-4 px-6 font-semibold">Fecha Programada</th>
                  <th className="py-4 px-6 font-semibold text-right">Interesados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ranking.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-blue-50 transition-colors ${
                      index === 0 ? 'bg-yellow-50/50' : 
                      index === 1 ? 'bg-gray-50' : 
                      index === 2 ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-gray-700 mx-auto ${
                        index === 0 ? 'bg-yellow-400 text-white shadow-md' : 
                        index === 1 ? 'bg-gray-300 text-gray-800' : 
                        index === 2 ? 'bg-amber-600 text-white' : 
                        'bg-gray-100'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.nombre}</p>
                      {item.Categoria && (
                        <span className="text-xs text-gray-500">{item.Categoria.nombre}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatDate(item.fecha)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                        <span className="font-bold text-rose-600">{item.cantidadInteresados}</span>
                        <Heart size={14} className="text-rose-500" fill="currentColor" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón volver */}
        <button
          onClick={onBack}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight size={18} className="rotate-180" />
          Volver a Gestión de Eventos
        </button>
      </div>
    </div>
  );
}
