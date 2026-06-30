"use client";

/**
 * @file useWebForm.ts
 * @description Hook de React para encapsular el envío interactivo de formularios (Webforms)
 * a través de nuestro proxy API local.
 */

import { useState, useTransition } from "react";
import { WebFormResponse } from "@/app/api/webforms/route";

export interface WebFormSubmitResult {
  readonly success: boolean;
  readonly data?: any;
  readonly error?: string;
}

export function useWebForm() {
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();

  /**
   * Envía los datos del formulario al endpoint API local.
   * 
   * @param body - Objeto de datos del formulario (ej. nombre, email, etc.)
   * @param webformId - Identificador único del formulario en el CMS
   */
  const submitForm = async (body: Record<string, any>, webformId: string): Promise<WebFormSubmitResult> => {
    setResult(null);
    setError(null);

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const response = await fetch("/api/webforms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              webform_id: webformId,
              body,
            }),
          });

          const resData = (await response.json()) as WebFormResponse;

          if (!response.ok || !resData.success) {
            const errorMsg = resData.error || `Error del servidor: ${response.status}`;
            setError(errorMsg);
            resolve({ success: false, error: errorMsg });
          } else {
            setResult(resData.data);
            resolve({ success: true, data: resData.data });
          }
        } catch (err: any) {
          const errorMsg = err?.message || "Ocurrió un error inesperado al enviar el formulario.";
          setError(errorMsg);
          resolve({ success: false, error: errorMsg });
        }
      });
    });
  };

  return {
    loading,
    result,
    error,
    submitForm,
  };
}
