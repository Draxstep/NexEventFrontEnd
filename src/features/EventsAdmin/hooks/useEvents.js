import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllEvents,
  getEventById,
  getAllCategories,
  getAllDepartments,
  getCitiesByDepartment,
  createEvent,
  updateEvent,
  toggleEventStatus,
} from "../services/eventService";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: "", status: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "fecha",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* =========================
     LOAD INITIAL DATA
  ========================= */

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        eventsData,
        categoriesData,
        departmentsData,
      ] = await Promise.all([
        getAllEvents(),
        getAllCategories(),
        getAllDepartments(),
      ]);

      setEvents(eventsData);
      setCategories(categoriesData);
      setDepartments(departmentsData);

    } catch (err) {
      console.error(err);
      setError("Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /* =========================
     FILTERING & SORTING
  ========================= */

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "" });
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const processedEvents = useMemo(() => {
    let result = [...events];

    result = result.filter((e) => {
      const term = filters.search.toLowerCase();

      const matchSearch =
        e.nombre?.toLowerCase().includes(term) ||
        e.lugar?.toLowerCase().includes(term) ||
        e.Ciudad?.nombre?.toLowerCase().includes(term) ||
        e.Categoria?.nombre?.toLowerCase().includes(term);

      const matchStatus =
        filters.status !== ""
          ? e.estado === (filters.status === "active")
          : true;

      return matchSearch && matchStatus;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue;
        let bValue;

        if (sortConfig.key === "categoria") {
          aValue = a.Categoria?.nombre || "";
          bValue = b.Categoria?.nombre || "";
        } else if (sortConfig.key === "ciudad") {
          aValue = a.Ciudad?.nombre || "";
          bValue = b.Ciudad?.nombre || "";
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue)
          return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [events, filters, sortConfig]);

  const totalPages = Math.ceil(processedEvents.length / itemsPerPage);

  const paginatedEvents = processedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =========================
     CRUD ACTIONS
  ========================= */

  const addEvent = async (newEvent) => {
    try {
      await createEvent(newEvent);
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Error creating event.");
    }
  };

  const editEvent = async (updatedEvent) => {
    try {
      await updateEvent(updatedEvent.id, updatedEvent);
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Error updating event.");
    }
  };

  const disableEvent = async (id) => {
    try {
      await toggleEventStatus(id);
      await fetchInitialData();
    } catch (err) {
      setError(err.message || "Error changing event status.");
    }
  };
  
  const fetchEventById = async (id) => {
    try {
      return await getEventById(id);
    } catch (error) {
      console.error("Error fetching event by id:", error);
      throw error;
    }
  };

  const loadCitiesByDepartment = async (departmentId) => {
    try {
      const data = await getCitiesByDepartment(departmentId);
      setCities(data);
      return data; // 🔥 IMPORTANTE: retornar los datos
    } catch (err) {
      console.error(err);
      setCities([]);
      return []; // 🔥 retornar array vacío para evitar undefined
    }
  };

  return {
    events: paginatedEvents,
    categories,
    cities,
    departments,
    loading,
    error,
    filters,
    sortConfig,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchEvents: fetchInitialData,
    fetchEventById,
    addEvent,
    editEvent,
    disableEvent,
    updateFilter,
    clearFilters,
    requestSort,
    loadCitiesByDepartment,
  };
};