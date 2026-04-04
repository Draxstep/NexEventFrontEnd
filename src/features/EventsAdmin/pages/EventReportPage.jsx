import React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useEventReport } from "../hooks/useEventReport";
import EventReport from "../components/EventReport";

/**
 * EventReportPage
 * Página contenedora para mostrar el reporte del evento con más interés
 * Maneja la navegación y el estado del reporte
 */
export default function EventReportPage() {
  const navigate = useNavigate();
  const { event, events, loading, error, refreshReport } = useEventReport();

  const handleBack = () => {
    navigate("/gestion-eventos");
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barra de navegación superior */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 mb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Reportes de Eventos
          </h1>
          <button
            onClick={refreshReport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {/* Estado de carga */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center animate-fade-in">
            <div className="inline-block">
              <RefreshCw size={32} className="animate-spin text-blue-600 mb-4" />
            </div>
            <p className="text-gray-600 font-medium text-lg">
              Cargando reporte...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Analizando eventos y su interés
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-8 text-center animate-fade-in">
            <div className="inline-block bg-red-100 rounded-full p-3 mb-4">
              <div className="w-8 h-8 text-red-600 flex items-center justify-center">
                ⚠️
              </div>
            </div>
            <p className="text-red-600 font-semibold text-lg mb-2">
              Error al cargar el reporte
            </p>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refreshReport}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reintentar
            </button>
          </div>
        ) : (
          <EventReport event={event} events={events} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
