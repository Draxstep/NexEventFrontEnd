import React from 'react';
import { Ticket, ArrowRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import TicketReceipt from '../components/TicketReceipt';

export default function CustomerPurchases() {
    const misCompras = [
        {
            idCompra: 'ORD-992834',
            qrGeneral: 'PAY-REF-992834',
            fechaCompra: '10 Oct 2024',
            event: {
                nombre: 'Tech Conference 2024',
                fecha: '15 Oct 2024',
                hora: '09:00 AM',
                lugar: 'Centro de Convenciones, Bogotá'
            },
            boletos: [
                { id: '1', type: 'VIP - Meet & Greet', uniqueCode: 'TKT-001-ABC' },
                { id: '2', type: 'VIP - Meet & Greet', uniqueCode: 'TKT-002-DEF' }
            ]
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center">
                    <Ticket className="mr-3 text-blue-600" size={36} />
                    Mis Compras
                </h1>
                <p className="text-gray-500 mt-2">Aquí encontrarás tus recibos y entradas individuales.</p>
            </div>

            {misCompras.length === 0 ? (
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
                <div className="space-y-12">
                    {misCompras.map((compra) => (
                        <div key={compra.idCompra} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                            {/* CABECERA DE LA ORDEN DE COMPRA */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center text-gray-800">
                                        <Receipt className="mr-2 text-gray-500" size={24} />
                                        Orden: #{compra.idCompra}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Comprado el {compra.fechaCompra}</p>
                                </div>

                                {/* QR GENERAL DE LA COMPRA (Opcional, si tu backend requiere escanear el recibo) */}
                                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                                    <div className="w-12 h-12 bg-white p-1 rounded">
                                        <QRCode size={40} value={compra.qrGeneral} viewBox="0 0 40 40" className="w-full h-auto" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="text-gray-500 font-bold uppercase">QR de Factura</p>
                                        <p className="text-gray-400">{compra.qrGeneral}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LISTA DE BOLETOS INDIVIDUALES DE ESTA COMPRA */}
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Tus Entradas ({compra.boletos.length})
                            </h3>
                            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                {compra.boletos.map((boleto) => (
                                    <TicketReceipt
                                        key={boleto.id}
                                        event={compra.event}
                                        type={boleto.type}
                                        uniqueCode={boleto.uniqueCode}
                                    />
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}