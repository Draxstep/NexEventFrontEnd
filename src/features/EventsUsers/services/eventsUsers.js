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