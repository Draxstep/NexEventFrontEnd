const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Obtiene el reporte de ventas por tipo de entrada para un evento.
 * Endpoint: GET /api/reportes/ventas/evento/:evento_id
 */
export const getSalesReportByEvent = async (eventId) => {
  const normalizedId = Number(eventId);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new Error("evento_id inválido");
  }

  const response = await fetch(`${API_URL}/reportes/ventas/evento/${normalizedId}`);
  const result = await safeJson(response);

  if (!response.ok) {
    const message =
      result?.error ||
      result?.message ||
      "Error al obtener el reporte de ventas.";
    throw new Error(message);
  }

  return result;
};

export const getEventAvailability = async (id) => {
  const response = await fetch(`${API_URL}/evento-tipos-entrada/${id}/disponibilidad`);
  if (!response.ok) throw new Error("Error fetching availability");
  return await response.json();
};