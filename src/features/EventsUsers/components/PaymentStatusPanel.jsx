import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, Clock3 } from 'lucide-react';

const STATUS_STYLES = {
  PROCESSING: 'bg-blue-50 border-blue-200 text-blue-800',
  GATEWAY_RECEIVED: 'bg-amber-50 border-amber-200 text-amber-800',
  AI_RESOLVED: 'bg-gray-50 border-gray-200 text-gray-700',
};

const STATUS_LABELS = {
  PROCESSING: 'Procesando',
  GATEWAY_RECEIVED: 'Respuesta recibida',
  AI_RESOLVED: 'Analisis IA',
};

const AI_OUTCOME_STYLES = {
  SUCCESS: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  ERROR: 'bg-rose-50 border-rose-200 text-rose-900',
  TIMEOUT: 'bg-amber-50 border-amber-200 text-amber-900',
};

const AI_OUTCOME_LABELS = {
  SUCCESS: 'Resultado aprobado',
  ERROR: 'Resultado con error',
  TIMEOUT: 'Tiempo de espera agotado',
};

const getAiOutcome = (payload) => {
  if (!payload) return null;
  const raw =
    payload.outcome ||
    payload.result ||
    payload.paymentStatus ||
    payload.gatewayStatus ||
    payload.finalStatus;

  if (typeof raw === 'string') {
    return raw.toUpperCase();
  }

  return null;
};

export default function PaymentStatusPanel({ status, history, isConnected, onRetry, onEditPayment }) {
  const activeStatus = status?.status;
  const aiOutcome = activeStatus === 'AI_RESOLVED' ? getAiOutcome(status) : null;
  const containerStyle =
    activeStatus === 'AI_RESOLVED'
      ? AI_OUTCOME_STYLES[aiOutcome] || STATUS_STYLES.AI_RESOLVED
      : STATUS_STYLES[activeStatus] || 'bg-gray-50 border-gray-200 text-gray-700';
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

      {activeStatus === 'AI_RESOLVED' && (
        <div className={`mt-4 rounded-lg border px-4 py-3 ${AI_OUTCOME_STYLES[aiOutcome] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
          <div className="flex items-start gap-3">
            {aiOutcome === 'SUCCESS' && <CheckCircle2 size={20} className="mt-0.5" />}
            {aiOutcome === 'ERROR' && <AlertTriangle size={20} className="mt-0.5" />}
            {aiOutcome === 'TIMEOUT' && <Clock3 size={20} className="mt-0.5" />}
            {!aiOutcome && <CheckCircle2 size={20} className="mt-0.5" />}
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {AI_OUTCOME_LABELS[aiOutcome] || 'Resultado IA'}
              </p>
              <p className="text-sm">{status?.message || 'El analisis de IA se completo.'}</p>
              {aiOutcome === 'ERROR' && onEditPayment && (
                <button
                  type="button"
                  onClick={onEditPayment}
                  className="mt-3 inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                >
                  Revisar datos de pago
                </button>
              )}
              {aiOutcome === 'TIMEOUT' && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
                >
                  Reintentar monitoreo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
