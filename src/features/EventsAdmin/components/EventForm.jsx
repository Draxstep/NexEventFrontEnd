import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Ban } from "lucide-react";
import Autocomplete from "./Autocomplete";

const initialForm = {
  nombre: "",
  fecha: "",
  ciudad_id: "",
  departamento_id: "",
  lugar: "",
  hora: "",
  categoria_id: "",
  descripcion: "",
  valor: "",
  imagen_url: "",
  imagen: null,
};

const EventForm = ({
  categories = [],
  departments = [],
  loadCitiesByDepartment,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState(
    initialData
      ? {
        ...initialData,
        categoria_id: initialData?.categoria?.id || initialData?.Categoria?.id || initialData?.Categorium?.id || "",
        ciudad_id: initialData?.Ciudad?.id || "",
        departamento_id:
          initialData?.Ciudad?.Departamento?.id || "",
        imagen: null,
      }
      : initialForm
  );

  const [errors, setErrors] = useState({});
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    // Si la data inicial cambia desde fuera (ej. cargó un nuevo evento),
    // actualizamos el estado interno del formulario.
    if (initialData) {
      setFormData({
        ...initialData,
        categoria_id: initialData?.categoria?.id || initialData?.Categoria?.id || initialData?.Categorium?.id || "",
        ciudad_id: initialData?.Ciudad?.id || "",
        departamento_id:
          initialData?.Ciudad?.Departamento?.id || "",
        imagen: null,
      });

      // Si tenemos un departamento inicial, aseguremos que se carguen las ciudades para que el autocomplete de ciudad se mapee
      if (initialData?.Ciudad?.Departamento?.id) {
        loadCitiesByDepartment(initialData.Ciudad.Departamento.id).then(cities => {
          if (cities) {
            setCityOptions(cities.map(city => ({
              value: city.id,
              label: city.nombre
            })));
          }
        });
      }
    }
  }, [initialData?.id]); // Solo se dispara si cambia el ID del evento initial, así no estropea tu escritura si hay un re-render del componente padre

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: d.nombre,
  }));

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.nombre,
  }));

  const handleDepartmentChange = async (selectedValue) => {
    const numericId = Number(selectedValue);

    setFormData(prev => ({
      ...prev,
      departamento_id: numericId,
      ciudad_id: "",
    }));

    if (!numericId) {
      setCityOptions([]);
      return;
    }

    try {
      const cities = await loadCitiesByDepartment(numericId) || [];

      const formatted = cities.map(city => ({
        value: city.id,
        label: city.nombre
      }));

      setCityOptions(formatted);
    } catch (error) {
      console.error("Error cargando ciudades:", error);
      setCityOptions([]);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "nombre",
      "fecha",
      "departamento_id",
      "ciudad_id",
      "lugar",
      "hora",
      "categoria_id",
    ];

    requiredFields.forEach((field) => {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.valor && Number(formData.valor) < 0) {
      newErrors.valor = "Must be greater than or equal to 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // We send 'imagen' to the service layer.
    onSubmit({
      id: formData.id,
      nombre: formData.nombre,
      fecha: formData.fecha,
      hora: formData.hora,
      lugar: formData.lugar,
      categoria_id: formData.categoria_id,
      ciudad_id: formData.ciudad_id,
      descripcion: formData.descripcion,
      valor: formData.valor,
      imagen_url: formData.imagen_url,
      imagen: formData.imagen,
    });
  };

  const ErrorMsg = ({ name }) =>
    errors[name] ? (
      <span className="text-red-500 text-xs mt-1 block font-medium">
        {errors[name]}
      </span>
    ) : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación lado cliente opcional, pero ayuda a la UX
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, imagen: "Select a valid image format (PNG, JPG)" }));
      setFormData((prev) => ({ ...prev, imagen: null }));
      e.target.value = null; // resetea el input
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imagen: "Image must be less than 5MB" }));
      setFormData((prev) => ({ ...prev, imagen: null }));
      e.target.value = null; // resetea el input
      return;
    }

    setErrors((prev) => ({ ...prev, imagen: null }));
    setFormData((prev) => ({ ...prev, imagen: file }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full">
      <div className="bg-blue-700 px-6 py-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? "Update Event" : "Create Event"}
        </h2>

        <button
          onClick={onCancel}
          className="text-white hover:bg-blue-800 p-2 rounded-lg flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium">
              Event Name {isEditing ? "" : "*"}
            </label>
            <div className="relative mt-1 group">
              <input
                type="text"
                value={formData.nombre}
                disabled={isEditing}
                onChange={(e) =>
                  handleChange("nombre", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg ${
                  isEditing 
                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed" 
                    : "border-gray-300"
                }`}
              />
              {isEditing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-red-500 transition-colors" title="Name cannot be modified">
                  <Ban size={18} />
                </div>
              )}
            </div>
            <ErrorMsg name="nombre" />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium">
              Date *
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                handleChange("fecha", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300"
            />
            <ErrorMsg name="fecha" />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium">
              Time *
            </label>
            <input
              type="time"
              value={formData.hora}
              onChange={(e) =>
                handleChange("hora", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border rounded-lg border-gray-300"
            />
            <ErrorMsg name="hora" />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium">
              Department *
            </label>
            <Autocomplete
              options={departmentOptions}
              value={formData.departamento_id}
              onChange={handleDepartmentChange}
              placeholder="Select department"
            />
            <ErrorMsg name="departamento_id" />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium">
              City *
            </label>
            <Autocomplete
              options={cityOptions}
              value={formData.ciudad_id}
              onChange={(val) =>
                handleChange("ciudad_id", Number(val))
              }
              disabled={!formData.departamento_id}
              placeholder="Select city"
            />
            <ErrorMsg name="ciudad_id" />
          </div>

          {/* Lugar */}
          <div>
            <label className="block text-sm font-medium">
              Location *
            </label>
            <input
              type="text"
              value={formData.lugar}
              onChange={(e) =>
                handleChange("lugar", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <ErrorMsg name="lugar" />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium">
              Category *
            </label>
            <Autocomplete
              options={categoryOptions}
              value={formData.categoria_id}
              onChange={(val) =>
                handleChange("categoria_id", val)
              }
              placeholder="Select category"
            />
            <ErrorMsg name="categoria_id" />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              min="0"
              value={formData.valor}
              onChange={(e) =>
                handleChange("valor", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <ErrorMsg name="valor" />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium">
              Event Image (PNG, JPG, Max: 5MB)
            </label>
            <div className="mt-1 flex flex-col gap-3">
              {isEditing && formData.imagen_url && !formData.imagen && (
                <div className="w-full flex items-center border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <div className="h-12 w-12 shrink-0 rounded overflow-hidden">
                    <img src={formData.imagen_url} alt="Current event" className="h-full w-full object-cover" />
                  </div>
                  <span className="ml-3 text-xs text-gray-500 flex-1">Current image. Upload a new one to replace it.</span>
                </div>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>
            
            {formData.imagen && (
              <span className="text-xs text-green-600 mt-1 block">Selected file: {formData.imagen.name}</span>
            )}
            
            <ErrorMsg name="imagen" />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">
              Description
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                handleChange("descripcion", e.target.value)
              }
              rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

        </div>

        <div className="pt-6 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
          >
            <Save size={18} className="mr-2" />
            {isEditing ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;