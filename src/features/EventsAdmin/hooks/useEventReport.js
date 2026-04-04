import { useState, useEffect, useCallback } from "react";
import { getEventsByPopularity } from "../services/reportService";

/**
 * Hook para gestionar la lógica de obtención del evento con más interés
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con event, loading, error y un método refresh
 */
export const useEventReport = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        err.message || "Error cargando el reporte del evento."
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventReport();
  }, [fetchEventReport]);

  const refreshReport = useCallback(async () => {
    await fetchEventReport();
  }, [fetchEventReport]);

  return {
    events,
    event: events.length > 0 ? events[0]: null,
    loading,
    error,
    refreshReport,
  };
};
