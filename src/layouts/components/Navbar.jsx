import React, { useState } from 'react';
import { Menu, X, CalendarDays } from 'lucide-react';
import { NavLink } from 'react-router-dom'; 

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', path: '/' },
  { id: 'eventos', label: 'Eventos', path: '/eventos' },
  { id: 'gestion', label: 'Gestión Eventos', path: '/gestion-eventos' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-900 text-white' 
        : 'text-blue-100 hover:text-white hover:bg-blue-600' 
    }`;
  return (
    <nav className="bg-blue-700 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <CalendarDays className="h-8 w-8 text-blue-200" />
            <span className="font-bold text-xl tracking-tight truncate">EventMaster</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.id} to={link.path} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="text-blue-100 hover:text-white focus:outline-none p-2 rounded-md hover:bg-blue-600 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>


      <div
        className={`md:hidden absolute w-full bg-blue-800 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-4 text-base font-medium rounded-md transition-colors ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:text-white hover:bg-blue-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;