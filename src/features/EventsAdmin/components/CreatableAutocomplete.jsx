import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Autocomplete from './Autocomplete';
import { createCategory } from '../services/eventService';

export default function CreatableAutocomplete({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [localOptions, setLocalOptions] = useState(options);

  // Sync with parent options, but preserve any newly added ones if needed
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleChange = async (val) => {
    if (!val) {
      onChange(val);
      return;
    }

    // Check if the selected val matches an existing option (by value or label, but Autocomplete sends value)
    const exists = localOptions.find(opt => String(opt.value) === String(val));
    
    // If it doesn't exist, we assume the user typed a new string and clicked 'NUEVO'
    if (!exists) {
      setIsCreating(true);
      try {
        const newCat = await createCategory({ nombre: val });
        // Add visually new option
        setLocalOptions(prev => [...prev, { value: newCat.id, label: newCat.nombre }]);
        // Pass the literal new ID upward
        onChange(newCat.id);
      } catch (err) {
        console.error("Error creating category:", err);
        // It's up to the parent or a toast to show this, for now we will alert
        alert(err.message || "Error al crear la categoría");
        onChange(""); // Reset selection
      } finally {
        setIsCreating(false);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <div className="relative">
      <Autocomplete
        options={localOptions}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled || isCreating}
        creatable={true}
      />
      {isCreating && (
        <div className="absolute top-1/2 right-8 -translate-y-1/2 flex items-center bg-white px-2">
          <Loader2 size={16} className="animate-spin text-blue-500 mr-2" />
          <span className="text-xs text-blue-500 font-medium z-10">Creando...</span>
        </div>
      )}
    </div>
  );
}