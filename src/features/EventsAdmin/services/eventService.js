const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const sanitizeEventPayload = (data = {}) => {
  const payload = { ...data };
  delete payload.tipos_entrada;
  return payload;
};

const appendIfPresent = (formData, key, value) => {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && value.trim() === "") return;
  formData.append(key, value);
};

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
  const sanitizedData = sanitizeEventPayload(data);
  const formData = new FormData();
  
  Object.keys(sanitizedData).forEach((key) => {
    // Si la clave es "imagen" y es null, no la enviamos
    if (sanitizedData[key] !== undefined && sanitizedData[key] !== null) {
      if (key === "imagen" && !(sanitizedData[key] instanceof File)) {
        return; // Evita mandar algo que no sea un archivo en la clave imagen
      }
      formData.append(key, sanitizedData[key]);
    }
  });

  const response = await fetch(`${API_URL}/eventos`, {
    method: "POST",
    body: formData,
  });

  const result = await safeJson(response);
  if (!response.ok) throw new Error(result.error || result.message || "Failed to create event");
  return result;
};

export const updateEvent = async (id, data) => {
  const sanitizedData = sanitizeEventPayload(data);

  // Cuando hay nueva imagen, enviamos multipart/form-data.
  // Es importante NO mandar imagen_url en este escenario para evitar conflictos
  // de validación (archivo nuevo vs URL antigua).
  const hasNewImage = sanitizedData.imagen instanceof File;

  if (hasNewImage) {
    const {
      id: _ignoredId,
      imagen_url: _ignoredImageUrl,
      ...multipartPayload
    } = sanitizedData;

    const formData = new FormData();

    Object.keys(multipartPayload).forEach((key) => {
      const value = multipartPayload[key];
      if (key === "imagen" && !(value instanceof File)) return;
      appendIfPresent(formData, key, value);
    });

    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || result.details || "Failed to update event");
    return result;
  } else {
    // Para actualizaciones sin cambiar imagen usamos JSON.
    const {
      id: _ignoredId,
      imagen: _ignoredImage,
      ...jsonPayload
    } = sanitizedData;

    const payload = Object.fromEntries(
      Object.entries(jsonPayload).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );

    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || result.details || "Failed to update event");
    return result;
  }
};

export const toggleEventStatus = async (id, estado) => {
  if (!estado) {
    throw new Error("Missing target status");
  }

  const response = await fetch(`${API_URL}/eventos/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  const result = await safeJson(response);
  if (!response.ok) {
    throw new Error(result?.error || result?.message || "Failed to update event status");
  }

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

export const createCategory = async (data) => {
  const response = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || result.details || "Failed to create category");
  return result;
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

export const getTicketTypes = async () => {
  const response = await fetch(`${API_URL}/tipos-entrada`);
  if (!response.ok) throw new Error("Failed to fetch ticket types");
  return response.json();
};

export const createTicketType = async (ticketTypeData) => {
  const response = await fetch(`${API_URL}/tipos-entrada`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketTypeData),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket type");
  }

  return response.json();
};

export const configureEventTicketTypes = async (eventId, ticketConfigs = []) => {
  const normalizedEventId = Number(eventId);
  if (!Number.isInteger(normalizedEventId) || normalizedEventId <= 0) {
    throw new Error("Invalid event id for ticket configuration");
  }

  if (!Array.isArray(ticketConfigs) || ticketConfigs.length === 0) {
    return null;
  }

  const payload = ticketConfigs
    .map((item) => ({
      tipo_entrada_id: Number(item?.tipo_entrada_id ?? item?.id),
      precio: Number(item?.precio) || 0,
      capacidad_total: Number(item?.capacidad_total) || 0,
    }))
    .filter(
      (item) =>
        Number.isInteger(item.tipo_entrada_id) &&
        item.tipo_entrada_id > 0 &&
        Number.isFinite(item.precio) &&
        Number.isFinite(item.capacidad_total)
    );

  if (payload.length === 0) {
    return null;
  }

  const response = await fetch(
    `${API_URL}/evento-tipos-entrada/${normalizedEventId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await safeJson(response);
  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        "Failed to configure ticket types for event"
    );
  }

  return result;
};