import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ModalConfirmacion = ({ isOpen, titulo, mensaje, onConfirm, onCancel, isDanger }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-fade-in border border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className={`w-12 h-12 ${isDanger ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{titulo}</h3>
        <p className={`text-center text-sm mb-6 ${isDanger ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
          {mensaje}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-sm ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;