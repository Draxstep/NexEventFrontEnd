
import { Ticket, Trash2 } from 'lucide-react';

export default function EventTicketTypesEditor({ tickets, onChange, onRemove }) {

  const getDisplayValue = (value) => {
    const normalized = Number(value);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : "";
  };
  
  // Manejador para actualizar el precio o la capacidad de un ticket específico
  const handleFieldChange = (id, field, value) => {
    const numValue = Math.max(0, Number(value) || 0); 
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: numValue } : ticket
    );
    
    onChange(updatedTickets);
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center mt-2">
        Aún no has seleccionado tipos de entrada.
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Configuración de Entradas</h3>
      
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 border border-gray-200 rounded-lg shadow-sm gap-4">
          
          {/* Nombre del Ticket */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <Ticket size={18} />
            </div>
            <span className="font-medium text-gray-700 truncate">{ticket.nombre}</span>
          </div>

          {/* Controles de Precio y Capacidad */}
          <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
            
            {/* Input Precio */}
            <div className="flex items-center gap-2">
              <label htmlFor={`precio-${ticket.id}`} className="text-xs font-medium text-gray-600">
                Precio ($):
              </label>
              <input
                id={`precio-${ticket.id}`}
                type="number"
                min="0"
                value={getDisplayValue(ticket.precio)}
                onChange={(e) => handleFieldChange(ticket.id, 'precio', e.target.value)}
                className="w-20 md:w-24 px-2 py-1 border border-gray-300 rounded text-right placeholder:text-gray-400 placeholder:opacity-70 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Input Capacidad */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor={`cap-${ticket.id}`} className="text-xs font-medium text-gray-600">
                  Capacidad:
                </label>
                <input
                  id={`cap-${ticket.id}`}
                  type="number"
                  min={ticket.cantidad_vendida || 0}
                  value={getDisplayValue(ticket.capacidad_total)}
                  onChange={(e) => handleFieldChange(ticket.id, 'capacidad_total', e.target.value)}
                  className={`w-20 md:w-24 px-2 py-1 border rounded text-right placeholder:text-gray-400 placeholder:opacity-70 focus:ring-2 focus:outline-none ${Number(ticket.capacidad_total) < (ticket.cantidad_vendida || 0)
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="0"
                />
              </div>

              {Number(ticket.capacidad_total) < (ticket.cantidad_vendida || 0) && (
                <span className="text-[10px] text-red-500 leading-tight">
                  Ya vendiste {ticket.cantidad_vendida}
                </span>
              )}
            </div>
            
            {/* Botón Eliminar */}
            <button 
              type="button" 
              onClick={() => onRemove(ticket.id)}
              className="text-red-400 hover:text-red-600 transition-colors p-1 ml-2"
              title="Eliminar tipo de entrada"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}