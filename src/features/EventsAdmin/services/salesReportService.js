const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * @typedef {Object} SalesReportEvent
 * @property {number} id
 * @property {string} nombre
 */

/**
 * @typedef {Object} SalesReportTicketType
 * @property {number} id
 * @property {string} nombre
 */

/**
 * @typedef {Object} SalesReportItem
 * @property {number} id
 * @property {number} tipo_entrada_id
 * @property {number} cantidad_vendida
 * @property {number} capacidad_total
 * @property {string|number} ganancia
 * @property {{ id: number, nombre: string }=} TipoEntrada
 */

/**
 * @typedef {Object} SalesReport
 * @property {SalesReportEvent} evento
 * @property {SalesReportItem[]} ventas
 */

/**
 * Obtiene el reporte de ventas por tipo de entrada para un evento.
 * Endpoint: GET /api/reportes/ventas/evento/:evento_id
 *
 * @param {number|string} eventId
 * @returns {Promise<SalesReport>}
 */
export const getSalesReportByEvent = async (eventId) => {
  const normalizedId = Number(eventId);
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new Error("evento_id inválido");
  }

  const response = await fetch(
    `${API_URL}/reportes/ventas/evento/${normalizedId}`
  );

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
