import React, { useState } from 'react';
import { Menu, X, CalendarDays, LogIn, UserPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  // Verificamos si el usuario tiene rol 'admin' en su public metadata
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Construimos los enlaces de navegación de forma dinámica
  const navLinks = [
    { id: 'eventos', label: 'Eventos', path: '/' },
  ];

  if (isAdmin) {
    navLinks.push({ id: 'admin-panel', label: 'Panel', path: '/admin' });
    navLinks.push({ id: 'gestion', label: 'Gestión Eventos', path: '/gestion-eventos' });
  }

  const toggleMenu = () => setIsOpen(!isOpen);
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
      ? 'bg-blue-900 text-white'
      : 'text-blue-100 hover:text-white hover:bg-blue-600'
    }`;
  return (
    <nav className="bg-blue-700 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <NavLink to="/" className="flex items-center space-x-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <CalendarDays className="h-8 w-8 text-blue-200" />
            <span className="font-bold text-xl tracking-tight truncate">NexEvent</span>
          </NavLink>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavLink key={link.id} to={link.path} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}

            <SignedIn>
              {isAdmin ? (
                <NavLink to="/reportes" className={navLinkClass}>
                  Reportes
                </NavLink>
              ) : (
                <NavLink to="/mis-favoritos" className={navLinkClass}>
                  Mis favoritos
                </NavLink>
              )}
            </SignedIn>

            {/* Clerk Authentication Buttons - Desktop */}
            <div className="ml-4 pl-4 border-l border-blue-500 flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/auth-callback">
                  <button className="flex items-center space-x-1 text-sm font-medium text-white hover:text-blue-200 transition-colors px-3 py-2">
                    <LogIn size={16} className="mr-1" />
                    <span>Ingresar</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/auth-callback">
                  <button className="flex items-center space-x-1 text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors px-4 py-2 rounded-full shadow-sm hover:shadow">
                    <UserPlus size={16} className="mr-1" />
                    <span>Registrarse</span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="bg-blue-800 p-1 rounded-full shadow-inner flex items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 border-2 border-transparent hover:border-blue-300 transition-all",
                        userButtonPopoverCard: "shadow-xl border border-gray-100"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
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
        className={`md:hidden absolute w-full bg-blue-800 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 visible pb-4' : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Clerk Authentication Buttons - Mobile */}
          <div className="pt-4 mt-2 border-t border-blue-700">
            <SignedIn>
              {isAdmin ? (
                <NavLink
                  to="/reportes"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:text-white hover:bg-blue-700'}`
                  }
                >
                  Reportes
                </NavLink>
              ) : (
                <NavLink
                  to="/mis-favoritos"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                    }`
                  }
                >
                  Mis favoritos
                </NavLink>
              )}
            </SignedIn>

            <SignedOut>
              <div className="flex flex-col space-y-3">
                <SignInButton mode="modal" forceRedirectUrl="/auth-callback">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center w-full px-4 py-2 border border-blue-400 text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
                  >
                    <LogIn size={18} className="mr-2" />
                    Ingresar
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/auth-callback">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center w-full px-4 py-2 text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Crear cuenta
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center px-3 py-2 bg-blue-900/50 rounded-lg">
                <UserButton />
                <span className="ml-3 text-sm font-medium text-blue-100">Mi Perfil</span>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;