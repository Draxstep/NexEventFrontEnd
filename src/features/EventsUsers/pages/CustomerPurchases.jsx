import React, { useEffect, useRef } from 'react';
import { Ticket, ArrowRight, Receipt, AlertCircle, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import TicketReceipt from '../components/TicketReceipt';
import { useUser } from '@clerk/clerk-react';
import { usePurchase } from '../hooks/usePurchase'; 
import { useReactToPrint } from 'react-to-print';

export default function CustomerPurchases() {
    const { user } = useUser();
    const { purchases, loadingPurchases, errorPurchases, fetchPurchases } = usePurchase();
    
    const allTicketsRef = useRef(null);

    const handlePrintAll = useReactToPrint({
        contentRef: allTicketsRef,
        documentTitle: `Todas_Mis_Entradas_NexEvent`,
    });
    
    useEffect(() => {
        if (user?.id) {
            fetchPurchases(user.id);
        }
    }, [user?.id, fetchPurchases]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            
            {/* CABECERA PRINCIPAL */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center">
                        <Ticket className="mr-3 text-blue-600" size={36} />
                        Mis Compras
                    </h1>
                    <p className="text-gray-500 mt-2">Aquí encontrarás tus recibos y entradas individuales.</p>
                </div>

                {/* BOTÓN DE IMPRIMIR TODAS */}
                {purchases.length > 0 && (
                    <button 
                        onClick={handlePrintAll}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <Printer size={20} />
                        <span>Imprimir Todas</span>
                    </button>
                )}
            </div>

            {/* Manejo de Estados: Cargando, Error o Vacío/Lleno */}
            {loadingPurchases ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : errorPurchases ? (
                <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center text-red-700 mt-10">
                    <AlertCircle size={40} className="mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-bold">{errorPurchases}</p>
                </div>
            ) : purchases.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center mt-10">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Ticket className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes entradas</h3>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Parece que todavía no has comprado entradas para ningún evento. ¡Descubre lo que está pasando cerca de ti!
                    </p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center">
                        Explorar eventos <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            ) : (
                <div ref={allTicketsRef} className="space-y-12 print:bg-white print:p-4">
                    
                    {purchases.map((purchase) => (
                        <div key={purchase.purchaseId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:mb-8">

                            {/* CABECERA DE LA ORDEN DE COMPRA */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4 print:border-gray-300">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center text-gray-800">
                                        <Receipt className="mr-2 text-gray-500" size={24} />
                                        Orden: #{purchase.purchaseId}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Comprado el {purchase.purchaseDate}</p>
                                </div>

                                {/* QR GENERAL DE LA COMPRA */}
                                {purchase.generalQr && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border print:bg-white print:border-gray-300">
                                        <div className="w-12 h-12 bg-white p-1 rounded">
                                            <QRCode size={40} value={purchase.generalQr} viewBox="0 0 40 40" className="w-full h-auto" />
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-gray-500 font-bold uppercase">QR de Factura</p>
                                            <p className="text-gray-400 truncate max-w-[150px]" title={purchase.generalQr}>
                                                {purchase.generalQr.split('-')[0]}...
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* LISTA DE BOLETOS INDIVIDUALES DE ESTA COMPRA */}
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Tus Entradas ({purchase.tickets.length})
                            </h3>
                            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 print:block">
                                {purchase.tickets.map((ticket) => (
                                    <div key={ticket.id} className="print:break-inside-avoid print:mb-6">
                                        <TicketReceipt
                                            event={purchase.event}
                                            type={ticket.type}
                                            uniqueCode={ticket.uniqueCode}
                                            price={ticket.valor} 
                                            status={ticket.estado}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}