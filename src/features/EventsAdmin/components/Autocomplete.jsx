import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Autocomplete({
  options, value, onChange, placeholder, disabled = false, error, creatable = false
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setQuery('');
      return;
    }

    const selectedOption = options.find(
      opt => String(opt.value) === String(value)
    );

    if (selectedOption) {
      setQuery(selectedOption.label);
    }
  }, [value]); 

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (!document.contains(e.target)) return;

      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, options, creatable, onChange]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const exactMatch = options.some(opt => opt.label.toLowerCase() === query.toLowerCase());

  const handleSelect = (val, label) => {
    setQuery(label);
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (creatable) onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`mt-1 w-full px-3 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-colors ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' :
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
        />
        <div className="absolute inset-y-0 right-0 top-1 flex items-center px-2 pointer-events-none text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>

      {isOpen && !disabled && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value, opt.label)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
              >
                {opt.label}
              </li>
            ))
          ) : !creatable ? (
            <li className="px-4 py-3 text-gray-500 text-sm text-center">No se encontraron resultados</li>
          ) : null}

          {creatable && query.trim() !== '' && !exactMatch && (
            <li
              onClick={() => handleSelect(query, query)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-blue-600 font-medium border-t border-gray-100 flex items-center"
            >
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">NUEVO</span>
              Agregar "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}