import React from "react";
import {
  Calendar,
  MapPin,
  Tag,
  Eye,
  Edit2,
  Power,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EventTable = ({
  events,
  onView,
  onEdit,
  onToggleStatus,
  sortConfig,
  requestSort,
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800";
      case "Completado":
        return "bg-blue-100 text-blue-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isActiveStatus = (status) => status === "Activo";

  if (!events || events.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <p className="text-lg font-medium">
          No events registered yet
        </p>
      </div>
    );
  }

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName)
      return (
        <ChevronDown
          size={14}
          className="text-gray-300 ml-1 opacity-0 group-hover:opacity-50"
        />
      );

    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="text-blue-600 ml-1" />
    ) : (
      <ChevronDown size={14} className="text-blue-600 ml-1" />
    );
  };

  const SortableHeader = ({ label, columnKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {label} {getSortIcon(columnKey)}
      </div>
    </th>
  );

  // Función para renderizar el badge de entradas
  const renderTicketStatus = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-blue-100 text-blue-800 border border-blue-200">
            Available
          </span>
        );
      case 'SOLD_OUT':
        return (
          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800 border border-red-200">
            Sold Out
          </span>
        );
      case 'UNCONFIGURED':
      default:
        return (
          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-500 border border-gray-200">
            No Tickets
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[900px] divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Name" columnKey="nombre" />
              <SortableHeader label="Date / Time" columnKey="fecha" />
              <SortableHeader label="Location" columnKey="ciudad" />
              <SortableHeader label="Category" columnKey="categoria" />
              <SortableHeader label="Status" columnKey="estado" />
              <SortableHeader label="Tickets" columnKey="estado_entradas" />
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">

                {/* NAME */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {item.nombre}
                  </div>
                </td>

                {/* DATE */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    {item.fecha}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.hora}
                  </div>
                </td>

                {/* LOCATION */}
                <td className="px-4 py-4 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {item.Ciudad?.nombre},{" "}
                      {item.Ciudad?.Departamento?.nombre}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">
                      {item.lugar}
                    </span>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full w-fit">
                    <Tag size={12} className="mr-1" />
                    {item.Categoria?.nombre}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyles(
                      item.estado
                    )}`}
                  >
                    {item.estado || "Sin estado"}
                  </span>
                </td>

                {/* TICKETS */}
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {renderTicketStatus(item.estado_entradas)}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                  <button
                    onClick={() => onView(item)}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() => onToggleStatus(item)}
                    className={
                      isActiveStatus(item.estado)
                        ? "text-red-500 hover:text-red-700"
                        : "text-green-500 hover:text-green-700"
                    }
                  >
                    {isActiveStatus(item.estado) ? (
                      <Power size={18} />
                    ) : (
                      <RefreshCw size={18} />
                    )}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-2 border border-gray-300 bg-white rounded-md disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-700">
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-2 border border-gray-300 bg-white rounded-md disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTable;