/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Servicio de Servidor para la Página de Inicio (Home)
 * 
 * Reemplaza por completo el módulo de Redux 'home', consolidando la lógica de consulta
 * a destacados por segmento y bloques personalizados con Next.js 15 App Router.
 */

// --- Interfaces de Configuración de Entorno ---

export interface BacoConfig {
  readonly "X-API-KEY"?: string;
  readonly BASE_DOMAIN: string;
  readonly BENEFITS: {
    readonly FEATURED_BY_SEGMENT: string;
    readonly CUSTOM_BLOCKS: string;
    readonly [key: string]: any;
  };
}

// --- Interfaces de Datos ---

export interface BenefitFeatured {
  readonly benefitId: string | number;
  readonly title: string;
  readonly discount: string;
  readonly lead: string;
  readonly externalLink: string;
  readonly categoryId: number;
  readonly segmentId: number;
  readonly titleseo: string;
  readonly imageBenefit?: {
    readonly medium?: string;
    readonly [key: string]: any;
  };
  readonly [key: string]: any;
}

export interface CustomBlockItem {
  readonly block: string | number;
  readonly siteUrl: string;
  readonly description: string;
  readonly title: string;
  readonly imageCustomBanner: string;
  readonly [key: string]: any;
}

// --- Beneficios de Contingencia (Fallback) ---

export const FALLBACK_FEATURED_BENEFITS: readonly BenefitFeatured[] = [
  {
    benefitId: "default-1",
    title: "Beneficios del Club EL TIEMPO",
    discount: "Descuentos Exclusivos",
    lead: "Disfruta de las mejores marcas y ahorra todos los días",
    externalLink: "",
    categoryId: 1,
    segmentId: 2,
    titleseo: "beneficios-club-el-tiempo",
  },
];

// --- Getters Seguros para Variables de Entorno (Server Safe) ---

const getBacoConfig = (): BacoConfig => {
  try {
    const raw = process.env.BACO || process.env.NEXT_PUBLIC_BACO;
    return raw ? JSON.parse(raw) : ({} as BacoConfig);
  } catch {
    return {} as BacoConfig;
  }
};

// --- Funciones del Servicio de Servidor ---

/**
 * Obtiene la lista de beneficios destacados según el segmento del usuario.
 * Aplica reglas de negocio e inyecta un listado de contingencia si la respuesta es vacía.
 * 
 * @param segmentId - ID del segmento del afiliado.
 * @returns Promesa con el listado de destacados.
 */
export async function getFeaturedBySegment(segmentId: number): Promise<BenefitFeatured[]> {
  // Regla de negocio heredada: Si no es 3, forzar a 2
  const resolvedSegmentId = segmentId !== 3 ? 2 : 3;

  const BACO = getBacoConfig();
  if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.FEATURED_BY_SEGMENT) {
    throw new Error("BACO environment variables are not configured.");
  }

  const baseUrl = BACO.BASE_DOMAIN.endsWith("/") ? BACO.BASE_DOMAIN : `${BACO.BASE_DOMAIN}/`;
  const url = `${baseUrl}${BACO.BENEFITS.FEATURED_BY_SEGMENT}${resolvedSegmentId}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
  };

  if (BACO["X-API-KEY"]) {
    headers["X-API-KEY"] = BACO["X-API-KEY"];
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      // Next.js 15: caché por 1 hora
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured benefits, status: ${response.status}`);
    }

    const json = await response.json();
    const data = json.data || [];

    // Lógica de contingencia ante listado vacío
    if (data.length === 0) {
      console.warn(`[homeService] API returned empty featured benefits for segment ${resolvedSegmentId}. Using fallback.`);
      return [...FALLBACK_FEATURED_BENEFITS];
    }

    return data;
  } catch (error: any) {
    console.error(`[homeService] Error in getFeaturedBySegment:`, error.message);
    throw error; // Propaga excepciones limpias para ser capturadas por error.tsx
  }
}

/**
 * Obtiene los bloques personalizados y banners de alianzas preferenciales.
 * 
 * @returns Promesa con los ítems publicitarios.
 */
export async function getCustomBlocks(): Promise<CustomBlockItem[]> {
  const BACO = getBacoConfig();
  if (!BACO || !BACO.BASE_DOMAIN || !BACO.BENEFITS?.CUSTOM_BLOCKS) {
    throw new Error("BACO environment variables are not configured.");
  }

  const baseUrl = BACO.BASE_DOMAIN.endsWith("/") ? BACO.BASE_DOMAIN : `${BACO.BASE_DOMAIN}/`;
  const url = `${baseUrl}${BACO.BENEFITS.CUSTOM_BLOCKS}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Cache-Control": "no-cache",
  };

  if (BACO["X-API-KEY"]) {
    headers["X-API-KEY"] = BACO["X-API-KEY"];
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      // Next.js 15: caché por 1 hora
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch custom blocks, status: ${response.status}`);
    }

    const json = await response.json();
    return json.data || [];
  } catch (error: any) {
    console.error(`[homeService] Error in getCustomBlocks:`, error.message);
    throw error; // Propaga excepciones limpias para ser capturadas por error.tsx
  }
}
