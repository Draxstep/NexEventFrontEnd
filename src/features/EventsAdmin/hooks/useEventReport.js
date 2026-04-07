import { useState, useEffect, useCallback } from "react";
import { getEventWithMostInterest } from "../services/eventService";
import { getTopMostSoldEvents } from "../services/reportService"
/**
 * Hook para gestionar la lógica de obtención del reporte de interés y ranking
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con ranking, event (top 1), loading, error y un método refresh
 */
export const useEventReport = () => {
  const [events, setEvents] = useState([]);
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
      const rankedEvents = await getEventsByPopularity();
      if (!rankedEvents || rankedEvents.length === 0) {
        setError("No hay eventos disponibles para mostrar.");
        setEvents([]);
      } else {
        setEvents(rankedEvents);
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
    events,
    event: events.length > 0 ? events[0]: null,
    loading,
    error,
    refreshReport,
    topEvents,
    loadingTop,
    errorTop,
    refreshTop
  };
};
