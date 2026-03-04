import { useState, useEffect, useCallback } from "react";
import { getEventWithMostInterest } from "../services/eventService";

/**
 * Hook para gestionar la lógica de obtención del evento con más interés
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con event, loading, error y un método refresh
 */
export const useEventReport = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchEventReport();
  }, [fetchEventReport]);

  const refreshReport = useCallback(async () => {
    await fetchEventReport();
  }, [fetchEventReport]);

  return {
    event,
    loading,
    error,
    refreshReport,
  };
};
