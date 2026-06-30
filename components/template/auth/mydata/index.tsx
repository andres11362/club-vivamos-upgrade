'use client';

import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input, Select } from '@/components/atoms/input';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function MyDataTemplate() {
  const { state, updateUser } = useAuth();
  const { user, loading, error } = state;
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    first_name: '',
    last_name: '',
    document_type_id: '',
    document: '',
  });

  // Hydrate form inputs once user data is available
  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        document_type_id: user.document_type_id ? String(user.document_type_id) : '',
        document: user.document || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        document_type_id: formData.document_type_id,
        document: formData.document,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  };

  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message || error.error_description || JSON.stringify(error)
    : null;

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-500 font-medium">Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-gray-50/50">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
          
          {/* LADO IZQUIERDO: Imagen (Oculto en móvil) */}
          <div className="hidden md:block w-full md:w-1/2 relative p-4 lg:p-6">
            <div className="w-full h-full relative overflow-hidden rounded-2xl rounded-br-[5rem] md:rounded-br-[6rem] shadow-sm">
              <img 
                src="/configurar-datos-bg.jpg" 
                alt="Usuario configurando datos" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-[#2c2b5e]/10" />
            </div>
          </div>

          {/* LADO DERECHO: Formulario de Datos */}
          <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center items-center">
            
            <h1 className="text-xl md:text-2xl font-bold text-[#03091e] uppercase text-center mb-8">
              Configurar Mis Datos
            </h1>

            {errorMessage && (
              <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                {errorMessage}
              </div>
            )}

            {success && (
              <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-xs font-semibold border border-green-200">
                ¡Tus datos han sido actualizados con éxito!
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
              
              <Input 
                label="Nombres" 
                name="first_name"
                value={formData.first_name} 
                onChange={handleChange}
                type="text" 
                required
                disabled={loading}
              />
              
              <Input 
                label="Apellidos" 
                name="last_name"
                value={formData.last_name} 
                onChange={handleChange}
                type="text" 
                required
                disabled={loading}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Select 
                  label="Tipo de documento" 
                  name="document_type_id"
                  value={formData.document_type_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  options={[
                     { value: '1', label: 'Cédula de Ciudadanía' },
                     { value: '3', label: 'Cédula de Extranjería' }
                  ]} 
                />
                
                <Input 
                  label="N° de documento" 
                  name="document"
                  value={formData.document} 
                  onChange={handleChange}
                  type="text" 
                  required
                  disabled={loading}
                />
              </div>

              <Input 
                label="Correo electrónico" 
                value={user?.email || ''} 
                type="email" 
                disabled 
              />

              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-sm text-gray-600">Contraseña</span>
                <Link href="/zona-usuario/cambiar-contrasena" className="text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline w-max">
                  Cambiar Contraseña »
                </Link>
              </div>

              <div className="mt-6 flex justify-center">
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} className="max-w-[250px]">
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}