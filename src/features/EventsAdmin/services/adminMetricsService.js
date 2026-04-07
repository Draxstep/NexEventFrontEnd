const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Obtiene métricas generales para el dashboard administrativo.
 * Endpoint: GET /api/reportes/metricas-generales
 *
 * Respuesta esperada:
 * {
 *   total_ganancias: number,
 *   eventos_activos: number,
 *   eventos_pasados: number,
 *   usuarios_registrados: number
 * }
 */
export const getAdminGeneralMetrics = async () => {
  const response = await fetch(`${API_URL}/reportes/metricas-generales`);
  const result = await safeJson(response);

  if (!response.ok) {
    const message =
      result?.error ||
      result?.message ||
      "Error al obtener métricas generales.";
    throw new Error(message);
  }

  return result;
};
