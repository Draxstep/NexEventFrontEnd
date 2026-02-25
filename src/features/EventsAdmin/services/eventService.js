const API_URL = "http://localhost:3000/api";

/* =========================
   EVENTS
========================= */

export const getAllEvents = async () => {
  const response = await fetch(`${API_URL}/eventos`);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

export const getActiveEvents = async () => {
  const response = await fetch(`${API_URL}/eventos/activos`);
  if (!response.ok) throw new Error("Failed to fetch active events");
  return response.json();
};

export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/eventos/${id}`);
  if (!response.ok) throw new Error("Event not found");
  return response.json();
};

export const createEvent = async (data) => {
  const response = await fetch(`${API_URL}/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to create event");
  return result;
};

export const updateEvent = async (id, data) => {
  const response = await fetch(`${API_URL}/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to update event");
  return result;
};

export const toggleEventStatus = async (id) => {
  const response = await fetch(`${API_URL}/eventos/${id}/estado`, {
    method: "PATCH",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to toggle status");
  return result;
};

/* =========================
   CATEGORIES
========================= */

export const getAllCategories = async () => {
  const response = await fetch(`${API_URL}/categorias`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

/* =========================
   DEPARTMENTS
========================= */

export const getAllDepartments = async () => {
  const response = await fetch(`${API_URL}/departamentos`);
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
};

/* =========================
   CITIES
========================= */

export const getCitiesByDepartment = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/departamentos/${departmentId}/ciudades`
  );

  if (!response.ok) throw new Error("Failed to fetch cities");
  return response.json();
};