import { useState, useEffect, useCallback, useMemo } from "react";
import { getActiveEvents, getActiveEventById } from "../services/eventsUsers";

export const useEventsUsers = () => {
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

  // 🔹 Interés (puedes luego conectarlo al backend)
  const checkInteresPrevio = (eventoId) =>
    localStorage.getItem(`interes_evento_${eventoId}`) === "true";

  const registrarInteres = async (eventoId) => {
    if (checkInteresPrevio(eventoId)) return false;

    try {
      localStorage.setItem(`interes_evento_${eventoId}`, "true");
      return true;
    } catch {
      throw new Error("No pudimos registrar tu interés.");
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

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
    checkInteresPrevio,
    registrarInteres,
  };
};