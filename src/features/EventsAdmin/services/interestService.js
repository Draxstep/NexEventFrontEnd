const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================
   INTERESTS / LIKES
========================= */

/**
 * Obtiene el conteo de intereses para un evento específico
 * Endpoint: GET /api/intereses/evento/:evento_id/conteo
 */
export const getEventInterestCount = async (eventId) => {
  try {
    const response = await fetch(
      `${API_URL}/intereses/evento/${eventId}/conteo`
    );
    if (!response.ok) throw new Error("Failed to fetch interest count");
    return response.json();
  } catch (error) {
    console.error(
      `Error fetching interest count for event ${eventId}:`,
      error
    );
    throw error;
  }
};

/**
 * Verifica si un usuario está interesado en un evento
 * Endpoint: GET /api/intereses/evento/:evento_id/verificar/:usuario_id
 */
export const checkUserInterest = async (eventId, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/intereses/evento/${eventId}/verificar/${userId}`
    );
    if (!response.ok) throw new Error("Failed to verify interest");
    return response.json();
  } catch (error) {
    console.error(
      `Error verifying interest for event ${eventId} and user ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Registra un nuevo interés en un evento
 * Endpoint: POST /api/intereses
 */
export const registerEventInterest = async (eventId, userId) => {
  try {
    const response = await fetch(`${API_URL}/intereses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento_id: eventId, usuario_id: userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to register interest");
    }

    return response.json();
  } catch (error) {
    console.error(`Error registering interest for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Elimina el interés de un usuario en un evento
 * Endpoint: DELETE /api/intereses/evento/:evento_id/usuario/:usuario_id
 */
export const removeEventInterest = async (eventId, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/intereses/evento/${eventId}/usuario/${userId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to remove interest");
    }

    return response.json();
  } catch (error) {
    console.error(`Error removing interest for event ${eventId}:`, error);
    throw error;
  }
};
