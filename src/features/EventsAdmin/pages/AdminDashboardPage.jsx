import React, { useEffect, useState } from "react";
import AdminKpiCards from "../components/AdminKpiCards";
import { getAdminGeneralMetrics } from "../services/adminMetricsService";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAdminGeneralMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar las métricas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
      </div>

      <AdminKpiCards metrics={metrics} loading={loading} error={error} />
    </div>
  );
}
