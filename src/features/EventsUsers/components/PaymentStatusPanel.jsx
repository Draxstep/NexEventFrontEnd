import React from 'react';
import { Loader2 } from 'lucide-react';

const STATUS_STYLES = {
  PROCESSING: 'bg-blue-50 border-blue-200 text-blue-800',
  GATEWAY_RECEIVED: 'bg-amber-50 border-amber-200 text-amber-800',
};

const STATUS_LABELS = {
  PROCESSING: 'Procesando',
  GATEWAY_RECEIVED: 'Respuesta recibida',
};

export default function PaymentStatusPanel({ status, history, isConnected }) {
  const activeStatus = status?.status;
  const containerStyle = STATUS_STYLES[activeStatus] || 'bg-gray-50 border-gray-200 text-gray-700';
  const label = STATUS_LABELS[activeStatus] || 'Esperando actualizaciones';

  return (
    <div className={`rounded-xl border px-4 py-3 ${containerStyle}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide">Estado del pago</p>
          <p className="text-sm font-bold">{label}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isConnected ? 'Conectado' : 'Sin conexion'}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        {activeStatus === 'PROCESSING' && <Loader2 size={16} className="animate-spin" />}
        <span>{status?.message || 'Aun no se han recibido eventos.'}</span>
      </div>

      {history?.length > 0 && (
        <div className="mt-3 space-y-1 text-xs text-gray-600">
          {history.map((item, index) => (
            <div key={`${item.status}-${index}`} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
