import React, { useRef } from "react";
import { Calendar, MapPin, User, Hash, Printer, CheckCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";

const PurchaseInvoice = ({ event, currentUser, purchaseDetails, total }) => {
    const invoiceRef = useRef(null);

    const today = new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    // Función de impresión 
    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
        documentTitle: `Factura_${event?.nombre || 'Evento'}_${invoiceNumber}`,
    });

    return (
        <div className="flex flex-col w-full max-w-md mx-auto">
            <div
                ref={invoiceRef}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0 print:m-0"
                style={{ padding: '2rem', backgroundColor: '#ffffff' }}
            >
                {/* Cabecera */}
                <div className="flex flex-col items-center justify-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
                    <div className="bg-green-50 text-green-600 p-3 rounded-full mb-4 border border-green-100 print:border-green-600 print:bg-transparent">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight text-center">¡Compra Exitosa!</h2>
                    <p className="text-gray-500 text-sm mt-1">Gracias por tu reserva</p>
                </div>

                {/* Datos del Cliente y Factura */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Cliente</p>
                        <p className="font-semibold text-gray-800 flex items-center text-sm">
                            <User size={14} className="mr-1 text-gray-400" />
                            {currentUser?.displayNombre || currentUser?.nombre || "Usuario Invitado"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Factura No.</p>
                        <p className="font-mono font-semibold text-gray-800 flex items-center justify-end text-sm">
                            <Hash size={14} className="mr-1 text-gray-400" />
                            {invoiceNumber}
                        </p>
                    </div>
                </div>

                {/* Datos del Evento */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 print:bg-white print:border-gray-300">
                    <h3 className="font-bold text-gray-900 mb-3">{event?.nombre}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {event?.fecha}
                        </div>
                        <div className="flex items-center">
                            <MapPin size={16} className="mr-2 text-blue-500" />
                            {event?.lugar}
                        </div>
                    </div>
                </div>

                {/* Resumen de Entradas */}
                <div className="mb-6">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Detalle de Entradas</p>
                    <div className="space-y-3">
                        {purchaseDetails?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{item.nombre}</span>
                                    <span className="text-xs text-gray-500">{item.cantidad} x ${item.precio?.toLocaleString("es-CO")}</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                    ${(item.cantidad * item.precio).toLocaleString("es-CO")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-dashed border-gray-200 pt-6 mt-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-bold uppercase tracking-wider text-sm">Total Pagado</span>
                        <span className="text-2xl font-extrabold text-blue-600">
                            ${total?.toLocaleString("es-CO")}
                        </span>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Emitido el {today}
                    </p>
                </div>
            </div>
            
            <div className="mt-4">
                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Printer size={20} />
                    Imprimir Factura
                </button>
            </div>

        </div>
    );
};

export default PurchaseInvoice;