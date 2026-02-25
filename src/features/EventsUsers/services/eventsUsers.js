const API_URL = "http://localhost:3000/api";

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