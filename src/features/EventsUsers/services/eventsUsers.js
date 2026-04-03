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
export const getTopSellingEvents = async () => {
  try {
    // Intentamos consumir el API real
    const response = await fetch(`${API_URL}/eventos/top`);

    // Si el backend aún no ha creado esta ruta (404), lanzamos error para usar el mock
    if (!response.ok) {
      throw new Error(`Endpoint de backend no listo (${response.status})`);
    }

    return await response.json();
  } catch (error) {
   
    // Usamos el mock para que el Frontend y el diseño (#67) se puedan probar y no se rompa la app.
    console.warn("⚠️ Utilizando datos de prueba (Mock) para Top Events:", error.message);
    
    // Simulamos un pequeño tiempo de carga de red (conexión)
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          id: 1,
          nombre: "Festival de React & Front-End 2026",
          descripcion: "El encuentro anual más grande de entusiastas de desarrollo web. Aprende, comparte y conecta con la comunidad. Tres días llenos de workshops, charlas y networking con desarrolladores de toda Latinoamérica.",
          imagen_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: 2,
          nombre: "Tech Summit Inteligencia Artificial",
          descripcion: "Conferencia de tecnología de vanguardia sobre inteligencia artificial y el futuro del desarrollo de software. Contaremos con la presencia de expertos de la industria, demostraciones en vivo y paneles de discusión interactivos.",
          imagen_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: 3,
          nombre: "Concierto Electro Sound 3D",
          descripcion: "Una noche inolvidable con los mejores DJ de música electrónica en un escenario inmersivo 3D. Una experiencia visual y sonora que desafiará tus sentidos con lo último en tecnología de producción de eventos.",
          imagen_url: "https://images.unsplash.com/photo-1470229722913-7c090be5bc65?w=800&auto=format&fit=crop&q=60"
        }
      ]), 800);
    });
  }
};