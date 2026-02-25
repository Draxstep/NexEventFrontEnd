import axios from 'axios';
const API_URL = "http://localhost:3000";

export const getEvents = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener eventos");
  return response.json();
};

export const createEvent = async (event) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  });

  if (!response.ok) throw new Error("Error al crear evento");
  return response.json();
};

export const updateEvent = async (id, event) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  });

  if (!response.ok) throw new Error("Error al actualizar evento");
  return response.json();
};

export const disableEvent = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH"
  });

  if (!response.ok) throw new Error("Error al deshabilitar evento");
  return response.json();
};