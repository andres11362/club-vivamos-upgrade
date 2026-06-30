/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import axios from "axios";

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

// --- Firma de Resultados de Helpers SSR ---

export interface BenefitDetailResult {
  readonly data: Benefit | null;
  readonly statusCode: number;
  readonly error?: string;
}

export interface HeadquartersResult {
  readonly data: HeadquartersState;
  readonly statusCode: number;
  readonly error?: string;
}

// --- Getters Seguros para Variables de Entorno (SSR Safe) ---

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

// --- Helper de Agrupación Eficiente con Hash Maps ---

/**
 * Agrupa y normaliza las sedes por ciudad utilizando un Hash Map (Map).
 * Conserva de manera explícita las primeras 4 ciudades de forma ordenada y
 * consolida las restantes bajo la categoría unificada "OTRAS CIUDADES".
 * 
 * @param rawHeadquarters - Listado crudo de sedes por ciudad retornado por el servicio.
 * @returns Un objeto indexado por strings ("0" a "4") con las ciudades agrupadas de forma inmutable.
 */
export function regroupHeadquarters(rawHeadquarters: readonly CityHeadquarters[]): HeadquartersState {
  const result: Record<string, CityHeadquarters> = {};

  if (!rawHeadquarters || rawHeadquarters.length === 0) {
    return result;
  }

  // Paso 1: Usamos una estructura de Map (Hash Map en JS) para agrupar
  // acumulando los branches de forma lineal y normalizando los nombres
  const cityMap = new Map<string, BranchInfo[]>();

  for (const item of rawHeadquarters) {
    const cityName = item.city.trim().toUpperCase();
    if (!cityName) continue;

    if (!cityMap.has(cityName)) {
      cityMap.set(cityName, []);
    }

    const currentBranches = cityMap.get(cityName)!;
    if (Array.isArray(item.info)) {
      currentBranches.push(...item.info);
    }
  }

  // Paso 2: Extraer las primeras 4 ciudades y combinar el resto
  let cityIndex = 0;
  const otherCitiesBranches: BranchInfo[] = [];

  for (const [cityName, branches] of cityMap.entries()) {
    if (cityIndex < 4) {
      result[String(cityIndex)] = {
        city: cityName,
        info: branches,
      };
      cityIndex++;
    } else {
      otherCitiesBranches.push(...branches);
    }
  }

  // Si existen sedes adicionales a las primeras 4 ciudades, se agrupan en el índice "4"
  if (otherCitiesBranches.length > 0) {
    result["4"] = {
      city: "OTRAS CIUDADES",
      info: otherCitiesBranches,
    };
  }

  return result;
}

// --- Helpers Asíncronos Puros para SSR (React Server Components) ---

/**
 * Función asíncrona pura para obtener la información de detalle de un beneficio.
 * Diseñada para ser importada y llamada directamente en Server Components de Next.js.
 */
export async function getDetail(query: { benefit_id?: string | number }): Promise<BenefitDetailResult> {
  const benefit_id = query.benefit_id;
  if (!benefit_id) {
    return { data: null, statusCode: 400, error: "Missing benefit_id parameter" };
  }

  const BACO = getBacoConfig();
  if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.DETAIL) {
    return { data: null, statusCode: 500, error: "Invalid BACO configuration" };
  }

  const url = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.DETAIL}${benefit_id}`;
  const agent = getHttpsAgent();

  try {
    const response = await axios.get<{ code: number; data: Benefit }>(url, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": BACO["X-API-KEY"] || "",
      },
      httpsAgent: agent,
    });

    return {
      data: response.data.data,
      statusCode: response.data.code,
    };
  } catch (err: any) {
    console.error(`[SSR getDetail] Error fetching benefit ID ${benefit_id}:`, err.message);
    const status = err.response?.status || 500;
    return {
      data: null,
      statusCode: status,
      error: err.response?.data?.message || err.message,
    };
  }
}

/**
 * Función asíncrona pura para obtener y reagrupar las sedes de un beneficio por ciudad.
 * Diseñada para ser importada y llamada directamente en Server Components de Next.js.
 */
export async function getHeadquartersByBenefit(query: { benefit_id?: string | number }): Promise<HeadquartersResult> {
  const benefit_id = query.benefit_id;
  if (!benefit_id) {
    return { data: {}, statusCode: 400, error: "Missing benefit_id parameter" };
  }

  const BACO = getBacoConfig();
  if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.HEADQUARTERS) {
    return { data: {}, statusCode: 500, error: "Invalid BACO configuration" };
  }

  const url = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.HEADQUARTERS}${benefit_id}`;
  const agent = getHttpsAgent();

  try {
    const response = await axios.get<{ code: number; data: CityHeadquarters[] }>(url, {
      headers: {
        Accept: "application/json",
      },
      httpsAgent: agent,
    });

    const grouped = regroupHeadquarters(response.data.data || []);

    return {
      data: grouped,
      statusCode: response.data.code,
    };
  } catch (err: any) {
    console.error(`[SSR getHeadquartersByBenefit] Error fetching headquarters for benefit ID ${benefit_id}:`, err.message);
    const status = err.response?.status || 500;
    return {
      data: {},
      statusCode: status,
      error: err.response?.data?.message || err.message,
    };
  }
}
