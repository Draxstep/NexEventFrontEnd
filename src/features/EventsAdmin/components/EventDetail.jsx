import React from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Clock,
  DollarSign,
  AlignLeft,
  Image as ImageIcon,
} from "lucide-react";

const EventDetail = ({ event, onBack }) => {
  if (!event) return null;

  const statusLabel = event.estado ? "Active" : "Inactive";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full overflow-hidden animate-fade-in">

      {/* HEADER */}
      <div className="bg-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white truncate pr-4">
          Event Detail
        </h2>

        <button
          onClick={onBack}
          className="text-white hover:bg-blue-800 p-2 rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
      </div>

      <div className="p-6">

        {/* TITLE + STATUS */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="text-2xl font-extrabold text-gray-900">
            {event.nombre}
          </h3>

          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              event.estado
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            <div className="flex items-start">
              <Calendar className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{event.fecha}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{event.hora}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {event.lugar}
                </p>
                <p className="text-sm text-gray-600">
                  {event.Ciudad?.nombre},{" "}
                  {event.Ciudad?.Departamento?.nombre}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Tag className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">
                  {event.categoria?.nombre || event.Categoria?.nombre || event.Categorium?.nombre || "No category"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <DollarSign className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">
                  {event.valor > 0
                    ? `$${event.valor}`
                    : "Free"}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            <div className="flex items-start">
              <AlignLeft className="text-gray-400 mr-3 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium text-gray-700 whitespace-pre-wrap">
                  {event.descripcion || "No description provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <ImageIcon className="text-gray-400 mr-3 mt-1 shrink-0" size={20} />
              <div className="w-full">
                <p className="text-sm text-gray-500 mb-2">
                  Event Image
                </p>

                {event.imagen_url ? (
                  <div className="w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={event.imagen_url}
                      alt={`Image for ${event.nombre}`}
                      className="w-full h-auto object-cover max-h-64"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-sm h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;