"use server";

/**
 * @file savingsService.ts
 * @description Servicio analítico/servidor para la obtención de datos de ahorro (Mis Ahorros).
 * Utiliza fetch nativo y tipados estrictos en TypeScript.
 */

export interface ClienteInfo {
  readonly nombres: string;
  readonly apellidos: string;
  readonly ahorroTotal: number;
}

export interface UtilizacionAliado {
  readonly aliado: string;
  readonly aliadoName?: string;
  readonly ahorro: number;
  readonly cantidadUtilizaciones: number;
  readonly categoriaId?: number;
  readonly categoria?: string;
  readonly imagen?: string;
}

export interface CategoriaPorcentaje {
  readonly categoriaId: number;
  readonly porcentaje: number;
  readonly ahorro: number;
}

export interface SavingsResponse {
  readonly cliente: ClienteInfo | null;
  readonly utilizacionesPorAliados: readonly UtilizacionAliado[];
  readonly categoriasPorcentaje: readonly CategoriaPorcentaje[];
  readonly codigoRespuesta?: number;
  readonly mensajeError?: string | null;
}

interface BacoSavingsConfig {
  readonly BASE_DOMAIN: string;
  readonly "X-API-KEY": string;
  readonly API: {
    readonly SEARCH: string;
    readonly METHOD?: string;
  };
}

/**
 * Helper interno para parsear de forma segura la configuración de BACO_SAVINGS
 */
const getBacoSavingsConfig = (): BacoSavingsConfig => {
  const envVal = process.env.BACO_SAVINGS;
  if (!envVal) {
    throw new Error("La variable de entorno BACO_SAVINGS no está definida.");
  }
  try {
    return JSON.parse(envVal) as BacoSavingsConfig;
  } catch (err) {
    throw new Error("El formato de BACO_SAVINGS en las variables de entorno es inválido.");
  }
};

/**
 * Obtiene los datos de mis ahorros del usuario autenticado.
 * 
 * @param documentType - ID del tipo de documento.
 * @param documentNumber - Número de documento del usuario.
 * @param months - Cantidad de meses a consultar (ej: 6 o 12).
 * @returns Promesa con la estructura SavingsResponse.
 */
export async function fetchSavingsData(
  documentType: string | number,
  documentNumber: string,
  months: number
): Promise<SavingsResponse> {
  try {
    const config = getBacoSavingsConfig();
    const url = `${config.BASE_DOMAIN}${config.API.SEARCH}`;

    const response = await fetch(url, {
      method: config.API.METHOD || "POST",
      headers: {
        "x-api-key": config["X-API-KEY"],
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        tipoDoc: Number(documentType),
        documento: documentNumber,
        cantidadMeses: months,
      }),
      // Evitamos el almacenamiento en cache para que los cambios de rango reflejen datos en tiempo real
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        cliente: errorData.cliente || null,
        utilizacionesPorAliados: [],
        categoriasPorcentaje: [],
        mensajeError: errorData.mensajeError || `Error HTTP: ${response.status}`,
        codigoRespuesta: response.status,
      };
    }

    const data = await response.json();
    return {
      cliente: data.cliente || null,
      utilizacionesPorAliados: data.utilizacionesPorAliados || [],
      categoriasPorcentaje: data.categoriasPorcentaje || [],
      codigoRespuesta: data.codigoRespuesta || response.status,
    };
  } catch (error: any) {
    console.error("Error en fetchSavingsData:", error);
    return {
      cliente: null,
      utilizacionesPorAliados: [],
      categoriasPorcentaje: [],
      mensajeError: error?.message || "Error de conexión interna del servidor",
      codigoRespuesta: 500,
    };
  }
}
