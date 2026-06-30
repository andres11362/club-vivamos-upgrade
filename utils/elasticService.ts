/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Servicio de Utilidades para Elasticsearch en el Servidor (SSR / RSC)
 * 
 * Reemplaza por completo el módulo heredado de Redux para Elastic,
 * proporcionando funciones puras y tipado estricto adaptado a Next.js 15.
 */

// --- Interfaces de Configuración de Entorno ---

export interface ElasticDataConfig {
  readonly NODE: string;
  readonly INDEX: string;
  readonly ELASTIC_USERNAME?: string;
  readonly ELASTIC_PASSWORD?: string;
}

// --- Interfaces de Elasticsearch ---

export interface ElasticHit<T = any> {
  readonly _index: string;
  readonly _id: string;
  readonly _score: number | null;
  readonly _source?: T;
  readonly fields?: T;
  readonly [key: string]: any;
}

export interface ElasticResponse<T = any> {
  readonly took: number;
  readonly timed_out: boolean;
  readonly _shards: {
    readonly total: number;
    readonly successful: number;
    readonly skipped: number;
    readonly failed: number;
  };
  readonly hits: {
    readonly total: {
      readonly value: number;
      readonly relation: string;
    } | number;
    readonly max_score: number | null;
    readonly hits: ReadonlyArray<ElasticHit<T>>;
  };
}

export interface ElasticQueryParams {
  readonly query: {
    readonly terms: {
      readonly [field: string]: ReadonlyArray<string | number | boolean> | number;
    };
  };
  readonly _source?: boolean;
  readonly fields?: ReadonlyArray<string>;
  readonly [key: string]: any;
}

// --- Interfaces de Formatos de Contenido del CMS ---

export interface FaqContent {
  readonly nid: readonly number[];
  readonly title: readonly string[];
  readonly body: readonly string[];
  readonly imagen?: readonly string[];
  readonly [key: string]: any;
}

export interface AboutContent {
  readonly title: readonly string[];
  readonly body: readonly string[];
  readonly imagen?: readonly string[];
  readonly status?: readonly boolean[];
  readonly [key: string]: any;
}

// --- Getters Seguros para Variables de Entorno (Server Safe) ---

const getElasticConfig = (): ElasticDataConfig => {
  try {
    const raw = process.env.ELASTIC_DATA || process.env.NEXT_PUBLIC_ELASTIC_DATA;
    return raw ? JSON.parse(raw) : ({} as ElasticDataConfig);
  } catch {
    return {} as ElasticDataConfig;
  }
};

const getAuthHeader = (config: ElasticDataConfig): string | null => {
  const username = config.ELASTIC_USERNAME;
  const password = config.ELASTIC_PASSWORD;
  if (!username || !password) return null;

  if (typeof btoa !== "undefined") {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
};

// --- Servicio Principal de Consulta a Elasticsearch ---

/**
 * Consulta la base de datos de Elasticsearch directamente en el servidor utilizando fetch nativo.
 * Diseñado para ser consumido en React Server Components de Next.js 15.
 * 
 * @param params - Consulta estructurada de Elasticsearch (ElasticQueryParams).
 * @returns Promesa con los resultados mapeados del tipo genérico solicitado.
 */
export async function getElasticData<T = any>(params: ElasticQueryParams): Promise<T[]> {
  const config = getElasticConfig();
  const node = config.NODE;
  const index = config.INDEX;

  if (!node || !index) {
    throw new Error("Elasticsearch configuration is missing in ELASTIC_DATA environment variable.");
  }

  // Asegurar formato de URL de Elasticsearch
  const baseUrl = node.endsWith("/") ? node : `${node}/`;
  const url = `${baseUrl}${index}/_search`;

  const authHeader = getAuthHeader(config);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    // Consulta nativa usando fetch con capacidades de caché de Next.js 15 (revalidación cada hora)
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Elasticsearch query failed with status ${response.status}: ${errorText}`);
    }

    const result = (await response.json()) as ElasticResponse<T>;
    const hits = result.hits?.hits || [];

    if (hits.length === 0) {
      return [];
    }

    // Preservar exactamente la lógica condicional del Thunk original
    if (params._source) {
      return hits
        .map((hit) => hit._source)
        .filter((src): src is T => src !== undefined);
    } else {
      return hits
        .map((hit) => hit.fields)
        .filter((fields): fields is T => fields !== undefined);
    }
  } catch (error: any) {
    console.error("[elasticService] Error fetching Elastic data:", error.message);
    throw error; // Propaga el error para que sea capturado por error.tsx de Next.js
  }
}
