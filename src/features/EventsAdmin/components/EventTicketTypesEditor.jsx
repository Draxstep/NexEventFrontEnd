
import { Ticket, Trash2 } from 'lucide-react';

export default function EventTicketTypesEditor({ tickets, onChange, onRemove }) {

  const getDisplayValue = (value) => {
    const normalized = Number(value);
    return Number.isFinite(normalized) && normalized > 0 ? normalized : "";
  };
  
  // Manejador para actualizar el precio o la capacidad de un ticket específico
  const handleFieldChange = (id, field, value) => {
    const numValue = Math.max(0, Number(value) || 0); 
    
    const updatedTickets = tickets.map(ticket => {
      const ticketId = ticket.id || ticket.tipo_entrada_id;
      return ticketId === id ? { ...ticket, [field]: numValue } : ticket;
    });
    
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
      
      {tickets.map((ticket, index) => {
        const ticketId = ticket.id || ticket.tipo_entrada_id;
        const cantidadVendida = ticket.cantidad_vendida || 0;
        const tieneVentas = cantidadVendida > 0;

        return (
          <div key={ticketId || index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 border border-gray-200 rounded-lg shadow-sm gap-4">
            
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label htmlFor={`precio-${ticketId}`} className="text-xs font-medium text-gray-600">
                    Precio ($):
                  </label>
                  <input
                    id={`precio-${ticketId}`}
                    type="number"
                    min="0"
                    disabled={tieneVentas}
                    value={getDisplayValue(ticket.precio)}
                    onChange={(e) => handleFieldChange(ticketId, 'precio', e.target.value)}
                    className={`w-20 md:w-24 px-2 py-1 border rounded text-right placeholder:text-gray-400 placeholder:opacity-70 focus:ring-2 focus:outline-none ${
                      tieneVentas
                        ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0"
                  />
                </div>
                {/* Mensaje amigable si hay ventas */}
                {tieneVentas ? (
                  <span className="text-[10px] text-gray-500 leading-tight text-right">
                    Precio fijo (ya hay ventas)
                  </span>
                ) : (
                   <span className="text-[10px] opacity-0 leading-tight">Espaciador</span> // Mantiene la alineación vertical
                )}
              </div>

              {/* Input Capacidad */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label htmlFor={`cap-${ticketId}`} className="text-xs font-medium text-gray-600">
                    Capacidad:
                  </label>
                  <input
                    id={`cap-${ticketId}`}
                    type="number"
                    min={cantidadVendida}
                    value={getDisplayValue(ticket.capacidad_total)}
                    onChange={(e) => handleFieldChange(ticketId, 'capacidad_total', e.target.value)}
                    className={`w-20 md:w-24 px-2 py-1 border rounded text-right placeholder:text-gray-400 placeholder:opacity-70 focus:ring-2 focus:outline-none ${
                      Number(ticket.capacidad_total) < cantidadVendida
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0"
                  />
                </div>
                {/* Mensaje condicional de error o información */}
                {Number(ticket.capacidad_total) < cantidadVendida ? (
                  <span className="text-[10px] text-red-500 font-medium leading-tight text-right">
                    Debes asignar mínimo {cantidadVendida}
                  </span>
                ) : tieneVentas ? (
                  <span className="text-[10px] text-gray-500 leading-tight text-right">
                    {cantidadVendida} ya vendidas
                  </span>
                ) : (
                  <span className="text-[10px] opacity-0 leading-tight">Espaciador</span> // Mantiene la alineación
                )}
              </div>
              
              {/* Botón Eliminar */}
              <button 
                type="button" 
                onClick={() => !tieneVentas && onRemove(ticketId)}
                disabled={tieneVentas}
                className={`p-1 ml-2 transition-colors ${
                  tieneVentas 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-red-400 hover:text-red-600'
                }`}
                title={tieneVentas ? "No se puede eliminar, ya tiene entradas vendidas" : "Eliminar tipo de entrada"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}