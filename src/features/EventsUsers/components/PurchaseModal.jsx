import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Ticket, Plus, Minus, Loader2 } from "lucide-react";
import { usePurchase } from "../hooks/usePurchase"; 

const PurchaseModal = ({ isOpen, onClose, event, currentUser }) => {
  const { loading, error, isSuccess, executePurchase, resetPurchase } = usePurchase();

  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      resetPurchase();
      setSelectedTicketId("");
      setQuantity(1);
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
  
  const selectedTicket = ticketTypes.find((t) => String(t.id) === selectedTicketId);
  const maxQuantity = selectedTicket ? Math.max(Number(selectedTicket.disponibles) || 0, 0) : 0;
  const totalPrice = selectedTicket ? selectedTicket.precio * quantity : 0;

  useEffect(() => {
    if (selectedTicket && maxQuantity > 0 && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [selectedTicket, maxQuantity, quantity]);

  if (!isOpen || !event) return null;

  const handlePurchase = async () => {
    setValidationError(null);

    if (!currentUser?.id) {
      setValidationError("Debes iniciar sesión para completar la compra.");
      return;
    }

    if (!selectedTicket || quantity < 1) {
      setValidationError("Selecciona un tipo de entrada válido.");
      return;
    }

    if (maxQuantity <= 0) {
      setValidationError("Este tipo de entrada está agotado.");
      return;
    }

    if (quantity > maxQuantity) {
      setValidationError(`Solo hay ${maxQuantity} entradas disponibles para este tipo.`);
      return;
    }

    const payload = {
      usuario_id: currentUser?.id, 
      evento_id: event.id,
      detallesCompra: [
        {
          tipo_entrada_id: Number(selectedTicket.tipo_entrada_id),
          cantidad: Number(quantity),
        }
      ]
    };

    await executePurchase(payload);
  };

  const handleCloseAfterSuccess = () => {
    onClose();
    window.location.reload();
  };

  return (
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
        <div className="p-6">
          
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
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Ticket Type</label>
                <div className="space-y-2">
                  {ticketTypes.map((ticket) => {
                    const isSoldOut = Number(ticket.disponibles) <= 0;
                    return (
                      <label 
                        key={ticket.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedTicketId === String(ticket.id) 
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" 
                            : "border-gray-200 hover:border-gray-300"
                        } ${isSoldOut ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="ticketType"
                            value={ticket.id}
                            disabled={isSoldOut}
                            checked={selectedTicketId === String(ticket.id)}
                            onChange={(e) => setSelectedTicketId(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                          />
                          <span className="ml-3 font-medium text-gray-900">
                            {ticket.nombre || "General Entry"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-gray-900">
                            ${ticket.precio.toLocaleString("es-CO")}
                          </span>
                          {!isSoldOut && (
                            <span className="text-xs text-gray-500">{ticket.disponibles} disp.</span>
                          )}
                          {isSoldOut && <span className="text-xs text-red-500 font-semibold uppercase">Sold Out</span>}
                        </div>
                      </label>
                    );
                  })}
                  {ticketTypes.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No tickets configured for this event.</p>
                  )}
                </div>
              </div>

              {/* CONTROLES DE CANTIDAD */}
              <div className="mb-6 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!selectedTicketId || loading}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxQuantity || 1, quantity + 1))}
                    disabled={!selectedTicketId || loading || maxQuantity <= 0 || quantity >= maxQuantity}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {selectedTicket && (
                <p className="text-xs text-gray-500 -mt-4 mb-6 text-right">
                  Máximo disponible: {maxQuantity}
                </p>
              )}

              {/* TOTAL Y BOTÓN DE PAGO */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-sm text-gray-500">Total Price</span>
                  <span className="block text-2xl font-bold text-gray-900">
                    ${totalPrice.toLocaleString("es-CO")}
                  </span>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={!selectedTicketId || loading || ticketTypes.length === 0}
                  className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
  );
};

export default PurchaseModal;