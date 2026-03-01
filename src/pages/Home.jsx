import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-100 p-4 sm:p-6 rounded-full mb-6">
        <MousePointerClick className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
        Bienvenido al Gestor de Eventos
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Por favor, selecciona una opción en el menú de navegación superior para comenzar.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          to="/gestion-eventos" 
          className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Gestionar Eventos
        </Link>
      </div>
    </div>
  );
}