import { useState, useEffect, useCallback } from "react";
import { getEventWithMostInterest } from "../services/eventService";
import { getTopMostSoldEvents } from "../services/reportService"
/**
 * Hook para gestionar la lógica de obtención del evento con más interés
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con event, loading, error y un método refresh
 */
export const useEventReport = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Variales TOP
  const [topEvents, setTopEvents] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [errorTop, setErrorTop] = useState(null);

  const fetchEventReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const reportEvent = await getEventWithMostInterest();
      if (!reportEvent) {
        setError("No hay eventos disponibles para mostrar.");
        setEvent(null);
      } else {
        setEvent(reportEvent);
      }
    } catch (err) {
      console.error("Error fetching event report:", err);
      setError(
        err.message || "Error cargando el reporte del evento."
      );
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopEvents = useCallback(async () => {
    setLoadingTop(true);
    setErrorTop(null);
    try {
      const data = await getTopMostSoldEvents();
      if (!data || data.length === 0) {
        setTopEvents([]);
      } else {
        setTopEvents(data);
      }
    } catch (err) {
      console.error("Error fetching top events:", err);
      setErrorTop(err.message || "Error cargando el top de ventas.");
    } finally {
      setLoadingTop(false);
    }
  }, []);

  useEffect(() => {
    fetchEventReport();
    fetchTopEvents();
  }, [fetchEventReport, fetchTopEvents]);

  const refreshReport = useCallback(async () => {
    await fetchEventReport();
  }, [fetchEventReport]);

  const refreshTop = useCallback(async () => {
    await fetchTopEvents();
  }, [fetchTopEvents]);

  return {
    event,
    loading,
    error,
    refreshReport,
    topEvents,
    loadingTop,
    errorTop,
    refreshTop
  };
};
