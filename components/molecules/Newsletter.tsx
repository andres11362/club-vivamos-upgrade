"use client";

/**
 * @file Newsletter.tsx
 * @description Componente de cliente moderno para la suscripción al boletín de noticias (Newsletter).
 * Consume el hook de envío genérico de formularios (useWebForm) y se estiliza dinámicamente con Tailwind CSS.
 */

import React, { useState, useEffect, FormEvent } from "react";
import { useWebForm } from "@/hooks/useWebForm";

// Configuración por defecto para enlaces del Club en caso de ausencia de variables de entorno
const DEFAULT_SAC = {
  TERMS: {
    URL: "http://mailpush.eltiempo.com/Terminos%20y%20condiciones/Politicas.pdf",
  },
  AUTH: {
    URL: "https://www.eltiempo.com/legal/AUTORIZACION_DE_TRATAMIENTO_DE_DATOS_PERSONALES_CEET.pdf",
  },
  PROCESSING_POLICY: {
    URL: "https://www.eltiempo.com/legal/POLITICA_DE_TRATAMIENTO_Y_PROCEDIMIENTOS_EN_MATERIA_DE_PROTECCION_DE_DATOS_PERSONALES.pdf",
  },
  DATA_POLICY: {
    URL: "https://www.eltiempo.com/politica-de-cookies",
  },
};

const getSacConfig = () => {
  if (typeof window === "undefined" || !process.env.SAC) {
    return DEFAULT_SAC;
  }
  try {
    return JSON.parse(process.env.SAC);
  } catch (e) {
    return DEFAULT_SAC;
  }
};

export default function Newsletter() {
  const { loading, result, error, submitForm } = useWebForm();

  // Estados locales para los campos del formulario
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [politics, setPolitics] = useState(false);

  // Estados locales para validaciones inline
  const [emailError, setEmailError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");

  // Estados de visualización de alertas con expiración de 4 segundos
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");

  const SAC = getSacConfig();

  // Escuchar resultados de éxito del hook unificado
  useEffect(() => {
    if (result) {
      setShowSuccess(true);
      setShowError(false);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // Escuchar errores devueltos por el servidor
  useEffect(() => {
    if (error) {
      setAlertErrorMessage(error);
      setShowError(true);
      setShowSuccess(false);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError("");
    setCheckboxError("");

    if (!email.trim()) {
      setEmailError("Por favor ingresa un email");
      isValid = false;
    } else {
      const pattern =
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
      if (!pattern.test(email)) {
        setEmailError("Ingresa un email válido");
        isValid = false;
      }
    }

    if (!terms || !politics) {
      setCheckboxError(
        "Recuerda aceptar los Términos y Condiciones, la Política de Tratamiento de Datos y las Políticas de Navegación"
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate()) {
      const res = await submitForm({ email }, "newsletter");
      if (res.success) {
        // Reiniciar estados del formulario de forma puramente declarativa
        setEmail("");
        setTerms(false);
        setPolitics(false);
      }
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Alerta de Éxito */}
      {showSuccess && (
        <div
          className="flex items-center gap-3 p-4 mb-4 text-green-800 dark:text-green-300 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 shadow-sm transition-all duration-300 animate-fadeIn"
          role="alert"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            Tu suscripción a nuestros boletines ha sido exitosa.
          </span>
        </div>
      )}

      {/* Alerta de Error */}
      {showError && (
        <div
          className="flex items-center gap-3 p-4 mb-4 text-red-800 dark:text-red-300 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 shadow-sm transition-all duration-300 animate-fadeIn"
          role="alert"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            {alertErrorMessage || "Ha ocurrido un error, por favor intenta nuevamente."}
          </span>
        </div>
      )}

      {/* Tarjeta Principal del Newsletter */}
      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center leading-snug">
          Sé el primero en recibir la información sobre ofertas y promociones de temporada
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grupo de entrada Email y Botón */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-grow">
              <input
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                type="email"
                name="email"
                id="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                disabled={loading}
              />
              {emailError && (
                <span className="text-xs text-red-500 mt-1 block px-1">
                  {emailError}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap min-w-[180px]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Suscribiendo...
                </>
              ) : (
                "Suscribirme al boletín"
              )}
            </button>
          </div>

          {/* Políticas y Términos */}
          <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-6">
            {/* Términos y Condiciones */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setCheckboxError("");
                }}
                disabled={loading}
                className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 cursor-pointer bg-gray-50 dark:bg-gray-800"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer"
              >
                He leído, entendido y autorizo los{" "}
                <a
                  href={SAC.TERMS.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Términos y Condiciones
                </a>{" "}
                de este portal.
              </label>
            </div>

            {/* Tratamiento de Datos */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="politics"
                id="politics"
                checked={politics}
                onChange={(e) => {
                  setPolitics(e.target.checked);
                  setCheckboxError("");
                }}
                disabled={loading}
                className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 cursor-pointer bg-gray-50 dark:bg-gray-800"
              />
              <label
                htmlFor="politics"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer"
              >
                <a
                  href={SAC.AUTH.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Autorizo
                </a>{" "}
                el tratamiento de mis datos personales conforme con la{" "}
                <a
                  href={SAC.PROCESSING_POLICY.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Política de Tratamiento de Datos de CASA EDITORIAL EL TIEMPO S.A.
                </a>{" "}
                y su{" "}
                <a
                  href={SAC.DATA_POLICY.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Política de Datos de Navegación/Cookies
                </a>
                , las cuales declaro que he leído y entendido.
              </label>
            </div>

            {/* Mensaje de Error de Checkboxes */}
            {checkboxError && (
              <span className="text-xs text-red-500 mt-2 block animate-fadeIn font-medium">
                {checkboxError}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
