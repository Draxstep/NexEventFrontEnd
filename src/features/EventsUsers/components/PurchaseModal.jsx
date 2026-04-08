import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Ticket, Plus, Minus, Loader2 } from "lucide-react";
import { usePurchase } from "../hooks/usePurchase";
import ModalConfirmacion from "../../EventsAdmin/components/ModalConfirmation";

const PurchaseModal = ({ isOpen, onClose, event, currentUser }) => {
  const { loading, error, isSuccess, executePurchase, resetPurchase } = usePurchase();

  const [ticketQuantities, setTicketQuantities] = useState({});
  const [validationError, setValidationError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetPurchase();
      setTicketQuantities({});
      setValidationError(null);
    }
  }, [isOpen, resetPurchase]);

  const rawTicketTypes =
    event?.ticketTypes ||
    event?.eventoTipoEntradas ||
    event?.EventoTipoEntradas ||
    [];

  const ticketTypes = (Array.isArray(rawTicketTypes) ? rawTicketTypes : [])
    .map((ticket, index) => {
      const capacity = Number(ticket?.capacidad_total);
      const sold = Number(ticket?.cantidad_vendida);
      const availableFromApi = Number(ticket?.asientos_disponibles ?? ticket?.disponibles);

      const capacidad_total = Number.isFinite(capacity) ? capacity : 0;
      const cantidad_vendida = Number.isFinite(sold) ? sold : 0;
      const disponibles = Number.isFinite(availableFromApi)
        ? availableFromApi
        : Math.max(capacidad_total - cantidad_vendida, 0);

      return {
        id: Number(ticket?.id) || index + 1,
        tipo_entrada_id:
          Number(ticket?.tipo_entrada_id) ||
          Number(ticket?.TipoEntrada?.id) ||
          Number(ticket?.tipo_entrada?.id) ||
          Number(ticket?.id) ||
          0,
        nombre:
          ticket?.nombre ||
          ticket?.tipo_entrada?.nombre ||
          ticket?.TipoEntrada?.nombre ||
          `Entrada ${index + 1}`,
        precio: Number.parseFloat(ticket?.precio) || 0,
        disponibles,
      };
    })
    .filter((ticket) => ticket.tipo_entrada_id > 0);

  const totalPrice = ticketTypes.reduce((sum, ticket) => {
    const qty = ticketQuantities[ticket.id] || 0;
    return sum + (ticket.precio * qty);
  }, 0);

  const totalSelectedTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);

  if (!isOpen || !event) return null;

  // 3. FUNCIÓN PARA ACTUALIZAR CANTIDAD INDIVIDUAL
  const updateQuantity = (ticketId, delta, maxAvailable) => {
    setTicketQuantities((prev) => {
      const currentQty = prev[ticketId] || 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, maxAvailable));

      const newState = { ...prev, [ticketId]: newQty };
      // Limpiar keys con valor 0 para no enviar basura
      if (newQty === 0) {
        delete newState[ticketId];
      }
      return newState;
    });
  };

  if (!isOpen || !event) return null;

  const handleInitiatePurchase = () => {
    setValidationError(null);

    if (!currentUser?.id) {
      setValidationError("Debes iniciar sesión para completar la compra.");
      return;
    }

    if (totalSelectedTickets === 0) {
      setValidationError("Selecciona al menos una entrada para continuar.");
      return;
    }

    setShowConfirmModal(true);
  };

  const executeFinalPurchase = async () => {
    setShowConfirmModal(false);

    const detallesCompra = Object.entries(ticketQuantities).map(([ticketIdStr, cantidad]) => {
      const ticket = ticketTypes.find(t => String(t.id) === ticketIdStr);
      return {
        tipo_entrada_id: Number(ticket.tipo_entrada_id),
        cantidad: Number(cantidad),
      };
    });

    const payload = {
      usuario_id: currentUser?.id,
      evento_id: event.id,
      detallesCompra
    };

    await executePurchase(payload);
  };

  const handleCloseAfterSuccess = () => {
    onClose();
    window.location.reload();
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">

        {/* HEADER */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Ticket className="w-5 h-5 mr-2 text-blue-600" />
            Buy Tickets
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">

          {/* PANTALLA DE ÉXITO */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Purchase Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your tickets for <strong>{event.nombre}</strong> have been secured.
              </p>
              <button
                onClick={handleCloseAfterSuccess}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* FORMULARIO DE COMPRA */
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">{event.nombre}</h3>
                <p className="text-sm text-gray-500">{event.fecha} • {event.lugar}</p>
              </div>

              {/* MENSAJE DE ERROR */}
              {(error || validationError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-sm text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{validationError || error}</span>
                </div>
              )}

              {/* SELECCIÓN DE ENTRADA */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Tickets</label>
                <div className="space-y-3">
                  {ticketTypes.map((ticket) => {
                    const isSoldOut = Number(ticket.disponibles) <= 0;
                    const currentQty = ticketQuantities[ticket.id] || 0;
                    const isMaxReached = currentQty >= ticket.disponibles;

                    return (
                      <div
                        key={ticket.id}
                        className={`flex flex-col p-4 border rounded-lg transition-all ${currentQty > 0
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200"
                          } ${isSoldOut ? "opacity-60 bg-gray-50" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {ticket.nombre || "General Entry"}
                            </span>
                            <span className="text-sm text-gray-500">
                              ${ticket.precio.toLocaleString("es-CO")}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          {!isSoldOut ? (
                            <span className="text-xs text-gray-500 font-medium">
                              {ticket.disponibles} disp.
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 font-bold uppercase">Sold Out</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Quantity</span>
                          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(ticket.id, -1, ticket.disponibles)}
                              disabled={currentQty === 0 || loading}
                              className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-900">
                              {currentQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(ticket.id, 1, ticket.disponibles)}
                              disabled={isSoldOut || isMaxReached || loading}
                              className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {ticketTypes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No tickets configured for this event.</p>
                  )}
                </div>
              </div>

              {/* TOTAL Y BOTÓN DE PAGO */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 bg-white">
                <div>
                  <span className="block text-sm text-gray-500">Total Price</span>
                  <span className="block text-2xl font-bold text-gray-900">
                    ${totalPrice.toLocaleString("es-CO")}
                  </span>
                </div>
                <button
                  onClick={handleInitiatePurchase}
                  disabled={totalSelectedTickets === 0 || loading || ticketTypes.length === 0}
                  className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>

    {/* RENDERIZADO DEL MODAL DE CONFIRMACIÓN */}
    <ModalConfirmacion
      isOpen={showConfirmModal}
      titulo="Confirmar Compra"
      mensaje={`¿Estás seguro que deseas comprar ${totalSelectedTickets} entrada(s) por un total de $${totalPrice.toLocaleString("es-CO")}?`}
      onConfirm={executeFinalPurchase}
      onCancel={() => setShowConfirmModal(false)}
      isDanger={false}
    />
    </>
  );
};

export default PurchaseModal;