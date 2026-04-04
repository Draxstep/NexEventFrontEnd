import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  getActiveEvents,
  getActiveEventById,
  registrarInteres as registrarInteresService,
  obtenerConteoIntereses,
  verificarInteres as verificarInteresService,
  eliminarInteres as eliminarInteresService,
  getEventosByUsuarioId as getEventosByUsuarioIdService
} from "../services/eventsUsers";


const buildLocalEventDateTime = (fecha, hora) => {
  if (!fecha || typeof fecha !== "string") return null;

  const dateParts = fecha.split("-").map((p) => Number.parseInt(p, 10));
  if (dateParts.length !== 3 || dateParts.some((n) => Number.isNaN(n))) return null;

  const [year, month, day] = dateParts;

  // Si no hay hora, asumimos fin de día para no marcar como finalizado antes de tiempo.
  let hour = 23;
  let minute = 59;
  let second = 59;

  if (hora && typeof hora === "string") {
    const timeParts = hora
      .trim()
      .split(":")
      .map((p) => Number.parseInt(p, 10));

    if (
      timeParts.length >= 2 &&
      timeParts.length <= 3 &&
      !timeParts.some((n) => Number.isNaN(n))
    ) {
      hour = timeParts[0];
      minute = timeParts[1];
      second = timeParts[2] ?? 0;
    }
  }

  const d = new Date(year, month - 1, day, hour, minute, second, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const isPastEvent = (fecha, hora, now = new Date()) => {
  const eventDateTime = buildLocalEventDateTime(fecha, hora);
  if (!eventDateTime) return false;
  return eventDateTime.getTime() < now.getTime();
};


export const useEventsUsers = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const [interesado, setInteresado] = useState(false);

  const [conteo, setConteo] = useState(0);
  const [eventosOriginales, setEventosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: "", categoria: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [eventosFavoritos, setEventosFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);
  const [errorFavoritos, setErrorFavoritos] = useState(null);
  const ITEMS_PER_PAGE = 6;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Volvemos a la primera página al filtrar
  };

  const clearFilters = () => {
    setFilters({ search: "", categoria: "" });
    setCurrentPage(1); // Volvemos a la primera página de la lista cuando no hay filtros
  };

  // 🔥 Adaptador del formato backend → formato UI
  const adaptEvent = (event) => ({
    id: event.id,
    nombre: event.nombre,
    fecha: event.fecha,
    hora: event.hora,
    departamento: event.Ciudad?.Departamento?.nombre || "",
    ciudad: event.Ciudad?.nombre || "",
    lugar: event.lugar,
    categoria: event.categoria?.nombre || event.Categorium?.nombre || event.Categoria?.nombre || "",
    descripcion: event.descripcion,
    valor: event.valor,
    estado: event.estado,
    imagenUrl: event.imagen_url,
  });

  // 🔹 Extraer categorías únicas
  const categoriasDisponibles = useMemo(() => {
    const categoriasSet = new Set(
      eventosOriginales.map((e) => e.categoria).filter(Boolean)
    );
    return Array.from(categoriasSet).sort();
  }, [eventosOriginales]);

  // 🔹 Aplicar filtros
  const eventosFiltrados = useMemo(() => {
    const filtered = eventosOriginales.filter((e) => {
      const term = filters.search.toLowerCase();

      const matchSearch =
        e.nombre.toLowerCase().includes(term) ||
        (e.ciudad && e.ciudad.toLowerCase().includes(term)) ||
        (e.lugar && e.lugar.toLowerCase().includes(term));

      const matchCategoria = filters.categoria
        ? e.categoria === filters.categoria
        : true;

      return matchSearch && matchCategoria;
    });

    // Orden UX: próximos primero (fecha asc). Finalizados al final.
    // Para finalizados, se muestran del más reciente al más antiguo.
    const now = new Date();
    return [...filtered].sort((a, b) => {
      const aPast = isPastEvent(a.fecha, a.hora, now);
      const bPast = isPastEvent(b.fecha, b.hora, now);

      if (aPast !== bPast) return aPast ? 1 : -1;

      const aDt = buildLocalEventDateTime(a.fecha, a.hora);
      const bDt = buildLocalEventDateTime(b.fecha, b.hora);

      if (!aDt && !bDt) return 0;
      if (!aDt) return 1;
      if (!bDt) return -1;

      // Ambos próximos: asc. Ambos finalizados: desc.
      const diff = aDt.getTime() - bDt.getTime();
      return aPast ? -diff : diff;
    });
  }, [eventosOriginales, filters]);

  // 🔹 Paginación en memoria
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return eventosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [eventosFiltrados, currentPage]);

  const totalPages = Math.ceil(eventosFiltrados.length / ITEMS_PER_PAGE);

  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

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
      setConteo(data.total || 0);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const verificarInteres = useCallback(async (eventoId) => {
    if (!isLoaded) return;
    if (!isSignedIn || !user?.id) {
      setInteresado(false);
      return;
    }

    try {
      const data = await verificarInteresService(
        eventoId,
        user.id
      );

      setInteresado(data.interesado);

    } catch (err) {
      console.error(err);
      setInteresado(false);
    }

  }, [isSignedIn, user, isLoaded]);

  const registrarInteres = useCallback(async (eventoId) => {
    try {
      setError(null);

      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }
      await registrarInteresService(eventoId, user.id); // 🔥 ahora sí correcto
      setInteresado(true);
      await fetchConteo(eventoId);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchConteo, user]);

  const eliminarInteres = useCallback(async (eventoId) => {
    try {
      setError(null);
      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }
      await eliminarInteresService(eventoId, user.id);
      setInteresado(false);
      setEventosFavoritos(prev =>
        prev.filter(evento => evento.id !== eventoId)
      );
      await fetchConteo(eventoId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [user, fetchConteo]);

  const fetchEventosFavoritos = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingFavoritos(true);
      setErrorFavoritos(null);

      const data = await getEventosByUsuarioIdService(user.id);

      setEventosFavoritos(data);
    } catch (err) {
      setErrorFavoritos("No se pudieron cargar tus favoritos.");
    } finally {
      setLoadingFavoritos(false);
    }
  }, [user]);

  return {
    // Retornamos los eventos paginados en lugar de todos
    eventos: paginatedEvents,
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
    interesado,
    verificarInteres,
    eliminarInteres,
    eventosFavoritos,
    loadingFavoritos,
    errorFavoritos,
    fetchEventosFavoritos,

    // Utils de paginación
    currentPage,
    totalPages,
    goToPage,
  };
};