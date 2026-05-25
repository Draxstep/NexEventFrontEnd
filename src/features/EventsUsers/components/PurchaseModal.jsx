import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Ticket, Plus, Minus, Loader2, CreditCard, ArrowLeft } from "lucide-react";
import { usePurchase } from "../hooks/usePurchase";
import { usePaymentStatus } from "../hooks/usePaymentStatus";
import PaymentStatusPanel from "./PaymentStatusPanel";
import { simulatePayment } from "../services/eventsUsers";

const PurchaseModal = ({ isOpen, onClose, event, currentUser }) => {
  // VOLVEMOS a extraer solo executePurchase (eliminé processPurchaseWithValidation)
  const { loading, error, isSuccess, executePurchase, resetPurchase } = usePurchase();

  const [ticketQuantities, setTicketQuantities] = useState({});
  const [validationError, setValidationError] = useState(null);

  const {
    status: paymentStatus,
    history: paymentHistory,
    isConnected: isStatusConnected,
    connect: connectStatus,
    disconnect: disconnectStatus,
    reset: resetStatus,
  } = usePaymentStatus();
  
  // Estados para manejar la vista de pago y los datos de la tarjeta
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardBrand: 'visa',
    cardHolder: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    if (isOpen) {
      resetPurchase();
      setTicketQuantities({});
      setValidationError(null);
      setShowPaymentForm(false); // Reiniciar vista
      setCardData({ cardNumber: '', cardBrand: 'visa', cardHolder: '', expiry: '', cvc: '' }); // Reiniciar formulario
      resetStatus();
    }
  }, [isOpen, resetPurchase, resetStatus]);

  useEffect(() => {
    if (isOpen && showPaymentForm) {
      connectStatus();
      return undefined;
    }

    disconnectStatus();
    resetStatus();
    return undefined;
  }, [isOpen, showPaymentForm, connectStatus, disconnectStatus, resetStatus]);

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

  // FUNCIÓN PARA ACTUALIZAR CANTIDAD INDIVIDUAL
  const updateQuantity = (ticketId, delta, maxAvailable) => {
    setTicketQuantities((prev) => {
      const currentQty = prev[ticketId] || 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, maxAvailable));

      const newState = { ...prev, [ticketId]: newQty };
      if (newQty === 0) {
        delete newState[ticketId];
      }
      return newState;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

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

    // En lugar de abrir el modal de confirmación, pasamos al formulario de pago
    setShowPaymentForm(true);
  };

  const executeFinalPurchase = async (e) => {
    e.preventDefault();

    const detallesCompra = Object.entries(ticketQuantities).map(([ticketIdStr, cantidad]) => {
      const ticket = ticketTypes.find(t => String(t.id) === ticketIdStr);
      return {
        tipo_entrada_id: Number(ticket.tipo_entrada_id),
        cantidad: Number(cantidad),
      };
    });

    // UNIFICAMOS todo en un solo payload como acordamos
    const payloadCompleto = {
      usuario_id: currentUser?.id,
      evento_id: event.id,
      detallesCompra,
      pago: {
        franquicia: cardData.cardBrand,
        numero_tarjeta: cardData.cardNumber,
        cvc: cardData.cvc,
        fecha_expiracion: cardData.expiry
      }
    };

    simulatePayment().catch((err) => {
      console.warn("No se pudo iniciar la simulacion de pago:", err);
    });

    // Llamamos a la función original del hook
    await executePurchase(payloadCompleto);
  };

  const handleCloseAfterSuccess = () => {
    onClose();
    window.location.reload();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">

        {/* HEADER */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            {showPaymentForm && !isSuccess ? (
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="mr-2 text-gray-500 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <Ticket className="w-5 h-5 mr-2 text-blue-600" />
            )}
            {showPaymentForm && !isSuccess ? "Datos de Pago" : "Comprar Entradas"}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h3>
              <p className="text-gray-600 mb-6">
                Tus entradas para <strong>{event.nombre}</strong> han sido aseguradas.
              </p>
              <button
                onClick={handleCloseAfterSuccess}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          ) : showPaymentForm ? (
            /* FORMULARIO DE PAGO (PASO 2) */
            <form onSubmit={executeFinalPurchase} className="space-y-4">
              <PaymentStatusPanel
                status={paymentStatus}
                history={paymentHistory}
                isConnected={isStatusConnected}
              />
              {/* MENSAJE DE ERROR DEL API */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-sm text-red-600 mb-4">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <span className="text-sm text-blue-800 font-medium">Total a pagar:</span>
                <span className="text-lg font-bold text-blue-900">${totalPrice.toLocaleString("es-CO")}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Franquicia</label>
                <select
                  name="cardBrand"
                  value={cardData.cardBrand}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="nu">Nu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    maxLength="19"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titular de la Tarjeta</label>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Nombre en la tarjeta"
                  value={cardData.cardHolder}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiración</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={handleInputChange}
                    maxLength="5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="password"
                    name="cvc"
                    placeholder="123"
                    value={cardData.cvc}
                    onChange={handleInputChange}
                    maxLength="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando Pago...
                    </>
                  ) : (
                    `Pagar $${totalPrice.toLocaleString("es-CO")}`
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* SELECCIÓN DE ENTRADAS (PASO 1) */
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">{event.nombre}</h3>
                <p className="text-sm text-gray-500">{event.fecha} • {event.lugar}</p>
              </div>

              {(error || validationError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-sm text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{validationError || error}</span>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona tus entradas</label>
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
                              {ticket.nombre || "Entrada General"}
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
                            <span className="text-xs text-red-500 font-bold uppercase">Agotado</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-700">Cantidad</span>
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
                    <p className="text-sm text-gray-500 italic">No hay entradas configuradas para este evento.</p>
                  )}
                </div>
              </div>

              {/* TOTAL Y BOTÓN PARA IR A PAGAR */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 bg-white">
                <div>
                  <span className="block text-sm text-gray-500">Total</span>
                  <span className="block text-2xl font-bold text-gray-900">
                    ${totalPrice.toLocaleString("es-CO")}
                  </span>
                </div>
                <button
                  onClick={handleInitiatePurchase}
                  disabled={totalSelectedTickets === 0 || loading || ticketTypes.length === 0}
                  className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                >
                  Continuar al Pago
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