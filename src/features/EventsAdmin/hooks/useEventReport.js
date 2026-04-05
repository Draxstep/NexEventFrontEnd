import { useState, useEffect, useCallback } from "react";
import { getEventInterestRanking } from "../services/eventService";

/**
 * Hook para gestionar la lógica de obtención del reporte de interés y ranking
 * Sigue el patrón de separación de responsabilidades (SOLID)
 * @returns {Object} objeto con ranking, event (top 1), loading, error y un método refresh
 */
export const useEventReport = () => {
  const [ranking, setRanking] = useState([]);
  const [event, setEvent] = useState(null); // The top 1 event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fullRanking = await getEventInterestRanking();
      
      if (!fullRanking || fullRanking.length === 0) {
        setError("No hay eventos disponibles para mostrar.");
        setRanking([]);
        setEvent(null);
      } else {
        setRanking(fullRanking);
        setEvent(fullRanking[0]); // El primero es el de mayor interés
      }
    } catch (err) {
      console.error("Error fetching event report:", err);
      setError(
        err.message || "Error cargando el reporte de los eventos."
      );
      setRanking([]);
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
    ranking,
    event,
    loading,
    error,
    refreshReport,
  };
};
