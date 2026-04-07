import { useState, useEffect, useCallback } from "react";
import { getEventsByPopularity } from "../services/reportService";
import { getSalesReportByEvent } from "../services/salesReportService";
/**
 * Hook para gestionar la lógica de obtención del reporte de interés y ranking
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con ranking, event (top 1), loading, error y un método refresh
 */
export const useEventReport = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSalesEventId, setSelectedSalesEventId] = useState(null);
  const [salesItems, setSalesItems] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [errorSales, setErrorSales] = useState(null);

  const fetchEventReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rankedEvents = await getEventsByPopularity();
      if (!rankedEvents || rankedEvents.length === 0) {
        setError("No hay eventos disponibles para mostrar.");
        setEvents([]);
        setSelectedSalesEventId(null);
      } else {
        setEvents(rankedEvents);
        setSelectedSalesEventId((prev) => {
          if (prev && rankedEvents.some((item) => Number(item.id) === Number(prev))) {
            return prev;
          }
          return rankedEvents[0]?.id ?? null;
        });
      }
    } catch (err) {
      console.error("Error fetching event report:", err);
      setError(
        err.message || "Error cargando el reporte de los eventos."
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalesReport = useCallback(async (eventId) => {
    const normalizedId = Number(eventId);
    if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
      setSalesItems([]);
      setErrorSales(null);
      return;
    }

    setLoadingSales(true);
    setErrorSales(null);

    try {
      const data = await getSalesReportByEvent(normalizedId);
      const ventas = Array.isArray(data?.ventas) ? data.ventas : [];
      setSalesItems(ventas);
    } catch (err) {
      console.error("Error fetching sales report:", err);
      setErrorSales(err.message || "Error cargando el reporte de ventas.");
      setSalesItems([]);
    } finally {
      setLoadingSales(false);
    }
  }, []);

  useEffect(() => {
    fetchEventReport();
  }, [fetchEventReport]);

  useEffect(() => {
    fetchSalesReport(selectedSalesEventId);
  }, [selectedSalesEventId, fetchSalesReport]);

  const refreshReport = useCallback(async () => {
    await fetchEventReport();
  }, [fetchEventReport]);

  const refreshSalesReport = useCallback(async () => {
    await fetchSalesReport(selectedSalesEventId);
  }, [fetchSalesReport, selectedSalesEventId]);

  return {
    events,
    event: events.length > 0 ? events[0] : null,
    loading,
    error,
    refreshReport,
    selectedSalesEventId,
    setSelectedSalesEventId,
    salesItems,
    loadingSales,
    errorSales,
    refreshSalesReport,
  };
};
