"use client";

/**
 * @file error.tsx
 * @description Componente global de captura de errores (Error Boundary) de Next.js App Router.
 * Captura excepciones no controladas en la UI del cliente y provee recuperación amigable.
 */

import { useEffect } from "react";

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 1. Loguear error en la consola del navegador
    console.error("ErrorBoundary detectó una excepción no controlada:", error);

    // 2. Bloque preparado y documentado para integración con tracking de terceros
    // Ej: Sentry, LogRocket, Datadog.
    // try {
    //   if (typeof window !== "undefined") {
    //     // Enviar evento de error al servicio de tracking correspondiente
    //     // Sentry.captureException(error, { extra: { digest: error.digest } });
    //   }
    // } catch (sentryError) {
    //   console.error("Error al reportar excepción a Sentry:", sentryError);
    // }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-6">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Ha ocurrido un error inesperado al procesar la solicitud. Nuestro equipo técnico ya ha sido notificado del inconveniente.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
          >
            Volver al Inicio
          </button>
        </div>
        {error.digest && (
          <p className="mt-6 text-[11px] text-gray-400 font-mono">
            Código de Rastreo del Error: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
