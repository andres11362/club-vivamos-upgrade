"use client";

/**
 * @file SavingsContext.tsx
 * @description Proveedor de contexto React para la interactividad de la página de Mis Ahorros.
 * Integra hidratación instantánea y peticiones dinámicas en cliente mediante Server Actions.
 */

import React, { createContext, useContext, useState, useTransition } from "react";
import { fetchSavingsData, SavingsResponse } from "@/services/savingsService";

interface SavingsContextType {
  readonly data: SavingsResponse;
  readonly loading: boolean;
  readonly errorMessage: string | null;
  readonly currentMonths: number;
  readonly updateRange: (months: number) => Promise<void>;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

interface SavingsProviderProps {
  readonly children: React.ReactNode;
  readonly initialData: SavingsResponse;
  readonly documentType: string | number;
  readonly documentNumber: string;
}

export const SavingsProvider: React.FC<SavingsProviderProps> = ({
  children,
  initialData,
  documentType,
  documentNumber,
}) => {
  const [data, setData] = useState<SavingsResponse>(initialData);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialData.mensajeError || null);
  const [currentMonths, setCurrentMonths] = useState<number>(12);
  const [loading, startTransition] = useTransition();

  const updateRange = async (months: number): Promise<void> => {
    // Si ya estamos consultando los mismos meses, omitimos petición
    if (months === currentMonths) return;

    setErrorMessage(null);
    setCurrentMonths(months);

    // useTransition gestiona de forma nativa el estado reactivo 'loading' en React 19
    startTransition(async () => {
      try {
        const result = await fetchSavingsData(documentType, documentNumber, months);
        if (result.mensajeError) {
          setErrorMessage(result.mensajeError);
        } else {
          setData(result);
        }
      } catch (err: any) {
        setErrorMessage(err?.message || "Ocurrió un error inesperado al actualizar los ahorros.");
      }
    });
  };

  return (
    <SavingsContext.Provider
      value={{
        data,
        loading,
        errorMessage,
        currentMonths,
        updateRange,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = (): SavingsContextType => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error("useSavings debe ser utilizado dentro de un SavingsProvider");
  }
  return context;
};
