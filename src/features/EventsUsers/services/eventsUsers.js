const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getActiveEvents = async () => {
  const response = await fetch(`${API_URL}/eventos/activos`);

  if (!response.ok) {
    throw new Error("Error al obtener eventos activos");
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

// Obtener los 3 eventos activos más vendidos (Top 3)
// Llama a /eventos/activos y luego a /reportes/ventas/evento/:id
// para obtener la cantidad_vendida real de cada evento y ordenar correctamente
export const getTopSellingEvents = async () => {
  // 1. Traemos todos los eventos activos
  const response = await fetch(`${API_URL}/eventos/activos`);

  if (!response.ok) {
    throw new Error(`Error al obtener eventos top (${response.status})`);
  }

  const eventos = await response.json();

  // 2. Por cada evento pedimos su reporte de ventas para obtener cantidad_vendida real
  const eventosConVentas = await Promise.all(
    eventos.map(async (evento) => {
      try {
        const res = await fetch(`${API_URL}/reportes/ventas/evento/${evento.id}`);
        if (!res.ok) return { ...evento, totalVendido: 0 };

        const reporte = await res.json();

        // Sumamos cantidad_vendida de todos los tipos de entrada del evento
        const totalVendido = (reporte.ventas || []).reduce(
          (acc, v) => acc + (v.cantidad_vendida || 0),
          0
        );

        return { ...evento, totalVendido };
      } catch {
        return { ...evento, totalVendido: 0 };
      }
    })
  );

  // 3. Ordenamos de mayor a menor por ventas reales y devolvemos los top 3
  return eventosConVentas
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, 3);
};
