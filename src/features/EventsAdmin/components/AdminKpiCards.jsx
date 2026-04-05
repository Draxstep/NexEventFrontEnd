import React, { useMemo } from "react";

export default function AdminKpiCards({ metrics, loading = false, error = null }) {
  const normalized = useMemo(() => {
    const m = metrics && typeof metrics === "object" ? metrics : {};

    const totalRevenue = Number.parseFloat(
      m.total_ganancias ?? m.totalRevenue ?? m.totalGanancias
    );
    const activeEvents = Number(m.eventos_activos ?? m.activeEvents);
    const pastEvents = Number(m.eventos_pasados ?? m.pastEvents);
    const registeredUsers = Number(m.usuarios_registrados ?? m.registeredUsers);

    return {
      totalRevenue: Number.isFinite(totalRevenue) ? totalRevenue : null,
      activeEvents: Number.isFinite(activeEvents) ? activeEvents : null,
      pastEvents: Number.isFinite(pastEvents) ? pastEvents : null,
      registeredUsers: Number.isFinite(registeredUsers) ? registeredUsers : null,
    };
  }, [metrics]);

  const formatCOP = (value) => {
    if (!Number.isFinite(value)) return "-";
    return `$${value.toLocaleString("es-CO")}`;
  };

  const formatInt = (value) => {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString("es-CO");
  };

  const Card = ({ label, value }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-7 w-32 bg-gray-200 rounded mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg shadow-sm p-4">
        <p className="text-sm font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card label="Total revenue" value={formatCOP(normalized.totalRevenue)} />
      <Card label="Active events" value={formatInt(normalized.activeEvents)} />
      <Card label="Past events" value={formatInt(normalized.pastEvents)} />
      <Card
        label="Registered users"
        value={formatInt(normalized.registeredUsers)}
      />
    </div>
  );
}
