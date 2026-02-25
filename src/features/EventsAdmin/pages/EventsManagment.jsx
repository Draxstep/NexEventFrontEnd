import React, { useState } from 'react';
import { Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';

import EventFilterBar from '../components/EventFilterBar';
import EventTable from '../components/EventTable';
import EventForm from '../components/EventForm';
import EventDetail from '../components/EventDetail';
import ModalConfirmacion from '../components/ModalConfirmation';

export default function EventsManagement() {
  const { 
    eventos, loading, error, categorias, filters, 
    sortConfig, requestSort, currentPage, totalPages, setCurrentPage,
    fetchEventos, agregarEvento, actualizarEvento, deshabilitarEvento, 
    updateFilter, clearFilters 
  } = useEvents();
  
  const [view, setView] = useState('list');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensaje: '', isDanger: false, accionConfirmar: null });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const cerrarModal = () => setModal({ ...modal, isOpen: false });

  const handleNuevo = () => { setSelectedEvent(null); setView('form'); };
  const handleVisualizar = (evento) => { setSelectedEvent(evento); setView('detail'); };
  const handleEditar = (evento) => { setSelectedEvent(evento); setView('form'); };

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      setModal({
        isOpen: true,
        titulo: 'Actualizar Evento',
        mensaje: '¿Estás seguro de que deseas guardar los cambios en la información de este evento?',
        isDanger: false,
        accionConfirmar: () => {
          actualizarEvento(formData);
          cerrarModal();
          showToast('El evento fue actualizado correctamente.');
          setView('list');
        }
      });
    } else {
      agregarEvento(formData);
      showToast('¡Evento agregado con éxito!');
      setView('list');
    }
  };

  const handleDeshabilitar = (evento) => {
    if (evento.estado === 'I') {
       showToast('Este evento ya se encuentra deshabilitado.', 'error'); 
       return;
    }
    
    setModal({
      isOpen: true,
      titulo: 'Deshabilitar evento',
      mensaje: 'ATENCIÓN: El evento dejará de estar disponible para visualización o inscripción por parte de los usuarios. ¿Desea continuar?',
      isDanger: true,
      accionConfirmar: async () => {
        try {
          await deshabilitarEvento(evento.id);
          showToast('El evento fue deshabilitado correctamente.');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          cerrarModal();
        }
      }
    });
  };

  const renderToast = () => {
    if (!toast.show) return null;
    return (
      <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in z-[200] max-w-[90vw] sm:max-w-md ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
        {toast.type === 'error' ? <XCircle size={20} className="mr-2 flex-shrink-0" /> : <CheckCircle2 size={20} className="mr-2 flex-shrink-0" />}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {renderToast()}
      <ModalConfirmacion 
        isOpen={modal.isOpen} titulo={modal.titulo} mensaje={modal.mensaje} 
        isDanger={modal.isDanger} onConfirm={modal.accionConfirmar} onCancel={cerrarModal} 
      />

      {view === 'form' && <EventForm categorias={categorias} initialData={selectedEvent} onSubmit={handleFormSubmit} onCancel={() => setView('list')} />}
      
      {view === 'detail' && <EventDetail evento={selectedEvent} categorias={categorias} onVolver={() => setView('list')} />}

      {view === 'list' && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-blue-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Gestión de Eventos</h2>
            <button onClick={handleNuevo} className="bg-white text-blue-700 px-4 py-2 rounded-lg flex items-center justify-center font-medium hover:bg-gray-100 transition-colors shadow-sm w-full sm:w-auto">
              <Plus size={18} className="mr-2" /> Agregar evento
            </button>
          </div>

          <EventFilterBar filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

          {error ? (
            <div className="p-8 text-center text-red-600">
              <p className="mb-4 font-medium">{error}</p>
              <button onClick={fetchEventos} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-red-200 transition-colors">
                <RefreshCw size={18} className="mr-2" /> Reintentar
              </button>
            </div>
          ) : loading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
              Cargando eventos...
            </div>
          ) : (
            <EventTable 
              eventos={eventos} 
              categorias={categorias} 
              onVisualizar={handleVisualizar} 
              onEditar={handleEditar} 
              onToggleEstado={handleDeshabilitar} 
              sortConfig={sortConfig}
              requestSort={requestSort}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </div>
  );
}