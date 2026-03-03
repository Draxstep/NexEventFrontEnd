import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Tag, DollarSign, Heart, Loader2 } from 'lucide-react';

const PublicEventDetail = ({ evento, onVolver, onInteres, isInterested, onEliminarInteres }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInteresClick = async () => {
    if (!evento || isProcessing) return;

    setIsProcessing(true);

    if (isInterested) {
      await onEliminarInteres();
    }else {
      await onInteres();
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full animate-fade-in pb-8">
      {/* Cabecera visual con Imagen */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-200">
        {evento.imagenUrl ? (
          <img src={evento.imagenUrl} alt={evento.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">Sin imagen de portada</div>
        )}
        {/* Overlay degradado y botón volver flotante */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <button onClick={onVolver} className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center transition-colors font-medium">
          <ArrowLeft size={18} className="mr-2" /> Volver
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 shadow-md">
            {evento.categoria}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-balance leading-tight">{evento.nombre}</h2>
        </div>
      </div>

      <div className="p-6 md:p-8 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Detalles (RN02) */}
        <div className="lg:col-span-1 bg-gray-50 rounded-xl p-6 space-y-5 h-fit border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Datos del Evento</h3>
          <div className="flex items-start"><Calendar className="text-blue-600 mr-3 mt-0.5" size={20} /><div><p className="text-xs text-gray-500 font-medium uppercase">Fecha</p><p className="font-semibold text-gray-800">{evento.fecha}</p></div></div>
          <div className="flex items-start"><Clock className="text-blue-600 mr-3 mt-0.5" size={20} /><div><p className="text-xs text-gray-500 font-medium uppercase">Hora</p><p className="font-semibold text-gray-800">{evento.hora}</p></div></div>
          <div className="flex items-start"><MapPin className="text-blue-600 mr-3 mt-0.5" size={20} /><div><p className="text-xs text-gray-500 font-medium uppercase">Lugar</p><p className="font-semibold text-gray-800">{evento.lugar}</p><p className="text-sm text-gray-600">{evento.ciudad}, {evento.departamento}</p></div></div>
          <div className="flex items-start"><DollarSign className="text-blue-600 mr-3 mt-0.5" size={20} /><div><p className="text-xs text-gray-500 font-medium uppercase">Valor entrada</p><p className="font-bold text-gray-900 text-lg">{evento.valor > 0 ? `$${evento.valor.toLocaleString('es-CO')}` : 'Entrada Gratuita'}</p></div></div>
        </div>

        {/* Columna Derecha: Descripción y CTA */}
        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Acerca de este evento</h3>
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap flex-1 mb-8">
            {evento.descripcion || 'No hay descripción detallada disponible para este evento.'}
          </p>

          {/* RN03: Botón de Interés */}
          <div className="mt-auto border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold text-gray-800">¿Te gustaría asistir?</p>
              <p className="text-sm text-gray-500">Haznos saber si te interesa este evento.</p>
            </div>
            <button
              onClick={handleInteresClick}
              disabled={isProcessing}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-300 shadow-sm ${
                isInterested
                ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                }`}
            >
              {isProcessing ? (
                <><Loader2 size={20} className="animate-spin mr-2" /> Procesando...</>
              ) : isInterested ? (
                <><Heart size={20} className="mr-2 fill-current" /> Quitar interés</>
              ) : (
                <><Heart size={20} className="mr-2" /> ¡Estoy interesado!</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventDetail;