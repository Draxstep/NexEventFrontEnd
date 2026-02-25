import { useState, useEffect, useCallback, useMemo } from 'react';

const MOCK_PUBLIC_EVENTS = [
  { 
    id: 1, nombre: 'Festival de Verano', fecha: '2026-08-15', hora: '14:00',
    departamento: 'Cundinamarca', ciudad: 'Bogotá', lugar: 'Parque Simón Bolívar', 
    categoria: 'Concierto', descripcion: 'Gran festival anual de música y cultura con artistas internacionales.', 
    valor: 50000, estado: 'A', imagenUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 2, nombre: 'Obra Teatral: El Quijote', fecha: '2026-09-10', hora: '19:30',
    departamento: 'Antioquia', ciudad: 'Medellín', lugar: 'Teatro Metropolitano', 
    categoria: 'Teatro', descripcion: 'Adaptación moderna del clásico de la literatura española.', 
    valor: 0, estado: 'A', imagenUrl: 'https://images.unsplash.com/photo-1507676184212-d0330a152332?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 3, nombre: 'Maratón 10K', fecha: '2026-10-05', hora: '07:00',
    departamento: 'Valle del Cauca', ciudad: 'Cali', lugar: 'Estadio Pascual Guerrero', 
    categoria: 'Deportes', descripcion: 'Compite en la carrera más grande de la ciudad.', 
    valor: 35000, estado: 'A', imagenUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800' 
  }
];

export const useEventsUsers = () => {
  const [eventosOriginales, setEventosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVO: Estado para los Filtros Públicos ---
  const [filters, setFilters] = useState({ search: '', categoria: '' });

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ search: '', categoria: '' });

  // 1. Extraer categorías únicas para alimentar el menú desplegable
  const categoriasDisponibles = useMemo(() => {
    const categoriasSet = new Set(eventosOriginales.map(e => e.categoria));
    return Array.from(categoriasSet).sort();
  }, [eventosOriginales]);

  // 2. Procesar el arreglo original aplicando los filtros
  const eventosFiltrados = useMemo(() => {
    return eventosOriginales.filter(e => {
      const term = filters.search.toLowerCase();
      const matchSearch = e.nombre.toLowerCase().includes(term) || 
                          e.ciudad.toLowerCase().includes(term) || 
                          e.lugar.toLowerCase().includes(term);
      
      const matchCategoria = filters.categoria ? e.categoria === filters.categoria : true;
      
      return matchSearch && matchCategoria;
    });
  }, [eventosOriginales, filters]);
  // ------------------------------------------------

  // Traer todo el catálogo
  const fetchEventos = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setEventosOriginales(MOCK_PUBLIC_EVENTS);
    } catch (err) {
      setError("Error al cargar la cartelera de eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Traer un solo evento por su ID (Para el Deep Link)
  const fetchEventoById = useCallback(async (id) => {
    setLoading(true); setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const evento = MOCK_PUBLIC_EVENTS.find(e => e.id.toString() === id.toString());
      if (!evento) throw new Error("El evento que buscas no existe o fue retirado.");
      return evento;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkInteresPrevio = (eventoId) => {
    return localStorage.getItem(`interes_evento_${eventoId}`) === 'true';
  };

  const registrarInteres = async (eventoId) => {
    if (checkInteresPrevio(eventoId)) return false;
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      localStorage.setItem(`interes_evento_${eventoId}`, 'true');
      return true;
    } catch (error) {
      throw new Error("No pudimos registrar tu interés. Intenta de nuevo.");
    }
  };

  return {
    // Exportamos los eventos ya filtrados al componente
    eventos: eventosFiltrados, 
    loading, error,
    // Exportamos utilidades de filtrado
    filters, categoriasDisponibles, updateFilter, clearFilters,
    fetchEventos, fetchEventoById, checkInteresPrevio, registrarInteres
  };
};