/**
 * Representa los datos de entrada mínimos requeridos para validar un usuario.
 * Todas las propiedades son de solo lectura (`readonly`) para garantizar la inmutabilidad.
 */
export interface UserValidationInput {
  readonly document?: string;
  readonly document_type_id?: number;
}

/**
 * Representa la estructura de configuración de Baco Benefits en las variables de entorno.
 */
export interface BacoBenefitsConfig {
  readonly BASE_DOMAIN_SEGMENT: string;
  readonly ENDPOINTS: {
    readonly SEGMENT: string;
  };
}

/**
 * Estructura de datos interna de la respuesta de Baco.
 */
export interface BacoPartnerData {
  readonly partnerType: string;
}

/**
 * Representa el formato de respuesta esperado del servidor.
 */
export interface BacoBenefitsResponse {
  readonly data: BacoPartnerData;
}

/**
 * Interfaz para el cliente HTTP. Sigue el principio de inversión de dependencia (DIP).
 */
export interface HttpClient {
  readonly post: <T>(
    url: string,
    body: unknown,
    headers?: Record<string, string>
  ) => Promise<{ readonly status: number; readonly data: T }>;
}

/**
 * Implementación de HttpClient utilizando la API nativa de Fetch.
 * 
 * SRP: Enfocada únicamente en realizar peticiones de red sin depender de librerías externas.
 */
export const FetchHttpClient: HttpClient = {
  post: async <T>(url: string, body: unknown, headers?: Record<string, string>) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = (await response.json()) as T;
    return {
      status: response.status,
      data: responseData,
    };
  },
};

/**
 * Mapea el tipo de documento del usuario local al tipo de documento esperado por el sistema de Baco.
 * 
 * SRP: Enfocado únicamente en la traducción/mapeo de tipos de documentos.
 * 
 * @param documentTypeId - ID original del tipo de documento.
 * @returns ID traducido según las reglas de negocio de Baco.
 */
export const mapDocumentType = (documentTypeId: number | undefined): number | undefined => {
  if (documentTypeId === undefined) {
    return undefined;
  }
  // Si es 3 (Cédula de Extranjería), se mapea a 2, de lo contrario conserva su valor.
  return documentTypeId === 3 ? 2 : documentTypeId;
};

/**
 * Extrae y valida la configuración de Baco Benefits desde las variables de entorno.
 * 
 * SRP: Responsable exclusivo de parsear y validar la configuración de entorno de Baco.
 * 
 * @returns Objeto inmutable con la URL completa construida.
 * @throws Error si la variable de entorno no está definida o está mal estructurada.
 */
export const getBacoBenefitsConfig = (): { readonly url: string } => {
  const bacoBenefitsRaw = process.env.BACO_BENEFITS;
  if (!bacoBenefitsRaw) {
    throw new Error('La variable de entorno BACO_BENEFITS no está definida.');
  }

  try {
    const config = JSON.parse(bacoBenefitsRaw) as BacoBenefitsConfig;
    if (!config.BASE_DOMAIN_SEGMENT || !config.ENDPOINTS?.SEGMENT) {
      throw new Error("La configuración de BACO_BENEFITS tiene campos incompletos ('BASE_DOMAIN_SEGMENT' o 'ENDPOINTS.SEGMENT').");
    }
    return {
      url: `${config.BASE_DOMAIN_SEGMENT}${config.ENDPOINTS.SEGMENT}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al parsear BACO_BENEFITS: ${errorMessage}`);
  }
};

/**
 * Determina si el usuario provisto es beneficiario del club.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Delega el mapeo de tipos de documentos a `mapDocumentType`,
 *    la extracción de configuración a `getBacoBenefitsConfig` y las peticiones HTTP a la
 *    abstracción `HttpClient`.
 * 2. **OCP (Abierto/Cerrado)**: Abierto a inyectar diferentes clientes HTTP (Fetch, Axios, mocks para tests)
 *    e inyectar distintas estrategias de mapeo de tipos de documento.
 * 3. **DIP (Inversión de Dependencias)**: Depende de la interfaz `HttpClient` en lugar de una librería concreta.
 * 
 * Inmutabilidad:
 * - El objeto `user` de entrada se trata como inmutable (`readonly`).
 * 
 * @param user - Objeto del usuario a validar.
 * @param httpClient - Implementación del cliente HTTP (por defecto `FetchHttpClient`).
 * @returns Promesa que resuelve a `true` si el usuario NO es un beneficiario o si faltan datos de documento,
 *          o `false` si es efectivamente un beneficiario (o si ocurre un error inesperado, manteniendo el comportamiento heredado).
 */
export const IsBeneficiary = async (
  user: UserValidationInput,
  httpClient: HttpClient = FetchHttpClient
): Promise<boolean> => {
  try {
    // Si no cuenta con documento ni tipo de documento, retorna true (comportamiento original)
    if (!user.document && !user.document_type_id) {
      return true;
    }

    const config = getBacoBenefitsConfig();
    const mappedDocumentType = mapDocumentType(user.document_type_id);

    const body = {
      documentType: mappedDocumentType,
      documentNumber: user.document,
    };

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    };

    const res = await httpClient.post<BacoBenefitsResponse>(config.url, body, headers);
    const { data } = res.data;

    if (data?.partnerType === 'Beneficiario') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al validar beneficiario:', error);
    // Conserva la lógica original de retornar false en caso de excepción
    return false;
  }
};
