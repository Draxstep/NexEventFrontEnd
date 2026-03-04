import React, { useState } from "react";
import { Plus, RefreshCw, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";

import EventFilterBar from "../components/EventFilterBar";
import EventTable from "../components/EventTable";
import EventForm from "../components/EventForm";
import EventDetail from "../components/EventDetail";
import ModalConfirmation from "../components/ModalConfirmation";

export default function EventsManagement() {
  const navigate = useNavigate();
  const {
    events,
    categories,
    cities,
    departments,
    loading,
    error,
    filters,
    sortConfig,
    requestSort,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchEvents,
    addEvent,
    editEvent,
    disableEvent,
    updateFilter,
    clearFilters,
    loadCitiesByDepartment,
    fetchEventById,
  } = useEvents();

  const [view, setView] = useState("list");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: false,
    onConfirm: null,
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000
    );
  };

  const closeModal = () =>
    setModal((prev) => ({ ...prev, isOpen: false }));

  const handleNew = () => {
    setSelectedEvent(null);
    setView("form");
  };

  const handleView = async (event) => {
    const fullEvent = await fetchEventById(event.id);
    setSelectedEvent(fullEvent);
    setView("detail");
  };

  const handleEdit = async (event) => {
    const fullEvent = await fetchEventById(event.id);
    setSelectedEvent(fullEvent);
    setView("form");
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.id) {
        setModal({
          isOpen: true,
          title: "Update Event",
          message:
            "Are you sure you want to save the changes to this event?",
          isDanger: false,
          onConfirm: async () => {
            try {
              await editEvent(formData);
              closeModal();
              showToast("Event updated successfully.");
              setView("list");
            } catch (err) {
              closeModal();
              showToast(err.message || "Failed to update event", "error");
            }
          },
        });
      } else {
        await addEvent(formData);
        showToast("Event created successfully.");
        setView("list");
      }
    } catch (err) {
      showToast(err.message || "Failed to create event", "error");
    }
  };

  const handleDisable = (event) => {
    if (event.estado === false) {
      showToast("This event is already disabled.", "error");
      return;
    }

    setModal({
      isOpen: true,
      title: "Disable Event",
      message:
        "WARNING: The event will no longer be visible to users. Do you want to continue?",
      isDanger: true,
      onConfirm: async () => {
        try {
          await disableEvent(event.id);
          showToast("Event disabled successfully.");
        } catch (err) {
          showToast(err.message, "error");
        } finally {
          closeModal();
        }
      },
    });
  };

  const renderToast = () => {
    if (!toast.show) return null;

    return (
      <div
        className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in z-[200] max-w-[90vw] sm:max-w-md ${toast.type === "error"
            ? "bg-red-600"
            : "bg-green-600"
          }`}
      >
        {toast.type === "error" ? (
          <XCircle size={20} className="mr-2" />
        ) : (
          <CheckCircle2 size={20} className="mr-2" />
        )}
        <span className="text-sm font-medium">
          {toast.message}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {renderToast()}

      <ModalConfirmation
        isOpen={modal.isOpen}
        titulo={modal.title}
        mensaje={modal.message}
        isDanger={modal.isDanger}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />

      {view === "form" && (
        <EventForm
          categories={categories}
          cities={cities}
          departments={departments}
          loadCitiesByDepartment={loadCitiesByDepartment}
          initialData={selectedEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => setView("list")}
        />
      )}

      {view === "detail" && (
        <EventDetail
          event={selectedEvent}
          onBack={() => setView("list")}
        />
      )}

      {view === "list" && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-fade-in">
          <div className="bg-blue-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-white">
              Events Management
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/reportes")}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center justify-center font-medium hover:bg-amber-600 transition-colors shadow-sm w-full sm:w-auto"
              >
                <BarChart3 size={18} className="mr-2" />
                Reportes
              </button>
              <button
                onClick={handleNew}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg flex items-center justify-center font-medium hover:bg-gray-100 transition-colors shadow-sm w-full sm:w-auto"
              >
                <Plus size={18} className="mr-2" />
                Add Event
              </button>
            </div>
          </div>

          <EventFilterBar
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
          />

          {error ? (
            <div className="p-8 text-center text-red-600">
              <p className="mb-4 font-medium">{error}</p>

              <button
                onClick={fetchEvents}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center mx-auto hover:bg-red-200 transition-colors"
              >
                <RefreshCw size={18} className="mr-2" />
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
              Loading events...
            </div>
          ) : (
            <EventTable
              events={events}
              categories={categories}
              onView={handleView}
              onEdit={handleEdit}
              onToggleStatus={handleDisable}
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