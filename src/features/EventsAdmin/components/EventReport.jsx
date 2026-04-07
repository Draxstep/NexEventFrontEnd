import React from "react";
import {
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  TrendingUp,
  Trophy,
} from "lucide-react";

/**
 * Componente EventReport
 * Componente presentacional para mostrar el ranking de los eventos con más interés
 */
export default function EventReport({ event, events = [], onBack }) {
  if (!event) {
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

  const ranking = Array.isArray(events) ? events : [];
  const restoDelRanking = ranking.length > 0 ? ranking.slice(1) : [];

  // Formato de fecha (manejo de string o Date)
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

        {/*Tabla eventos*/}
        {restoDelRanking.length > 0 && (
          <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <TrendingUp className="text-blue-600 mr-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Otros eventos en tendencia</h3>
            </div>
            
            <div className="divide-y divide-gray-100 bg-white">
              {restoDelRanking.map((ev, index) => {
                const evInteres = ev.total_intereses || ev.cantidadInteresados || 0;
                return (
                  <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-blue-50/50 transition-colors gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className={`text-xl font-black w-8 ${
                        index === 0 ? 'text-slate-400' : // #2 Plata
                        index === 1 ? 'text-amber-600' : // #3 Bronce
                        'text-blue-400'                  // #4 en adelante Azul
                      }`}>
                        #{index + 2}
                      </span>
                      <div>
                        <h4 className="font-bold text-gray-900">{ev.nombre}</h4>
                        <div className="flex gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={14}/> {formatDate(ev.fecha)}</span>
                          <span className="flex items-center gap-1"><MapPin size={14}/> {ev.Ciudad?.nombre || ev.lugar}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-start gap-2 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                      <Heart size={14} className="text-rose-500" fill="currentColor" />
                      <span className="font-bold text-rose-700 text-sm">{evInteres} interesados</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
