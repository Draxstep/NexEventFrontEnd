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

            // Transformando las llaves al inglés
            const adaptedPurchases = detailPurchases.map(purchase => ({
                purchaseId: purchase.id.toString(),
                generalQr: purchase.codigo_qr_general,
                purchaseDate: new Date(purchase.fecha_compra).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'short', day: 'numeric'
                }),
                event: {
                    name: purchase.Evento?.nombre || 'Unnamed event',
                    date: purchase.Evento?.fecha || 'TBD',
                    time: purchase.Evento?.hora || '',
                    location: purchase.Evento?.lugar || 'TBD'
                },
                tickets: (purchase.Boletos || []).map(ticket => ({
                    id: ticket.id.toString(),
                    type: ticket.tipo_entrada || 'General',
                    uniqueCode: ticket.codigo_qr_individual
                }))
            }));

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