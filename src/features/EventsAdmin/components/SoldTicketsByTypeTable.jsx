import React, { useMemo } from "react";
import { RefreshCw } from "lucide-react";

export default function SoldTicketsByTypeTable({
  items = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const normalizedItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  );

  const formatCOP = (value) => {
    const normalized = Number.parseFloat(value);
    if (!Number.isFinite(normalized)) return "-";
    return `$${normalized.toLocaleString("es-CO")}`;
  };

  const totals = useMemo(() => {
    const totalSold = normalizedItems.reduce(
      (acc, item) => acc + (Number(item?.cantidad_vendida) || 0),
      0
    );
    const totalRevenue = normalizedItems.reduce(
      (acc, item) => acc + (Number.parseFloat(item?.ganancia) || 0),
      0
    );
    return { totalSold, totalRevenue };
  }, [normalizedItems]);

  const getTypeLabel = (item, idx) => {
    const candidates = [
      item?.TipoEntrada?.nombre,
      item?.tipoEntrada?.nombre,
      item?.TipoEntrada?.name,
      item?.tipoEntrada?.name,
      item?.nombre_tipo_entrada,
      item?.tipo_entrada_nombre,
      item?.tipoEntradaNombre,
      item?.ticketTypeName,
      item?.tipo,
      item?.nombre,
      item?.name,
      item?.tipo_entrada,
      item?.tipoEntrada,
      item?.ticketType,
    ];

    for (const c of candidates) {
      if (typeof c === "string" && c.trim().length > 0) return c;
      if (c && typeof c === "object") {
        const nested =
          c?.nombre ?? c?.name ?? c?.tipo ?? c?.descripcion ?? c?.label;
        if (typeof nested === "string" && nested.trim().length > 0) {
          return nested;
        }
      }
    }

    return `Tipo ${idx + 1}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto" />
        <p className="text-gray-600 font-medium mt-3">Cargando ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6 text-center">
        <p className="text-red-600 font-semibold">Error al cargar ventas</p>
        <p className="text-gray-600 text-sm mt-2">{error}</p>
        {typeof onRetry === "function" && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (normalizedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-600">Sin ventas para este evento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* #97: fila/resumen de totales del evento */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Total entradas vendidas:</span> {totals.totalSold}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Total ganancia:</span>{" "}
          <span className="font-bold text-green-700">{formatCOP(totals.totalRevenue)}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                Vendidas
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                Ingresos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {normalizedItems.map((item, idx) => {
              const name = getTypeLabel(item, idx);
              const sold = Number(item?.cantidad_vendida) || 0;
              const revenue = Number.parseFloat(item?.ganancia) || 0;

              return (
                <tr key={`${name}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {sold}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700 text-right">
                    {formatCOP(revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
