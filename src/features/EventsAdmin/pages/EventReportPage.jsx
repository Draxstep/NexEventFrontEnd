import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { getAllEvents } from "../services/eventService";
import { getSalesReportByEvent } from "../services/salesReportService";
import SoldTicketsByTypeTable from "../components/SoldTicketsByTypeTable";

/**
 * EventReportPage
 * Reporte de ventas por evento (master–detail).
 */
export default function EventReportPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [detailReport, setDetailReport] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [totalsByEventId, setTotalsByEventId] = useState({});
  const reportsCacheRef = useRef(new Map());

  const handleBack = () => {
    navigate("/gestion-eventos");
  };

  const formatCOP = useCallback((value) => {
    const normalized = Number.parseFloat(value);
    if (!Number.isFinite(normalized)) return "-";
    return `$${normalized.toLocaleString("es-CO")}`;
  }, []);

  const computeTotals = useCallback((report) => {
    const items = Array.isArray(report?.ventas) ? report.ventas : [];
    const totalRevenue = items.reduce(
      (acc, item) => acc + (Number.parseFloat(item?.ganancia) || 0),
      0
    );
    const totalSold = items.reduce(
      (acc, item) => acc + (Number(item?.cantidad_vendida) || 0),
      0
    );
    return { totalRevenue, totalSold };
  }, []);

  const loadEventsAndTotals = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    setTotalsByEventId({});
    reportsCacheRef.current = new Map();
    setSelectedEventId(null);
    setDetailReport(null);
    setDetailError(null);

    try {
      const allEvents = await getAllEvents();
      const normalizedEvents = Array.isArray(allEvents) ? allEvents : [];
      setEvents(normalizedEvents);

      const results = await Promise.allSettled(
        normalizedEvents.map(async (evt) => {
          const report = await getSalesReportByEvent(evt.id);
          reportsCacheRef.current.set(evt.id, report);
          const totals = computeTotals(report);
          return { eventId: evt.id, totals };
        })
      );

      const nextTotals = {};
      results.forEach((res, index) => {
        const eventId = normalizedEvents[index]?.id;
        if (!eventId) return;
        if (res.status === "fulfilled") {
          nextTotals[eventId] = {
            totalRevenue: res.value.totals.totalRevenue,
            totalSold: res.value.totals.totalSold,
            error: null,
          };
        } else {
          nextTotals[eventId] = {
            totalRevenue: null,
            totalSold: null,
            error: "No se pudo cargar",
          };
        }
      });
      setTotalsByEventId(nextTotals);
    } catch (err) {
      console.error("Error loading events:", err);
      setEventsError(err?.message || "Error cargando eventos.");
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [computeTotals]);

  useEffect(() => {
    loadEventsAndTotals();
  }, [loadEventsAndTotals]);

  const selectEvent = useCallback(
    async (eventId) => {
      const normalizedId = Number(eventId);
      if (!Number.isInteger(normalizedId) || normalizedId <= 0) return;

      setSelectedEventId(normalizedId);
      setDetailLoading(true);
      setDetailError(null);

      try {
        const cached = reportsCacheRef.current.get(normalizedId);
        const report = cached ?? (await getSalesReportByEvent(normalizedId));
        reportsCacheRef.current.set(normalizedId, report);
        setDetailReport(report);

        setTotalsByEventId((prev) => {
          if (prev?.[normalizedId]?.totalRevenue !== undefined) return prev;
          const totals = computeTotals(report);
          return {
            ...prev,
            [normalizedId]: {
              totalRevenue: totals.totalRevenue,
              totalSold: totals.totalSold,
              error: null,
            },
          };
        });
      } catch (err) {
        console.error("Error loading sales report detail:", err);
        setDetailError(err?.message || "Error cargando el reporte de ventas.");
        setDetailReport(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [computeTotals]
  );

  const selectedEvent = useMemo(
    () => events.find((e) => Number(e.id) === Number(selectedEventId)) || null,
    [events, selectedEventId]
  );

  const detailItems = useMemo(
    () => (Array.isArray(detailReport?.ventas) ? detailReport.ventas : []),
    [detailReport]
  );

  const detailTotals = useMemo(
    () => computeTotals(detailReport),
    [computeTotals, detailReport]
  );

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
            onClick={loadEventsAndTotals}
            disabled={eventsLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <RefreshCw
              size={18}
              className={eventsLoading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {/* Estado de carga */}
        {eventsLoading ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center animate-fade-in">
            <div className="inline-block">
              <RefreshCw size={32} className="animate-spin text-blue-600 mb-4" />
            </div>
            <p className="text-gray-600 font-medium text-lg">
              Cargando eventos...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Preparando reporte de ventas
            </p>
          </div>
        ) : eventsError ? (
          <div className="bg-white rounded-lg shadow-md border border-red-200 p-8 text-center animate-fade-in">
            <div className="inline-block bg-red-100 rounded-full p-3 mb-4">
              <div className="w-8 h-8 text-red-600 flex items-center justify-center">
                ⚠️
              </div>
            </div>
            <p className="text-red-600 font-semibold text-lg mb-2">
              Error al cargar el reporte
            </p>
            <p className="text-gray-600 mb-6">{eventsError}</p>
            <button
              onClick={loadEventsAndTotals}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de eventos + total ganancias */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-900">
                  Eventos y Ganancias
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Click en un evento para ver el detalle por tipo
                </p>
              </div>

              {events.length === 0 ? (
                <div className="p-6 text-sm text-gray-600">
                  No hay eventos disponibles.
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {events.map((evt) => {
                      const totals = totalsByEventId?.[evt.id];
                      const isSelected =
                        Number(selectedEventId) === Number(evt.id);
                      const totalRevenue = totals?.totalRevenue;
                      const totalSold = totals?.totalSold;

                      return (
                        <li key={evt.id}>
                          <button
                            type="button"
                            onClick={() => selectEvent(evt.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                              isSelected ? "bg-blue-50" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {evt.nombre}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {evt.fecha ? `Fecha: ${evt.fecha}` : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-700">
                                  {totalRevenue === null ||
                                  totalRevenue === undefined
                                    ? "-"
                                    : formatCOP(totalRevenue)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {totalSold === null || totalSold === undefined
                                    ? ""
                                    : `Vendidas: ${totalSold}`}
                                </p>
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Detalle del evento seleccionado */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    Ventas por Tipo de Entrada
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedEvent
                      ? selectedEvent.nombre
                      : "Selecciona un evento"}
                  </p>
                </div>
              </div>

              {!selectedEventId ? (
                <div className="p-8 text-center text-gray-600">
                  Selecciona un evento del listado para ver el detalle.
                </div>
              ) : (
                <div className="p-4">
                  <SoldTicketsByTypeTable
                    items={detailItems}
                    loading={detailLoading}
                    error={detailError}
                    onRetry={() => selectEvent(selectedEventId)}
                  />
                </div>
              )}

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Volver a Gestión de Eventos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
