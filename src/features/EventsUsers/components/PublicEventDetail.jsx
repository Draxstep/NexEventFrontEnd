import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Heart, Loader2, Ticket, ShieldAlert } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import PurchaseModal from './PurchaseModal';

const PublicEventDetail = ({ evento, onVolver, onInteres, isInterested, onEliminarInteres, readOnly = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const userRole = user?.publicMetadata?.role || "cliente";
  const isAdmin = userRole === "admin";

  const handleInteresClick = async () => {
    if (!evento || isProcessing || readOnly) return;

    setIsProcessing(true);

    if (isInterested) {
      await onEliminarInteres();
    }else {
      await onInteres();
    }
    setIsProcessing(false);
  };

  const rawTicketTypes =
    evento?.ticketTypes ||
    evento?.eventoTipoEntradas ||
    evento?.EventoTipoEntradas ||
    [];

  const ticketTypes = (Array.isArray(rawTicketTypes) ? rawTicketTypes : [])
    .map((item, index) => {
      const capacity = Number(item?.capacidad_total);
      const sold = Number(item?.cantidad_vendida);
      const availableFromApi = Number(item?.asientos_disponibles ?? item?.disponibles);

      const capacidad_total = Number.isFinite(capacity) ? capacity : 0;
      const cantidad_vendida = Number.isFinite(sold) ? sold : 0;
      const disponibles = Number.isFinite(availableFromApi)
        ? availableFromApi
        : Math.max(capacidad_total - cantidad_vendida, 0);

      return {
        id: Number(item?.id) || index + 1,
        tipo_entrada_id:
          Number(item?.tipo_entrada_id) ||
          Number(item?.TipoEntrada?.id) ||
          Number(item?.tipo_entrada?.id) ||
          Number(item?.id) ||
          0,
        nombre:
          item?.nombre ||
          item?.tipo_entrada?.nombre ||
          item?.TipoEntrada?.nombre ||
          `Entrada ${index + 1}`,
        precio: Number.parseFloat(item?.precio) || 0,
        capacidad_total,
        cantidad_vendida,
        disponibles,
      };
    })
    .filter((item) => item.tipo_entrada_id > 0);

  const isSoldOut =
    ticketTypes.length > 0 &&
    ticketTypes.every((entrada) => Number(entrada.disponibles) <= 0);

  const showBuyButton = !readOnly && ticketTypes.length > 0 && !isSoldOut;

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
        </div>

        {/* Columna Derecha: Descripción y CTA */}
        <div className="lg:col-span-2 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Acerca de este evento</h3>
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap flex-1 mb-8">
            {evento.descripcion || 'No hay descripción detallada disponible para este evento.'}
          </p>

          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Tipos de entrada</h4>

            {ticketTypes.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Aun no hay tipos de entrada configurados para este evento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticketTypes.map((ticketItem) => (
                  <div
                    key={`${ticketItem.tipo_entrada_id}-${ticketItem.id}`}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{ticketItem.nombre}</p>
                    <p className="text-blue-700 font-bold mt-1 flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {ticketItem.precio > 0
                        ? ticketItem.precio.toLocaleString('es-CO')
                        : 'Gratis'}
                    </p>
                    <p className={`text-xs mt-1 ${ticketItem.disponibles > 0 ? 'text-gray-500' : 'text-red-600 font-semibold'}`}>
                      {ticketItem.disponibles > 0
                        ? `${ticketItem.disponibles} disponibles`
                        : 'Agotada'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Y BOTONES */}
          {!readOnly && (
            <div className="mt-auto border-t pt-6">
              {isAdmin ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-5 rounded-xl flex items-start sm:items-center gap-3 sm:gap-4 text-yellow-800 w-full shadow-sm">
                  <ShieldAlert className="w-8 h-8 flex-shrink-0 mt-1 sm:mt-0" />
                  <div>
                    <p className="font-bold text-base sm:text-lg">Modo Administrador Activo</p>
                    <p className="text-sm opacity-90 mt-0.5">
                      Por seguridad y consistencia de datos, los administradores no pueden registrar interés ni comprar entradas en la plataforma.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <div className="mb-4 sm:mb-0 w-full sm:w-auto">
                    <p className="font-bold text-gray-800">
                      {isSoldOut ? "¡Entradas Agotadas!" : "¿Te gustaría asistir?"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isSoldOut 
                        ? "Lo sentimos, ya no quedan cupos disponibles para este evento." 
                        : "Haznos saber si te interesa este evento."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    {/* Botón de Interés */}
                    <button
                      onClick={handleInteresClick}
                      disabled={isProcessing}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 shadow-sm ${
                        isInterested  
                        ? 'bg-gray-400 text-white hover:bg-gray-500 active:scale-95'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
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

                    {/* Botón de Compra */}
                    {showBuyButton && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 shadow-sm bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      >
                        <Ticket size={18} className="mr-2" /> Comprar Entradas
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={{ ...evento, ticketTypes }}
        currentUser={user}
      />
    </div>
  );
};

export default PublicEventDetail;