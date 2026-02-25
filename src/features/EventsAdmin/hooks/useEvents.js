import { useState, useEffect, useCallback, useMemo } from 'react';

const CATEGORIAS_INICIALES = [
  { id: 'C01', nombre: 'Concierto' }, { id: 'C02', nombre: 'Teatro' },
  { id: 'C03', nombre: 'Deportes' }, { id: 'C04', nombre: 'Académico' }
];

export const UBICACIONES = {
  "Antioquia": ["Medellín", "Envigado", "Bello", "Itagüí"],
  "Bogotá D.C.": ["Bogotá"],
  "Cundinamarca": ["Chía", "Soacha", "Zipaquirá", "Cajicá"],
  "Valle del Cauca": ["Cali", "Palmira", "Buga", "Buenaventura"]
};

export const useEvents = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIALES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: '', estado: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'asc' }); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); 
  };
  
  const clearFilters = () => {
    setFilters({ search: '', estado: '' });
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedEventos = useMemo(() => {
    let result = eventos.filter(e => {
      const term = filters.search.toLowerCase();
      const matchSearch = e.nombre.toLowerCase().includes(term) || 
                          e.ciudad.toLowerCase().includes(term) || 
                          e.lugar.toLowerCase().includes(term);
      const matchEstado = filters.estado ? e.estado === filters.estado : true;
      return matchSearch && matchEstado;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'categoria') {
          aValue = categorias.find(c => c.id === aValue)?.nombre || '';
          bValue = categorias.find(c => c.id === bValue)?.nombre || '';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [eventos, filters, sortConfig, categorias]);

  const totalPages = Math.ceil(processedEventos.length / itemsPerPage);
  const paginatedEventos = processedEventos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchEventos = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setEventos([{ id: 1, nombre: 'Festival de Verano', fecha: '2026-08-15', departamento: 'Cundinamarca', ciudad: 'Bogotá', lugar: 'Parque Simón Bolívar', hora: '14:00', categoria: 'C01', descripcion: 'Gran festival anual.', valor: 50000, estado: 'A', imagen: null }]);
    } catch (err) { setError("Error al cargar los eventos."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEventos(); }, [fetchEventos]);

  const procesarCategoria = (categoriaInput) => {
    const existe = categorias.find(c => c.id === categoriaInput || c.nombre.toLowerCase() === categoriaInput.toLowerCase());
    if (existe) return existe.id;
    const nuevaCategoria = { id: `C${Date.now()}`, nombre: categoriaInput };
    setCategorias(prev => [...prev, nuevaCategoria]);
    return nuevaCategoria.id;
  };

  const agregarEvento = (nuevoEvento) => {
    const categoriaId = procesarCategoria(nuevoEvento.categoria);
    const eventoConId = { ...nuevoEvento, categoria: categoriaId, id: Date.now(), estado: 'A' };
    setEventos(prev => [eventoConId, ...prev]);
  };

  const actualizarEvento = (eventoActualizado) => {
    const categoriaId = procesarCategoria(eventoActualizado.categoria);
    const eventoFinal = { ...eventoActualizado, categoria: categoriaId };
    setEventos(prev => prev.map(ev => ev.id === eventoFinal.id ? eventoFinal : ev));
  };

  const deshabilitarEvento = async (id) => {
    if (Math.random() < 0.2) throw new Error("No fue posible completar la acción. Error de conexión con el servidor.");
    setEventos(prev => prev.map(ev => ev.id === id ? { ...ev, estado: 'I' } : ev));
  };

  return {
    eventos: paginatedEventos, 
    loading, error, categorias, ubicaciones: UBICACIONES, filters,
    sortConfig, requestSort, currentPage, totalPages, setCurrentPage,
    fetchEventos, agregarEvento, actualizarEvento, deshabilitarEvento,
    updateFilter, clearFilters
  };
};