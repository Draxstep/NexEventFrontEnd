import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { usePurchase } from '../hooks/usePurchase'; // Asegúrate de ajustar la ruta

export default function PaymentCheckout({ purchaseDetails, onPaymentSuccess }) {
  const { executePurchase, loading } = usePurchase();
  
  // Estado local para los datos de la tarjeta
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardBrand: 'visa', // Valor por defecto
    cardHolder: '',
    expiry: '',
    cvc: ''
  });

  // Estado para manejar la respuesta visual del servicio
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: '' });

    // 1. Construir el objeto de compra que espera tu API
    // (Ajusta la estructura de 'pago' según lo que espere tu backend)
    const payload = {
      ...purchaseDetails, // Aquí deberían venir el usuario_id, evento_id, boletos, etc.
      pago: {
        tarjeta: cardData.cardNumber,
        franquicia: cardData.cardBrand,
        titular: cardData.cardHolder,
        expiracion: cardData.expiry,
        cvc: cardData.cvc
      }
    };

    // 2. Ejecutar la compra usando tu hook
    try {
      const response = await executePurchase(payload);
      
      // Si el servicio responde correctamente
      setFeedback({ 
        type: 'success', 
        message: response.mensaje || `¡Pago aprobado exitosamente! Orden #${response.id}` 
      });
      
      // Llamar a una función externa si necesitas redirigir o cerrar un modal
      if (onPaymentSuccess) {
        setTimeout(() => onPaymentSuccess(response), 2000);
      }
      
    } catch (error) {
      // Si el servicio devuelve un error (fondos insuficientes, tarjeta rechazada, etc.)
      setFeedback({ 
        type: 'error', 
        message: error.message || 'El pago fue rechazado. Por favor, verifica tus datos.' 
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <CreditCard className="text-blue-600 mr-3" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Pago Seguro</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Selección de Franquicia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Franquicia</label>
          <select
            name="cardBrand"
            value={cardData.cardBrand}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="nu">Nu</option>
          </select>
        </div>

        {/* Número de Tarjeta */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Número de Tarjeta</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="0000 0000 0000 0000"
            value={cardData.cardNumber}
            onChange={handleInputChange}
            maxLength="19"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Nombre, Fecha y CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Titular de la Tarjeta</label>
            <input
              type="text"
              name="cardHolder"
              placeholder="Nombre como aparece en la tarjeta"
              value={cardData.cardHolder}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Expiración</label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">CVC</label>
            <input
              type="password"
              name="cvc"
              placeholder="123"
              value={cardData.cvc}
              onChange={handleInputChange}
              maxLength="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Botón de Pago */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Procesando...
            </>
          ) : (
            'Confirmar Pago'
          )}
        </button>
      </form>

      {/* Mostrar la respuesta del servicio */}
      {feedback.type && (
        <div className={`mt-6 p-4 rounded-xl flex items-start ${
          feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={20} />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}
    </div>
  );
}