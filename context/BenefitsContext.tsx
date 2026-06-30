/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { getCategory } from "../utils/JSONObjects";

// --- Interfaces de Configuración de Entorno ---

export interface BacoConfig {
  readonly "X-API-KEY"?: string;
  readonly BASE_DOMAIN: string;
  readonly BENEFITS: {
    readonly HEADQUARTERS: string;
    readonly DETAIL: string;
    readonly LIST: string;
    readonly FEATURED: string;
    readonly FEATURED_BY_SEGMENT: string;
    readonly SEGMENT: string;
    readonly CUSTOM_BLOCKS: string;
  };
}

// --- Interfaces de Datos y Estado ---

export interface BranchInfo {
  readonly id: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly address?: string;
  readonly phone?: string;
  readonly [key: string]: any;
}

export interface CityHeadquarters {
  readonly city: string;
  readonly info: readonly BranchInfo[];
}

export type HeadquartersState = Record<string, CityHeadquarters>;

export interface Benefit {
  readonly id?: string | number; // Utilizado en detalle
  readonly benefitId?: string | number; // Utilizado en listados/resultados
  readonly title?: string;
  readonly discount?: string;
  readonly lead?: string;
  readonly alliedName?: string;
  readonly categoryId?: number;
  readonly categoryName?: string;
  readonly segmentId?: number;
  readonly titleseo?: string;
  readonly imageBenefit?: {
    readonly medium?: string;
    readonly [key: string]: any;
  };
  readonly dataCount?: number; // Compatibilidad con componentes legacy
  readonly [key: string]: any;
}

export interface BenefitsState {
  readonly searchResult: readonly Benefit[];
  readonly featured: readonly Benefit[];
  readonly totalCount: number;
  readonly loading: boolean;
  readonly error: string | null;
}


// --- Firma del Valor del Contexto ---

export interface BenefitsContextValue {
  readonly state: BenefitsState;
  readonly getSearchResult: (
    params: {
      category: string;
      keyword?: string | null;
      from: number;
      size?: number;
    },
    more?: boolean
  ) => Promise<{ statusCode: number }>;
  readonly getFeatured: (params: { category: string }) => Promise<{ statusCode: number }>;
  readonly clearSearchResult: () => void;
  readonly clearFeatured: () => void;
}

// --- Getters Seguros para Variables de Entorno (SSR & Client Safe) ---

const getBacoConfig = (): BacoConfig => {
  try {
    const raw = process.env.BACO || process.env.NEXT_PUBLIC_BACO;
    return raw ? JSON.parse(raw) : ({} as BacoConfig);
  } catch {
    return {} as BacoConfig;
  }
};

// Carga dinámica del agente HTTPS para evitar errores de empaquetado en navegador
const getHttpsAgent = () => {
  if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
    try {
      const https = require("https");
      return new https.Agent({ rejectUnauthorized: false });
    } catch {
      return undefined;
    }
  }
  return undefined;
};


// --- Contexto de React ---

const BenefitsContext = createContext<BenefitsContextValue | undefined>(undefined);

// --- Proveedor del Contexto (BenefitsProvider) ---

export const BenefitsProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BenefitsState>({
    searchResult: [],
    featured: [],
    totalCount: 0,
    loading: false,
    error: null,
  });

  /**
   * Obtiene la información de resultados de búsqueda del servicio BACO.
   * Administra la paginación inmutable concatenando nuevos resultados si 'more' es true.
   */
  const getSearchResult = useCallback(
    async (
      {
        category,
        keyword = null,
        from,
        size = 10,
      }: {
        category: string;
        keyword?: string | null;
        from: number;
        size?: number;
      },
      more = false
    ): Promise<{ statusCode: number }> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const BACO = getBacoConfig();
      if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.LIST) {
        setState((prev) => ({ ...prev, loading: false, error: "Invalid BACO configuration" }));
        return { statusCode: 500 };
      }

      // Replicar construcción de consultas de la acción original
      const fromQuery = `?from=${from}`;
      const sizeQuery = `&size=${size}`;
      const categoryIdQuery = `&categoryId=${getCategory(category).id}`;
      const keywordQuery = keyword ? `&keyword=${keyword}` : `&keyword=null`;
      let categoryIdOrKeywordQuery = "";

      if (category === "buscar") {
        categoryIdOrKeywordQuery = keywordQuery;
      } else if (category != null) {
        categoryIdOrKeywordQuery = categoryIdQuery;
      }

      const url = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.LIST}${fromQuery}${sizeQuery}${categoryIdOrKeywordQuery}`;
      const agent = getHttpsAgent();

      try {
        const response = await axios.get<{ code: number; data: Benefit[]; dataCount?: number }>(url, {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          httpsAgent: agent,
        });

        const rawData = response.data.data || [];
        const dataCount = response.data.dataCount ?? rawData.length;

        if (more) {
          // Si es paginación ("cargar más"), concatenamos los nuevos resultados de forma inmutable
          setState((prev) => {
            const accumulated = [...prev.searchResult, ...rawData];
            
            // Garantizar la inyección de dataCount en el primer elemento del arreglo acumulado
            // para mantener compatibilidad con los componentes legacy (ej. Results.js)
            const resolvedList = accumulated.map((item, idx) => {
              if (idx === 0) {
                return { ...item, dataCount };
              }
              return item;
            });

            return {
              ...prev,
              searchResult: resolvedList,
              totalCount: dataCount,
              loading: false,
              error: null,
            };
          });
        } else {
          // Primera carga: se inyecta dataCount al primer elemento del arreglo
          const updatedData = [...rawData];
          if (updatedData.length > 0 && updatedData[0]) {
            updatedData[0] = {
              ...updatedData[0],
              dataCount,
            };
          }

          setState((prev) => ({
            ...prev,
            searchResult: updatedData,
            totalCount: dataCount,
            loading: false,
            error: null,
          }));
        }

        return { statusCode: response.data.code };
      } catch (err: any) {
        console.error("[BenefitsContext getSearchResult] Error:", err.message);
        const status = err.response?.status || 500;
        const errorMessage = err.response?.data || err.message;
        
        setState((prev) => ({
          ...prev,
          loading: false,
          error: typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
        }));

        return { statusCode: status };
      }
    },
    []
  );

  /**
   * Obtiene la lista de beneficios destacados para una categoría determinada.
   */
  const getFeatured = useCallback(
    async ({ category }: { category: string }): Promise<{ statusCode: number }> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const BACO = getBacoConfig();
      if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.FEATURED) {
        setState((prev) => ({ ...prev, loading: false, error: "Invalid BACO configuration" }));
        return { statusCode: 500 };
      }

      const url = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.FEATURED}`;
      const data = {
        categoryId: getCategory(category).id,
        subscriber: 0, // 0: clásico, 1: preferente
      };
      const agent = getHttpsAgent();

      try {
        const response = await axios.get<{ code: number; data: Benefit[] }>(url, {
          params: data,
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          httpsAgent: agent,
        });

        const payload = response.data.data || [];

        setState((prev) => ({
          ...prev,
          // Si la categoría no tiene destacados, se conserva el estado actual (lógica idéntica al reducer original)
          featured: payload.length > 0 ? payload : prev.featured,
          loading: false,
          error: null,
        }));

        return { statusCode: response.data.code };
      } catch (err: any) {
        console.error("[BenefitsContext getFeatured] Error:", err.message);
        const status = err.response?.status || 500;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));

        return { statusCode: status };
      }
    },
    []
  );

  /**
   * Limpia los resultados de búsqueda.
   */
  const clearSearchResult = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchResult: [],
      totalCount: 0,
    }));
  }, []);

  /**
   * Limpia los beneficios destacados.
   */
  const clearFeatured = useCallback(() => {
    setState((prev) => ({
      ...prev,
      featured: [],
    }));
  }, []);

  const value: BenefitsContextValue = {
    state,
    getSearchResult,
    getFeatured,
    clearSearchResult,
    clearFeatured,
  };

  return <BenefitsContext.Provider value={value}>{children}</BenefitsContext.Provider>;
};

// --- Hook de Uso del Contexto ---

/**
 * Hook personalizado para consumir el estado interactivo de los beneficios en componentes del cliente.
 */
export const useBenefits = (): BenefitsContextValue => {
  const context = useContext(BenefitsContext);
  if (context === undefined) {
    throw new Error("useBenefits must be used within a BenefitsProvider");
  }
  return context;
};
