import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getActiveEvents,
  getActiveEventById,
  registrarInteres as registrarInteresService,
  obtenerConteoIntereses
} from "../services/eventsUsers";

export const useEventsUsers = () => {
  const [conteo, setConteo] = useState(0);
  const [eventosOriginales, setEventosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: "", categoria: "" });

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({ search: "", categoria: "" });

  // 🔥 Adaptador del formato backend → formato UI
  const adaptEvent = (event) => ({
    id: event.id,
    nombre: event.nombre,
    fecha: event.fecha,
    hora: event.hora,
    departamento: event.Ciudad?.Departamento?.nombre || "",
    ciudad: event.Ciudad?.nombre || "",
    lugar: event.lugar,
    categoria: event.categoria?.nombre || event.Categoria?.nombre || "",
    descripcion: event.descripcion,
    valor: event.valor,
    estado: event.estado,
    imagenUrl: event.imagen_url,
  });

  // 🔹 Extraer categorías únicas
  const categoriasDisponibles = useMemo(() => {
    const categoriasSet = new Set(
      eventosOriginales.map((e) => e.categoria)
    );
    return Array.from(categoriasSet).sort();
  }, [eventosOriginales]);

  // 🔹 Aplicar filtros
  const eventosFiltrados = useMemo(() => {
    return eventosOriginales.filter((e) => {
      const term = filters.search.toLowerCase();

      const matchSearch =
        e.nombre.toLowerCase().includes(term) ||
        e.ciudad.toLowerCase().includes(term) ||
        e.lugar.toLowerCase().includes(term);

      const matchCategoria = filters.categoria
        ? e.categoria === filters.categoria
        : true;

      return matchSearch && matchCategoria;
    });
  }, [eventosOriginales, filters]);

  // 🔥 Traer eventos activos reales
  const fetchEventos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getActiveEvents();
      const adapted = data.map(adaptEvent);
      setEventosOriginales(adapted);
    } catch (err) {
      setError("Error al cargar la cartelera de eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  // 🔥 Traer evento por ID real
  const fetchEventoById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getActiveEventById(id);
      return adaptEvent(data);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchConteo = useCallback(async (eventoId) => {
    try {
      const data = await obtenerConteoIntereses(eventoId);
      setConteo(data.conteo || 0);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const registrarInteres = useCallback(async (eventoId) => {
    try {
      setError(null);

      await registrarInteresService(eventoId); // 🔥 ahora sí correcto

      await fetchConteo(eventoId);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchConteo]);

  return {
    eventos: eventosFiltrados,
    loading,
    error,
    filters,
    categoriasDisponibles,
    updateFilter,
    clearFilters,
    fetchEventos,
    fetchEventoById,
    conteo,
    registrarInteres,
    fetchConteo,
  };
};