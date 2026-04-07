import { useState, useCallback } from "react";
import { purchaseTickets, getPurchaseHistory, getPurchaseDetails } from "../services/eventsUsers";

export const usePurchase = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [purchases, setPurchases] = useState([]);
    const [loadingPurchases, setLoadingPurchases] = useState(false);
    const [errorPurchases, setErrorPurchases] = useState(null);

    const executePurchase = useCallback(async (purchaseData) => {
        setLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await purchaseTickets(purchaseData);
            setIsSuccess(true);
            return response;
        } catch (err) {
            setError(err.message || "Error processing purchase.");
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

    const fetchPurchases = useCallback(async (userId) => {
        if (!userId) return;

        setLoadingPurchases(true);
        setErrorPurchases(null);

        try {
            const historyData = await getPurchaseHistory(userId);

            const detailPurchasesPromises = historyData.map(async (purchaseBase) => {
                try {
                    return await getPurchaseDetails(purchaseBase.id);
                } catch (err) {
                    console.error(`Error fetching purchase details ${purchaseBase.id}:`, err);
                    return null;
                }
            });

            const detailPurchases = (await Promise.all(detailPurchasesPromises)).filter(Boolean);

            const adaptedPurchases = detailPurchases.map(purchase => {
                // Obtenemos los datos del evento a partir del primer boleto
                const firstBoleto = purchase.Boletos && purchase.Boletos[0];
                const eventoData = firstBoleto?.EventoTipoEntrada?.Evento || {};

                return {
                    purchaseId: purchase.id.toString(),
                    generalQr: purchase.codigo_qr_general,
                    purchaseDate: new Date(purchase.fecha_compra).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    }),
                    event: {
                        // Mapeamos desde el evento extraído
                        name: eventoData.nombre || 'Unnamed event',
                        date: eventoData.fecha || 'TBD',
                        time: eventoData.hora || '',
                        location: eventoData.lugar || 'TBD'
                    },
                    tickets: (purchase.Boletos || []).map(ticket => ({
                        id: ticket.id.toString(),
                        // Extraemos el tipo de entrada correcto (ej: "Oro", "VIP")
                        type: ticket.EventoTipoEntrada?.TipoEntrada?.nombre || 'General',
                        uniqueCode: ticket.codigo_qr_individual
                    }))
                };
            });

            setPurchases(adaptedPurchases);
        } catch (err) {
            setErrorPurchases(err.message || "Error loading purchase history.");
        } finally {
            setLoadingPurchases(false);
        }
    }, []);

    return {
        loading,
        error,
        isSuccess,
        executePurchase,
        resetPurchase,
        purchases,
        loadingPurchases,
        errorPurchases,
        fetchPurchases
    };
};