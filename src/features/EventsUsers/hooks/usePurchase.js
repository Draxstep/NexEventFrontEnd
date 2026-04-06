import { useState, useCallback } from "react";
import { purchaseTickets } from "../services/eventsUsers";

export const usePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const executePurchase = useCallback(async (purchaseData) => {
    setLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await purchaseTickets(purchaseData);
      setIsSuccess(true);
      return response; 
    } catch (err) {
      setError(err.message || "Error al procesar la compra.");
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPurchase = useCallback(() => {
    setLoading(false);
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    loading,
    error,
    isSuccess,
    executePurchase,
    resetPurchase,
  };
};