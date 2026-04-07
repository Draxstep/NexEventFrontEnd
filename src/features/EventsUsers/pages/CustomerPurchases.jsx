import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerPurchases() {
  const misCompras = []; // Mock por ahora

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center">
          <Ticket className="mr-3 text-blue-600" size={36} />
          Mis Compras
        </h1>
      </div>

      {misCompras.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center mt-10">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Ticket className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes entradas</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Parece que todavía no has comprado entradas para ningún evento. ¡Descubre lo que está pasando cerca de ti!
          </p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center">
            Explorar eventos <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Aquí mapearemos las compras reales */}
        </div>
      )}
    </div>
  );
}