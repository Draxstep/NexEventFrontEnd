import React, { useMemo } from "react";

const formatCOP = (value) => {
  const normalized = Number.parseFloat(value);
  if (!Number.isFinite(normalized)) return "-";
  return `$${normalized.toLocaleString("es-CO")}`;
};

/**
 * Tabla de ventas por tipo de entrada.
 *
 * Props:
 * - items: arreglo de registros de ventas (ventas[] del endpoint)
 * - loading/error: estados opcionales
 * - onRetry: callback opcional para reintentar
 */
export default function SoldTicketsByTypeTable({
  items,
  loading = false,
  error = null,
  onRetry,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const totals = useMemo(() => {
    const totalSold = safeItems.reduce(
      (acc, item) => acc + (Number(item?.cantidad_vendida) || 0),
      0
    );
    const totalRevenue = safeItems.reduce(
      (acc, item) => acc + (Number.parseFloat(item?.ganancia) || 0),
      0
    );
    return { totalSold, totalRevenue };
  }, [safeItems]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-700 font-medium">
          Total entradas vendidas: <span className="font-bold">{totals.totalSold}</span>
        </p>
        <p className="text-sm text-gray-700 font-medium">
          Total ganancia: <span className="font-bold">{formatCOP(totals.totalRevenue)}</span>
        </p>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-600">Cargando ventas...</div>
      ) : error ? (
        <div className="p-6">
          <p className="text-red-600 font-semibold mb-2">Error al cargar ventas</p>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      ) : safeItems.length === 0 ? (
        <div className="p-6 text-sm text-gray-600">
          Aún no hay ventas registradas para este evento.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Vendidas</th>
                <th className="px-4 py-3 font-semibold">Capacidad</th>
                <th className="px-4 py-3 font-semibold">Ganancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {safeItems.map((item) => (
                <tr key={item.id} className="text-gray-800">
                  <td className="px-4 py-3 font-medium">
                    {item?.TipoEntrada?.nombre ||
                      item?.tipoEntrada?.nombre ||
                      `Tipo ${item?.tipo_entrada_id}`}
                  </td>
                  <td className="px-4 py-3">
                    {Number(item?.cantidad_vendida) || 0}
                  </td>
                  <td className="px-4 py-3">
                    {Number(item?.capacidad_total) || 0}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCOP(item?.ganancia)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
