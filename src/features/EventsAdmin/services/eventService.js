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

  // Si no se está enviando una nueva imagen (la imagen no es archivo físico)
  // enviamos JSON estándar en el PUT para coincidir con cómo está configurado tu backend para actualizar sin multer.
  const hasNewImage = sanitizedData.imagen instanceof File;

  if (hasNewImage) {
    // Si realmente tu backend soporta multer en el PUT (router.put('/:id', upload.single('imagen')...) ) usaríamos FormData:
    const formData = new FormData();
    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] !== undefined && sanitizedData[key] !== null) {
        if (key === "imagen" && !(sanitizedData[key] instanceof File)) return;
        formData.append(key, sanitizedData[key]);
      }
    });

    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: "PUT",
      body: formData,
    });
    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || result.details || "Failed to update event");
    return result;
  } else {
    // Para las actualizaciones normales sin cambios de foto o donde el backend esperaba application/json
    const payload = { ...sanitizedData };
    delete payload.imagen; // No mandamos el File nulo en JSON

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

/* =========================
   REPORTS
========================= */

export const getEventInterestCount = async (id) => {
  const response = await fetch(`${API_URL}/intereses/evento/${id}/conteo`);
  if (!response.ok) throw new Error("Failed to fetch interest count");
  return response.json();
};

export const getEventInterestRanking = async () => {
  // Step 1: Get all events
  const events = await getAllEvents();
  if (!events || events.length === 0) {
    return [];
  }

  // Step 2: Fetch interest counts for all events in parallel
  const interestCounts = await Promise.all(
    events.map((event) =>
      getEventInterestCount(event.id)
        .then((data) => {
          // Expecting { evento_id, total_interesados }
          return {
            id: event.id,
            totalInteresados: data.total_interesados || 0,
          };
        })
        .catch(() => ({
          id: event.id,
          totalInteresados: 0,
        }))
    )
  );

  // Step 3: Combine events with their interest counts
  const eventsWithInterest = events.map(event => {
    const interestData = interestCounts.find(ic => ic.id === event.id);
    return {
      ...event,
      cantidadInteresados: interestData ? interestData.totalInteresados : 0,
    };
  });

  // Step 4: Sort by interest count descending
  return eventsWithInterest.sort((a, b) => b.cantidadInteresados - a.cantidadInteresados);
};

export const getEventWithMostInterest = async () => {
  const ranking = await getEventInterestRanking();
  if (ranking.length === 0) {
    throw new Error("No events found");
  }
  
  const topEvent = ranking[0];
  
  // Step 5: Fetch full event details for the top event (optional if the list already has enough info, but keeping it to not break existing flow if needed)
  const eventDetails = await getEventById(topEvent.id);

  return {
    ...eventDetails,
    cantidadInteresados: topEvent.cantidadInteresados,
  };
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