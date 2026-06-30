/**
 * Estructura de configuración de correo almacenada en process.env.MAIL_VALUES.
 * Todas las propiedades son de solo lectura (`readonly`).
 */
export interface MailConfig {
  readonly API_KEY_WEB: string;
}

/**
 * Representa los datos inmutables del correo a enviar.
 */
export type EmailData = Record<string, unknown>;

/**
 * Interfaz para el cliente HTTP. Sigue el principio de inversión de dependencia (DIP).
 */
export interface HttpClient {
  readonly post: <T>(
    url: string,
    data: unknown,
    headers: Record<string, string>
  ) => Promise<{ readonly status: number; readonly data: T }>;
}

/**
 * Implementación de HttpClient utilizando la API nativa de Fetch.
 * 
 * SRP: Enfocada únicamente en realizar peticiones de red sin depender de librerías externas.
 */
export const FetchHttpClient: HttpClient = {
  post: async <T>(
    url: string,
    data: unknown,
    headers: Record<string, string>
  ) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = (await response.json().catch(() => ({}))) as T;

    return {
      status: response.status,
      data: responseData,
    };
  },
};

/**
 * Extrae y valida las variables de entorno de configuración.
 * 
 * SRP: Responsable exclusivamente de validar y estructurar la configuración externa.
 * 
 * @returns Objeto inmutable con la URL destino y API key.
 * @throws Error si alguna variable de entorno no está definida o es inválida.
 */
export const getEmailConfig = (): { readonly url: string; readonly apiKey: string } => {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('La variable de entorno BASE_URL no está definida.');
  }

  const mailValuesRaw = process.env.MAIL_VALUES;
  if (!mailValuesRaw) {
    throw new Error('La variable de entorno MAIL_VALUES no está definida.');
  }

  try {
    const mailData = JSON.parse(mailValuesRaw) as MailConfig;
    if (!mailData.API_KEY_WEB) {
      throw new Error("El campo 'API_KEY_WEB' falta en la configuración de MAIL_VALUES.");
    }
    return {
      url: `${baseUrl}/api/send-email`,
      apiKey: mailData.API_KEY_WEB,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error al parsear MAIL_VALUES: ${errorMessage}`);
  }
};

/**
 * Envía un correo electrónico con los datos proporcionados.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Delega la validación de configuración a `getEmailConfig`
 *    y la comunicación de red a la abstracción de `httpClient`.
 * 2. **OCP (Abierto/Cerrado)**: Abierto a inyectar diferentes clientes HTTP (Fetch, Axios, mocks para pruebas)
 *    sin cambiar el core de la función.
 * 3. **DIP (Inversión de Dependencias)**: Depende de la interfaz `HttpClient` en lugar de una librería física concreta.
 * 
 * @param data - Datos del correo a enviar.
 * @param httpClient - Implementación del cliente HTTP (por defecto `FetchHttpClient`).
 */
export const sendEmail = async (
  data: EmailData,
  httpClient: HttpClient = FetchHttpClient
): Promise<void> => {
  try {
    const config = getEmailConfig();

    const headers: Record<string, string> = {
      'x-api-key': config.apiKey,
    };

    const res = await httpClient.post(config.url, data, headers);

    if (res.status === 200) {
      console.log('Correo enviado con éxito');
    } else {
      console.log('Error al enviar el correo');
    }
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
