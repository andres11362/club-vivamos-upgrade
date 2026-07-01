"use client";

/**
 * @file index.tsx
 * @description Componente de formulario para configurar datos personales de la cuenta (EditDataForm).
 * Sigue los estándares del proyecto (SOLID, TypeScript, React 19/Next 16, Tailwind CSS).
 * Aplica validaciones del helper `validation.ts` e integra el listado dinámico de documentos.
 */

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/atoms/button";
import { Input, Select } from "@/components/atoms/input";
import { useAuth } from "@/context/AuthContext";
import { validateString, validateDocument, validateLengthDocument } from "@/utils/validation";
import { DocumentOptions } from "@/utils/documentOptions";
import Link from "next/link";

const EditDataForm = () => {
  const { state, updateUser } = useAuth();
  const { user, loading, error } = state;
  const [success, setSuccess] = useState(false);

  // Estados locales para los campos
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    document_type_id: "",
    document: "",
  });

  // Estados para errores de validación
  const [fieldErrors, setFieldErrors] = useState<{
    first_name?: string;
    last_name?: string;
    document_type_id?: string;
    document?: string;
  }>({});

  // Cargar datos del usuario en el formulario cuando estén disponibles (Hydration)
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        document_type_id: user.document_type_id ? String(user.document_type_id) : "",
        document: user.document || "",
      });
    }
  }, [user]);

  // Manejo de cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpieza reactiva del error del campo modificado
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validaciones del formulario de configuración de datos personales
  const validateForm = (): boolean => {
    let isValid = true;
    const tempErrors: typeof fieldErrors = {};

    // 1. Validar Nombres
    const nameErr = validateString(formData.first_name, "Nombres");
    if (nameErr !== "") {
      tempErrors.first_name = nameErr;
      isValid = false;
    } else if (formData.first_name.length < 3 || formData.first_name.length > 30) {
      tempErrors.first_name = "Este campo debe tener minimo 3 caracteres y maximo 30";
      isValid = false;
    }

    // 2. Validar Apellidos
    const lastnameErr = validateString(formData.last_name, "Apellidos");
    if (lastnameErr !== "") {
      tempErrors.last_name = lastnameErr;
      isValid = false;
    } else if (formData.last_name.length < 3 || formData.last_name.length > 30) {
      tempErrors.last_name = "Este campo debe tener minimo 3 caracteres y maximo 30";
      isValid = false;
    }

    // 3. Validar Documento
    const docErr = validateDocument(formData.document, formData.document_type_id);
    if (docErr !== "") {
      tempErrors.document = docErr;
      isValid = false;
    } else {
      const lenErr = validateLengthDocument(formData.document, formData.document_type_id);
      if (lenErr !== "") {
        tempErrors.document = lenErr;
        isValid = false;
      }
    }

    setFieldErrors(tempErrors);
    return isValid;
  };

  // Guardar cambios del perfil
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    if (validateForm()) {
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
        console.error("Error al actualizar datos personales del perfil:", err);
      }
    } else {
      console.log("Validación de configuración de datos fallida:", fieldErrors);
    }
  };

  // Procesamiento seguro del mensaje de error del servidor
  const errorMessage = error
    ? typeof error === "string"
      ? error
      : error.message || error.error_description || JSON.stringify(error)
    : null;

  // Obtener opciones de documento a través del helper común
  const docOptions = DocumentOptions().map((opt) => ({
    value: opt.value,
    label: opt.name,
  }));

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-500 font-medium animate-pulse">Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center items-center">
      <h1 className="text-xl md:text-2xl font-bold text-[#03091e] uppercase text-center mb-8">
        Configurar Mis Datos
      </h1>

      {errorMessage && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {success && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-xs font-semibold border border-green-200 animate-fadeIn">
          ¡Tus datos han sido actualizados con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        {/* Nombres Input */}
        <div className="w-full">
          <Input
            label="Nombres"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            type="text"
            disabled={loading}
            className={fieldErrors.first_name ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
          />
          {fieldErrors.first_name && (
            <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
              {fieldErrors.first_name}
            </span>
          )}
        </div>

        {/* Apellidos Input */}
        <div className="w-full">
          <Input
            label="Apellidos"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            type="text"
            disabled={loading}
            className={fieldErrors.last_name ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
          />
          {fieldErrors.last_name && (
            <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
              {fieldErrors.last_name}
            </span>
          )}
        </div>

        {/* Tipo y N° de Documento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="w-full">
            <Select
              label="Tipo de documento"
              name="document_type_id"
              value={formData.document_type_id}
              onChange={handleChange}
              disabled={loading}
              options={docOptions}
              className={fieldErrors.document_type_id ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            />
            {fieldErrors.document_type_id && (
              <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                {fieldErrors.document_type_id}
              </span>
            )}
          </div>

          <div className="w-full">
            <Input
              label="N° de documento"
              name="document"
              value={formData.document}
              onChange={handleChange}
              type="text"
              disabled={loading}
              className={fieldErrors.document ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            />
            {fieldErrors.document && (
              <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                {fieldErrors.document}
              </span>
            )}
          </div>
        </div>

        {/* Correo Electrónico (No editable, informativo) */}
        <Input
          label="Correo electrónico"
          value={user?.email || ""}
          type="email"
          disabled
        />

        {/* Cambio de Contraseña Link */}
        <div className="flex flex-col gap-1.5 mt-1 select-none">
          <span className="text-sm text-gray-600">Contraseña</span>
          <Link
            href="/zona-usuario/cambiar-contrasena"
            className="text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline w-max"
          >
            Cambiar Contraseña »
          </Link>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} className="max-w-[250px]">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDataForm;
