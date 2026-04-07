import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function TicketReceipt({ event, type, uniqueCode }) {
    const qrValue = uniqueCode || 'TKT-00000000';
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow relative">

            {/* Círculos decorativos */}
            <div className="hidden sm:block absolute -top-3 left-2/3 w-6 h-6 bg-gray-50 rounded-full border-b border-gray-200 z-10 transform -translate-x-3"></div>
            <div className="hidden sm:block absolute -bottom-3 left-2/3 w-6 h-6 bg-gray-50 rounded-full border-t border-gray-200 z-10 transform -translate-x-3"></div>

            {/* Sección Izquierda: Información del Evento */}
            <div className="p-6 flex-1 sm:w-2/3">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {/* AHORA LEE .name EN LUGAR DE .nombre */}
                        {event?.name || 'Evento sin nombre'}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Pagado
                    </span>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        {/* AHORA LEE .date y .time */}
                        <span>{event?.date || 'Fecha por confirmar'} • {event?.time || '00:00'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        {/* AHORA LEE .location */}
                        <span className="truncate">{event?.location || 'Lugar por confirmar'}</span>
                    </div>
                </div>

                {/* Detalles del boleto (Sin cantidad) */}
                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
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
            </div>

            {/* Sección Derecha: Código y QR */}
            <div className="border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-gray-200 bg-blue-600 text-white p-6 sm:w-1/3 flex flex-col items-center justify-center relative">
                <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-3">Código de Acceso</p>

                <div className="bg-white p-3 rounded-xl mb-3 shadow-inner">
                    <QRCode
                        size={96} 
                        value={qrValue} 
                        viewBox={`0 0 96 96`} 
                        className="w-full h-auto max-w-full" 
                    />
                </div>

                <p className="font-mono text-sm tracking-widest font-bold text-center bg-blue-700/50 px-3 py-1 rounded-lg break-all">
                    {qrValue}
                </p>
            </div>
        </div>
    );
}