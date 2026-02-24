import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Component
 * Muestra la ruta de navegación actual basándose en la estructura de rutas
 * 
 * @param {Array} items - Array de objetos con {label, path}
 * Ejemplo: [{label: 'Inicio', path: '/'}, {label: 'Clientes', path: '/clientes'}]
 */
export default function Breadcrumb({ items = [] }) {
  // Si no hay items, intentar generar automáticamente desde la URL
  const breadcrumbItems = items.length > 0 ? items : [{ label: 'Inicio', path: '/' }];

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 px-1">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isHome = index === 0;

        return (
          <div key={item.path || index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 mx-2" />
            )}
            
            {isLast ? (
              <span className="text-gray-900 font-medium flex items-center">
                {isHome && <Home size={14} className="mr-1" />}
                {item.label}
              </span>
            ) : (
              <a
                href={item.path}
                className="text-blue-600 hover:text-blue-800 hover:underline transition flex items-center"
              >
                {isHome && <Home size={14} className="mr-1" />}
                {item.label}
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
}
