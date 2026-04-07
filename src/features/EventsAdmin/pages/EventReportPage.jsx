import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeft, ChevronDown, ChevronUp, BarChart3, TrendingUp } from "lucide-react";
import EventReport from "../components/EventReport";
import SoldTicketsByTypeTable from "../components/SoldTicketsByTypeTable";
import { useEventReport } from "../hooks/useEventReport";

const AccordionHeader = ({ title, icon, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between px-6 py-4 bg-white border ${isOpen ? 'border-b-0 rounded-t-xl' : 'rounded-xl'} border-gray-200 hover:bg-blue-50 transition-colors group`}
  >
    <div className="flex items-center gap-3 text-gray-800 group-hover:text-blue-700 transition-colors">
      {React.createElement(icon, {
        size: 24,
        className: isOpen ? "text-blue-600" : "text-gray-500",
      })}
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
      {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </div>
  </button>
);

/**
 * EventReportPage
 * Muestra múltiples reportes de manera dinámica utilizando acordeones.
 * - Reporte de Interés
 * - Reporte de Ventas
 */
export default function EventReportPage() {
  const navigate = useNavigate();
  const {
    event,
    events,
    loading,
    error,
    refreshReport,
    selectedSalesEventId,
    setSelectedSalesEventId,
    salesItems,
    loadingSales,
    errorSales,
    refreshSalesReport,
  } = useEventReport();
  
  // Estado de los acordeones
  const [openInterest, setOpenInterest] = useState(false);
  const [openSales, setOpenSales] = useState(false);

  const handleBack = () => {
    navigate("/gestion-eventos");
  };

  const handleRefreshAll = () => {
    refreshReport();
    refreshSalesReport();
  };

  const selectedSalesEvent =
    events.find((item) => Number(item.id) === Number(selectedSalesEventId)) || null;

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
            Reportes de Desempeño
          </h1>
          <button
            onClick={handleRefreshAll}
            disabled={loading || loadingSales}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 sm:px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <RefreshCw size={18} className={(loading || loadingSales) ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50 px-4 sm:px-6 py-2 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Acordeón: Reporte de Interés */}
        <section className="shadow-sm">
          <AccordionHeader 
            title="Ranking de Eventos por Interés" 
            icon={TrendingUp} 
            isOpen={openInterest} 
            onToggle={() => setOpenInterest(!openInterest)} 
          />
          {openInterest && (
             <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6 sm:p-8 animate-fade-in origin-top">
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Cargando métricas de interés...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold mb-2">Error al cargar el reporte</p>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : (
                <EventReport event={event} events={events} onBack={handleBack} />
              )}
            </div>
          )}
        </section>

        {/* Acordeón: Reporte de Ventas */}
        <section className="shadow-sm">
          <AccordionHeader 
            title="Reporte de Ventas por Evento" 
            icon={BarChart3} 
            isOpen={openSales} 
            onToggle={() => setOpenSales(!openSales)} 
          />
          {openSales && (
             <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6 sm:p-8 animate-fade-in origin-top">
               <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
                 <aside className="border border-gray-200 rounded-xl bg-gray-50">
                   <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl">
                     <p className="text-sm font-semibold text-gray-800">Eventos</p>
                     <p className="text-xs text-gray-500 mt-1">Selecciona un evento para ver su detalle de ventas.</p>
                   </div>

                   <div className="max-h-[420px] overflow-y-auto p-2 space-y-2">
                     {events.length === 0 ? (
                       <p className="text-sm text-gray-500 px-2 py-3">No hay eventos disponibles.</p>
                     ) : (
                       events.map((ev) => {
                         const isActive = Number(ev.id) === Number(selectedSalesEventId);
                         return (
                           <button
                             key={ev.id}
                             type="button"
                             onClick={() => setSelectedSalesEventId(ev.id)}
                             className={`w-full text-left px-3 py-3 rounded-lg border transition-colors ${
                               isActive
                                 ? "bg-blue-50 border-blue-300 text-blue-800"
                                 : "bg-white border-gray-200 text-gray-800 hover:bg-gray-100"
                             }`}
                           >
                             <p className="text-sm font-semibold line-clamp-2">{ev.nombre}</p>
                             <p className="text-xs text-gray-500 mt-1">{ev.fecha || "Sin fecha"}</p>
                           </button>
                         );
                       })
                     )}
                   </div>
                 </aside>

                 <div className="min-w-0">
                   <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                     <div>
                       <p className="text-sm text-gray-500">Evento seleccionado</p>
                       <p className="text-lg font-semibold text-gray-900">
                         {selectedSalesEvent?.nombre || "Selecciona un evento"}
                       </p>
                     </div>

                     <button
                       onClick={refreshSalesReport}
                       disabled={!selectedSalesEventId || loadingSales}
                       className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                     >
                       <RefreshCw size={16} className={loadingSales ? "animate-spin" : ""} />
                       Refrescar ventas
                     </button>
                   </div>

                   <SoldTicketsByTypeTable 
                     items={salesItems} 
                     loading={loadingSales} 
                     error={errorSales} 
                     onRetry={refreshSalesReport} 
                   />
                 </div>
               </div>
               
               {/* Botón volver genérico al final si está abierto */}
               <div className="mt-8">
                 <button
                   onClick={handleBack}
                   className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                 >
                   <ArrowLeft size={18} />
                   Volver a Gestión de Eventos
                 </button>
               </div>
            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}
