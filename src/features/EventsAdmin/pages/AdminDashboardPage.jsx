import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Panel administrativo (solo para usuarios con rol admin).
        </p>
      </div>
    </div>
  );
}
