import React, { useRef } from 'react';
import { Calendar, MapPin, Ticket, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';

export default function TicketReceipt({ event, type, uniqueCode }) {
    const qrValue = uniqueCode || 'TKT-00000000';

    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef, 
        documentTitle: `Entrada-${event?.name || 'Evento'}-${qrValue.substring(0, 8)}`,
    });

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
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            {event?.name || 'Evento sin nombre'}
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide print:border print:border-green-800">
                            Pagado
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
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-gray-50 rounded-xl p-4 flex-1 flex justify-between items-center border border-gray-100 print:bg-white print:border-gray-300">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Tipo de Entrada</p>
                            <p className="font-bold text-gray-900">{type || 'General'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Pase</p>
                            <p className="font-bold text-gray-900 flex items-center justify-end">
                                <Ticket size={16} className="mr-1 text-blue-600" />
                                Individual
                            </p>
                        </div>
                    </div>

                    {/* 4. BOTÓN DE IMPRIMIR (se oculta en el papel con print:hidden) */}
                    <button
                        onClick={handlePrint}
                        className="print:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-5 rounded-xl transition-colors border border-gray-200 sm:w-auto w-full"
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