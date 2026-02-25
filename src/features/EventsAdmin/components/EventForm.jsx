import React, { useState, useMemo } from 'react';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Autocomplete from './Autocomplete'; 
import { UBICACIONES } from '../hooks/useEvents';

const initialForm = {
  nombre: '', fecha: '', departamento: '', ciudad: '', lugar: '', 
  hora: '', categoria: '', descripcion: '', valor: '', imagen: null
};

const EventForm = ({ categorias, initialData, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(initialData || initialForm);
  const [errores, setErrores] = useState({});

  // Formateo de opciones para los Autocompletes
  const deptOptions = Object.keys(UBICACIONES).map(d => ({ value: d, label: d }));
  
  const ciudadOptions = useMemo(() => {
    if (!formData.departamento || !UBICACIONES[formData.departamento]) return [];
    return UBICACIONES[formData.departamento].map(c => ({ value: c, label: c }));
  }, [formData.departamento]);

  const catOptions = categorias.map(c => ({ value: c.id, label: c.nombre }));

  const handleChange = (name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Lógica en cascada: Si cambia el departamento, resetear ciudad
      if (name === 'departamento') updated.ciudad = '';
      return updated;
    });
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: null }));
  };

  // ... (handleImageChange se mantiene exactamente igual) ...
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) { setErrores(prev => ({ ...prev, imagen: 'Debe ser JPG o PNG' })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrores(prev => ({ ...prev, imagen: 'Máximo 5MB' })); return; }
    handleChange('imagen', file);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const requeridos = isEditing 
      ? ['fecha', 'departamento', 'ciudad', 'lugar', 'hora', 'categoria'] 
      : ['nombre', 'fecha', 'departamento', 'ciudad', 'lugar', 'hora', 'categoria'];

    requeridos.forEach(campo => {
      if (!formData[campo] || formData[campo].toString().trim() === '') {
        nuevosErrores[campo] = 'Este campo es obligatorio';
      }
    });

    if (formData.fecha) {
      const fechaActual = new Date(); fechaActual.setHours(0, 0, 0, 0);
      const [year, month, day] = formData.fecha.split('-');
      if (new Date(year, month - 1, day) < fechaActual) {
        nuevosErrores.fecha = 'Debe ser igual o posterior a hoy';
      }
    }

    if (formData.valor !== '' && formData.valor !== null && Number(formData.valor) < 0) {
      nuevosErrores.valor = 'Debe ser igual o mayor a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) onSubmit(formData);
  };

  const ErrorMsg = ({ name }) => errores[name] ? <span className="text-red-500 text-xs mt-1 block font-medium">{errores[name]}</span> : null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full animate-fade-in">
      <div className="bg-blue-700 px-4 sm:px-6 py-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{isEditing ? 'Actualizar Evento' : 'Registrar Evento'}</h2>
        <button onClick={onCancel} className="text-white hover:bg-blue-800 p-2 rounded-lg flex items-center transition-colors">
          <ArrowLeft size={18} className="mr-1 md:mr-2" /> <span className="hidden sm:inline">Volver</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Nombre del Evento {isEditing && '(Solo lectura)'}</label>
            <input 
              type="text" value={formData.nombre} disabled={isEditing}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-lg ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : errores.nombre ? 'border-red-500' : 'border-gray-300'}`} 
            />
            <ErrorMsg name="nombre" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
            <input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} className={`mt-1 w-full px-3 py-2 border rounded-lg ${errores.fecha ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMsg name="fecha" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora *</label>
            <input type="time" value={formData.hora} onChange={(e) => handleChange('hora', e.target.value)} className={`mt-1 w-full px-3 py-2 border rounded-lg ${errores.hora ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMsg name="hora" />
          </div>

          {/* Autocompletes Strictos para Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Departamento *</label>
            <Autocomplete 
              options={deptOptions} value={formData.departamento} 
              onChange={(val) => handleChange('departamento', val)}
              placeholder="Buscar departamento..." error={errores.departamento} creatable={false}
            />
            <ErrorMsg name="departamento" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
            <Autocomplete 
              options={ciudadOptions} value={formData.ciudad} 
              onChange={(val) => handleChange('ciudad', val)}
              disabled={!formData.departamento}
              placeholder={formData.departamento ? "Buscar ciudad..." : "Seleccione depto primero"} 
              error={errores.ciudad} creatable={false}
            />
            <ErrorMsg name="ciudad" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Lugar *</label>
            <input type="text" value={formData.lugar} onChange={(e) => handleChange('lugar', e.target.value)} className={`mt-1 w-full px-3 py-2 border rounded-lg ${errores.lugar ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMsg name="lugar" />
          </div>

          {/* Autocomplete CREATABLE para Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría *</label>
            <Autocomplete 
              options={catOptions} value={formData.categoria} 
              onChange={(val) => handleChange('categoria', val)}
              placeholder="Buscar o crear nueva..." error={errores.categoria} 
              creatable={true} // <-- ¡La magia se enciende aquí!
            />
            <ErrorMsg name="categoria" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Valor (Opcional)</label>
            <input type="number" min="0" value={formData.valor} onChange={(e) => handleChange('valor', e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <ErrorMsg name="valor" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
            <textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} rows="3" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Imagen Representativa (Opcional, JPG/PNG, máx 5MB)</label>
            <div className="mt-1 flex items-center gap-3">
              <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg flex items-center text-sm">
                <ImageIcon size={18} className="mr-2 text-gray-500"/> Seleccionar Archivo
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} className="hidden" />
              </label>
              {formData.imagen && <span className="text-sm text-green-700 truncate">{formData.imagen.name}</span>}
            </div>
            <ErrorMsg name="imagen" />
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">Cancelar</button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto">
            <Save size={18} className="mr-2" /> {isEditing ? 'Actualizar evento' : 'Agregar evento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;