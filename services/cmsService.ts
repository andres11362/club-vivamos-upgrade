/**
 * @file cmsService.ts
 * @description Servicio puramente de servidor para consumir contenidos estáticos desde el CMS (Elasticsearch).
 * Implementa tipados estrictos en TypeScript, paralelización de consultas, y optimizaciones de caché nativas de Next.js 15+.
 */

// --- Interfaces de Datos de Elasticsearch ---

export interface ElasticSearchHit<T> {
  readonly _index: string;
  readonly _type: string;
  readonly _id: string;
  readonly _score: number;
  readonly _source: T;
}

export interface ElasticSearchResponse<T> {
  readonly took: number;
  readonly timed_out: boolean;
  readonly _shards: {
    readonly total: number;
    readonly successful: number;
    readonly skipped: number;
    readonly failed: number;
  };
  readonly hits: {
    readonly total:
      | {
          readonly value: number;
          readonly relation: string;
        }
      | number;
    readonly max_score: number | null;
    readonly hits: readonly ElasticSearchHit<T>[];
  };
}

// --- Interfaces de Contenidos del CMS ---

export interface AboutSource {
  readonly title: string;
  readonly body: string;
  readonly imagen: readonly string[];
}

export interface FaqSource {
  readonly title: string;
  readonly body: string;
  readonly imagen: readonly string[];
  readonly weight?: number;
}

export type AboutResponse = ElasticSearchResponse<AboutSource>;
export type FaqItem = ElasticSearchResponse<FaqSource>;

export interface FaqResponse {
  readonly faq_1: FaqItem;
  readonly faq_2: FaqItem;
  readonly faq_3: FaqItem;
  readonly faq_4: FaqItem;
  readonly faq_5: FaqItem;
}

// --- Configuración de CMS ---

interface CMSConfig {
  readonly BASE_DOMAIN: string;
  readonly ABOUT: string;
  readonly FAQ: {
    readonly [key: string]: string;
  };
}

/**
 * Obtiene la configuración de CMS a partir de las variables de entorno.
 * Prioriza variables de entorno individuales y cae en el objeto JSON unificado si no están presentes.
 */
const getCmsConfig = (): CMSConfig => {
  let parsedConfig: Partial<CMSConfig> = {};
  const envVal = process.env.CMS;
  if (envVal) {
    try {
      parsedConfig = JSON.parse(envVal) as CMSConfig;
    } catch (err) {
      console.warn("Advertencia: No se pudo parsear process.env.CMS. Usando variables individuales.");
    }
  }

  // Priorizar variables individuales sobre el objeto CMS JSON unificado
  const BASE_DOMAIN = process.env.CMS_BASE_DOMAIN || parsedConfig.BASE_DOMAIN || "";
  const ABOUT = process.env.CMS_ABOUT_PATH || parsedConfig.ABOUT || "";
  const FAQ = {
    "1": process.env.CMS_FAQ_1 || (parsedConfig.FAQ && parsedConfig.FAQ["1"]) || "",
    "2": process.env.CMS_FAQ_2 || (parsedConfig.FAQ && parsedConfig.FAQ["2"]) || "",
    "3": process.env.CMS_FAQ_3 || (parsedConfig.FAQ && parsedConfig.FAQ["3"]) || "",
    "4": process.env.CMS_FAQ_4 || (parsedConfig.FAQ && parsedConfig.FAQ["4"]) || "",
    "5": process.env.CMS_FAQ_5 || (parsedConfig.FAQ && parsedConfig.FAQ["5"]) || "",
  };

  return {
    BASE_DOMAIN,
    ABOUT,
    FAQ,
  };
};

/**
 * Genera la cabecera de autenticación básica en Base64 utilizando credenciales seguras.
 * Soporta variables individuales (CMS_USER/CMS_PASS), JSON de ELASTIC_DATA y fallback heredado.
 */
const getCmsAuthHeader = (): string => {
  let user = process.env.CMS_USER;
  let pass = process.env.CMS_PASS;

  // Si no se definen individualmente, buscar en ELASTIC_DATA
  if (!user || !pass) {
    const elasticDataStr = process.env.ELASTIC_DATA;
    if (elasticDataStr) {
      try {
        const elasticData = JSON.parse(elasticDataStr);
        user = user || elasticData.ELASTIC_USERNAME;
        pass = pass || elasticData.ELASTIC_PASSWORD;
      } catch (e) {
        // Ignorar error de parseo JSON
      }
    }
  }

  // Credenciales por defecto si no existen en el entorno
  user = user || "MultiSite_Stg";
  pass = pass || "Mult1S1t3_Cl0ud_01";

  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  return `Basic ${token}`;
};

// --- Consultas del Servicio ---

/**
 * Obtiene el contenido informativo de la sección Quiénes Somos (About) desde el CMS.
 * Configura la revalidación por intervalo (ISR) cada 3600 segundos (1 hora).
 */
export async function getAbout(): Promise<AboutResponse> {
  const config = getCmsConfig();
  const authHeader = getCmsAuthHeader();

  if (!config.BASE_DOMAIN || !config.ABOUT) {
    throw new Error("Configuración del CMS incompleta (CMS_BASE_DOMAIN o CMS_ABOUT_PATH faltan).");
  }

  const url = `${config.BASE_DOMAIN}${config.ABOUT}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // ISR: Revalidación incremental estática cada hora
    });

    if (!response.ok) {
      throw new Error(`CMS HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as AboutResponse;

    // Validación de negocio
    if (!data || !data.hits || !data.hits.hits || data.hits.hits.length === 0) {
      throw new Error("No se encontró contenido para la sección Quiénes Somos (About) en el CMS.");
    }

    return data;
  } catch (error: any) {
    console.error("Error en getAbout:", error);
    throw new Error(error?.message || "Fallo al consultar la información Quiénes Somos del CMS.");
  }
}

/**
 * Helper interno para consultar individualmente un artículo de Preguntas Frecuentes (FAQ).
 */
async function fetchFaqContent(path: string, authHeader: string): Promise<FaqItem> {
  if (!path) {
    throw new Error("Ruta de FAQ inválida o no configurada.");
  }

  const response = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // ISR
  });

  if (!response.ok) {
    throw new Error(`CMS FAQ Item HTTP Error: ${response.status} en la ruta ${path}`);
  }

  const data = (await response.json()) as FaqItem;

  if (!data || !data.hits || !data.hits.hits || data.hits.hits.length === 0) {
    throw new Error(`No se encontró contenido para la FAQ en la ruta ${path}`);
  }

  return data;
}

/**
 * Realiza la consulta simultánea y optimizada de las 5 preguntas frecuentes mediante Promise.all.
 * Lanza una excepción en caso de que alguna falle para que sea capturada por el Error Boundary.
 */
export async function getFaqs(): Promise<FaqResponse> {
  const config = getCmsConfig();
  const authHeader = getCmsAuthHeader();

  if (!config.BASE_DOMAIN) {
    throw new Error("Configuración del CMS incompleta (Falta CMS_BASE_DOMAIN).");
  }

  const urlFaq1 = `${config.BASE_DOMAIN}${config.FAQ["1"]}`;
  const urlFaq2 = `${config.BASE_DOMAIN}${config.FAQ["2"]}`;
  const urlFaq3 = `${config.BASE_DOMAIN}${config.FAQ["3"]}`;
  const urlFaq4 = `${config.BASE_DOMAIN}${config.FAQ["4"]}`;
  const urlFaq5 = `${config.BASE_DOMAIN}${config.FAQ["5"]}`;

  try {
    const [faq_1, faq_2, faq_3, faq_4, faq_5] = await Promise.all([
      fetchFaqContent(urlFaq1, authHeader),
      fetchFaqContent(urlFaq2, authHeader),
      fetchFaqContent(urlFaq3, authHeader),
      fetchFaqContent(urlFaq4, authHeader),
      fetchFaqContent(urlFaq5, authHeader),
    ]);

    if (!faq_1 || !faq_2 || !faq_3 || !faq_4 || !faq_5) {
      throw new Error("Respuesta incompleta al consultar las FAQs del CMS.");
    }

    return {
      faq_1,
      faq_2,
      faq_3,
      faq_4,
      faq_5,
    };
  } catch (error: any) {
    console.error("Error en getFaqs:", error);
    throw new Error(error?.message || "Fallo al consultar el catálogo de Preguntas Frecuentes (FAQs) del CMS.");
  }
}
