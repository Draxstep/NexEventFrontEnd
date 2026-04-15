const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getActiveEvents = async () => {
  const response = await fetch(`${API_URL}/eventos/activos`);

  if (!response.ok) {
    throw new Error("Error al obtener eventos activos");
  }

  return response.json();
};

export const getCompletedEvents = async () => {
  const response = await fetch(`${API_URL}/eventos/completados`);

  if (!response.ok) {
    throw new Error("Error al obtener eventos completados");
  }

  return response.json();
};

export const getActiveEventById = async (id) => {
  const response = await fetch(`${API_URL}/eventos/${id}`);

  if (!response.ok) {
    throw new Error("El evento no existe o fue retirado.");
  }

  return response.json();
};

export const getEventTicketAvailability = async (eventoId) => {
  const response = await fetch(
    `${API_URL}/evento-tipos-entrada/${eventoId}/disponibilidad`
  );
  const result = await safeJson(response);

  if (!response.ok) {
    throw new Error(
      result?.error ||
      result?.message ||
      "Error al obtener disponibilidad de entradas"
    );
  }

  return Array.isArray(result) ? result : [];
};

// Registrar interés
export const registrarInteres = async (eventoID, usuarioID) => {
  const response = await fetch(`${API_URL}/intereses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ evento_id: eventoID, usuario_id: usuarioID }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar interés');
  }

  return response.json();
};

// Obtener conteo
export const obtenerConteoIntereses = async (evento_id) => {
  const response = await fetch(
    `${API_URL}/intereses/evento/${evento_id}/conteo`
  );

  if (!response.ok) {
    throw new Error('Error al obtener conteo de intereses');
  }

  return response.json();
};

export const verificarInteres = async (evento_id, usuario_id) => {
  const response = await fetch(
    `${API_URL}/intereses/evento/${evento_id}/verificar/${usuario_id}`
  );

  if (!response.ok) {
    throw new Error("Error verificando interés");
  }

  return response.json();
};

export const eliminarInteres = async (evento_id, usuario_id) => {
  const response = await fetch(
    `${API_URL}/intereses/evento/${evento_id}/usuario/${usuario_id}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error eliminando interés");
  }

  return true;
};

export const getEventosByUsuarioId = async (usuario_id) => {
  const response = await fetch(`${API_URL}/intereses/usuario/${usuario_id}/eventos`);

  if (!response.ok) {
    throw new Error("Error al obtener eventos por usuario");
  }
  return response.json();
};

export const getTopSellingEvents = async () => {
  const response = await fetch(`${API_URL}/reportes/top-most-sold-events`);

  if (!response.ok) {
    throw new Error(`Error al obtener eventos más vendidos (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data.slice(0, 3) : [];
};

export const purchaseTickets = async (purchaseData) => {
    const response = await fetch(`${API_URL}/compras`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
      errorData.message ||
      "Failed to process purchase"
    );
    }

    return response.json();
};

export const getPurchaseHistory = async (usuario_id) => {
  const response = await fetch(`${API_URL}/compras/usuario/${usuario_id}/historial`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener el historial de compras");
  }

  return response.json();
};

export const getPurchaseDetails = async (compra_id) => {
  const response = await fetch(`${API_URL}/compras/${compra_id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al obtener el detalle de la compra");
  }

  return response.json();
};