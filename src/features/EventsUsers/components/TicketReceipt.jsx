import React, { useRef } from 'react';
import { Calendar, MapPin, Ticket, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

export default function TicketReceipt({ event, type, uniqueCode, price, status}) {
    const qrValue = uniqueCode || 'TKT-00000000';

    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef, 
        documentTitle: `Entrada-${event?.name || 'Evento'}-${qrValue.substring(0, 8)}`,
    });

    const getStatusStyles = (ticketStatus) => {
        const s = (ticketStatus || 'activo').toLowerCase();
        switch (s) {
            case 'usado':
                return 'bg-gray-100 text-gray-800 print:border-gray-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800 print:border-red-800';
            case 'inactivo':
                return 'bg-yellow-100 text-yellow-800 print:border-yellow-800';
            case 'activo':
            default:
                return 'bg-green-100 text-green-800 print:border-green-800';
        }
    };

    const formattedPrice = price != null 
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
        : 'Gratis';

    return (
        <div
            ref={contentRef}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow relative print:shadow-none print:border-gray-400 print:m-4"
        >

            {/* Círculos decorativos */}
            <div className="hidden sm:block absolute -top-3 left-2/3 w-6 h-6 bg-gray-50 rounded-full border-b border-gray-200 z-10 transform -translate-x-3 print:bg-white"></div>
            <div className="hidden sm:block absolute -bottom-3 left-2/3 w-6 h-6 bg-gray-50 rounded-full border-t border-gray-200 z-10 transform -translate-x-3 print:bg-white"></div>

            {/* Sección Izquierda: Información del Evento */}
            <div className="p-6 flex-1 sm:w-2/3 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight pr-4">
                            {event?.name || 'Evento sin nombre'}
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide print:border ${getStatusStyles(status)}`}>
                            {status || 'Activo'}
                        </span>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-600 text-sm">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            <span>{event?.date || 'Fecha por confirmar'} • {event?.time || '00:00'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin size={16} className="mr-2 text-blue-500" />
                            <span className="truncate">{event?.location || 'Lugar por confirmar'}</span>
                        </div>
                    </div>
                </div>

                {/* Contenedor inferior: Detalles + Botón Imprimir */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    
                    {/* Detalles en formato de lista (Filas) */}
                    <div className="bg-gray-50 rounded-xl p-4 flex-1 w-full flex flex-col gap-2 border border-gray-100 print:bg-white print:border-gray-300">
                        
                        {/* Fila 1: Tipo de Entrada */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Entrada</span>
                            <span className="font-bold text-gray-900 text-sm">{type || 'General'}</span>
                        </div>
                        
                        <div className="border-b border-dashed border-gray-200 print:border-gray-300"></div>
                        
                        {/* Fila 2: Valor */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Valor</span>
                            <span className="font-bold text-gray-900 text-sm">{formattedPrice}</span>
                        </div>

                        <div className="border-b border-dashed border-gray-200 print:border-gray-300"></div>
                        
                        {/* Fila 3: Pase */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pase</span>
                            <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                <Ticket size={14} className="text-blue-600" />
                                Individual
                            </span>
                        </div>
                    </div>

                    {/* BOTÓN DE IMPRIMIR */}
                    <button
                        onClick={handlePrint}
                        className="print:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-5 rounded-xl transition-colors border border-gray-200 sm:w-auto w-full h-fit shrink-0"
                        title="Imprimir esta entrada"
                    >
                        <Printer size={18} />
                        <span className="sm:hidden lg:inline">Imprimir</span>
                    </button>
                </div>
            </div>

            {/* Sección Derecha: Código y QR */}
            <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-gray-200 bg-blue-600 text-white p-6 sm:w-1/3 flex flex-col items-center justify-center relative print:border-gray-400 print:bg-white print:text-gray-900">
                <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-3 print:text-gray-500">Código de Acceso</p>

                <div className="bg-white p-3 rounded-xl mb-3 shadow-inner border border-gray-100 print:border-2 print:border-gray-800">
                    <QRCode
                        size={96}
                        value={qrValue}
                        viewBox={`0 0 96 96`}
                        className="w-full h-auto max-w-full"
                    />
                </div>

                <p className="font-mono text-sm tracking-widest font-bold text-center bg-blue-700/50 px-3 py-1 rounded-lg break-all print:bg-transparent print:text-gray-800 print:p-0">
                    {qrValue}
                </p>
            </div>
        </div>
    );
}