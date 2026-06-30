/**
 * Opciones para la creación de una cookie en el navegador.
 * Todas las propiedades son de solo lectura (`readonly`) para garantizar la inmutabilidad.
 */
export interface CookieOptions {
  readonly path?: string;
  readonly expires?: Date;
  readonly maxAge?: number;
  readonly domain?: string;
  readonly secure?: boolean;
  readonly sameSite?: "Lax" | "Strict" | "None";
}

/**
 * Abstracción de un almacén de cookies.
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface CookieStore {
  readonly save: (key: string, value: unknown, options?: CookieOptions) => void;
  readonly load: (key: string) => unknown;
  readonly remove: (key: string, options?: CookieOptions) => void;
}

/**
 * Estructura mínima de una petición en el servidor (request) para extraer cookies.
 */
export interface ServerRequest {
  readonly headers?: {
    readonly cookie?: string;
  };
}

/**
 * Obtiene el prefijo de las cookies de las variables de entorno de forma segura.
 * 
 * @returns Prefijo configurado o cadena vacía si no existe.
 */
export const getCookiePrefix = (): string => {
  return process.env.COOKIE_PREFIX ?? "";
};

/**
 * Formatea el nombre de la cookie aplicando el prefijo corporativo si se requiere.
 * 
 * @param key Nombre original de la cookie.
 * @param prefix Flag para aplicar el prefijo.
 * @returns Nombre de la cookie formateado.
 */
export const formatCookieKey = (key: string, prefix = true): string => {
  return prefix ? `${getCookiePrefix()}${key}` : key;
};

/**
 * Implementación de CookieStore para el entorno del navegador (cliente) libre de dependencias externas.
 * 
 * SRP: Responsable exclusivo de interactuar con document.cookie en el navegador.
 */
export const BrowserCookieStore: CookieStore = {
  save: (key: string, value: unknown, options: CookieOptions = {}): void => {
    if (typeof window === "undefined") return;

    const stringValue = typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value);

    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(stringValue)}`;

    const path = options.path ?? "/";
    cookieString += `; path=${path}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge !== undefined) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += "; secure";
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    window.document.cookie = cookieString;
  },

  load: (key: string): unknown => {
    if (typeof window === "undefined") return undefined;

    const cookies = window.document.cookie.split(";");
    const searchPrefix = `${encodeURIComponent(key)}=`;

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(searchPrefix)) {
        const rawValue = decodeURIComponent(trimmed.substring(searchPrefix.length));
        try {
          return JSON.parse(rawValue);
        } catch {
          return rawValue;
        }
      }
    }

    return undefined;
  },

  remove: (key: string, options: CookieOptions = {}): void => {
    BrowserCookieStore.save(key, "", {
      ...options,
      expires: new Date(0),
      maxAge: -1,
    });
  },
};

/**
 * Obtiene la información de una cookie desde el request del servidor de forma segura.
 * 
 * SRP: Enfocado únicamente en parsear los encabezados de la petición en el servidor.
 * Mejora: Recupera correctamente valores que contienen el símbolo '=' (como firmas Base64).
 * 
 * @param key Nombre de la cookie.
 * @param req Objeto de petición HTTP.
 * @returns El valor del cookie sin procesar, o undefined.
 */
export const getCookieFromServer = (
  key: string,
  req: ServerRequest | undefined
): string | undefined => {
  if (!req?.headers?.cookie) {
    return undefined;
  }

  const searchPrefix = `${encodeURIComponent(key)}=`;
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(searchPrefix));

  if (!rawCookie) {
    return undefined;
  }

  const encodedValue = rawCookie.trim().substring(searchPrefix.length);
  try {
    return decodeURIComponent(encodedValue);
  } catch {
    return encodedValue;
  }
};

/**
 * Crea o actualiza una cookie en el cliente (si está en el navegador).
 * 
 * @param key Nombre de la cookie.
 * @param value Información a almacenar.
 * @param options Opciones de configuración de la cookie.
 * @param prefix Flag para decidir si se aplica el prefijo corporativo.
 */
export const setCookie = (
  key: string,
  value: unknown,
  options: CookieOptions = {},
  prefix = true
): void => {
  if (typeof window !== "undefined") {
    const formattedKey = formatCookieKey(key, prefix);
    BrowserCookieStore.save(formattedKey, value, options);
  }
};

/**
 * Elimina una cookie en el cliente (si está en el navegador).
 * 
 * @param key Nombre de la cookie.
 */
export const removeCookie = (key: string): void => {
  if (typeof window !== "undefined") {
    const formattedKey = formatCookieKey(key, true);
    BrowserCookieStore.remove(formattedKey);
  }
};

/**
 * Obtiene el valor de una cookie de forma transparente (del navegador en cliente, o del request en servidor).
 * 
 * @param key Nombre de la cookie.
 * @param req Request de Node/Next.js (opcional, necesario en SSR).
 * @param prefix Flag para decidir si se lee con el prefijo corporativo.
 * @returns El valor cargado o undefined.
 */
export const getCookie = (
  key: string,
  req?: ServerRequest,
  prefix = true
): unknown => {
  const formattedKey = formatCookieKey(key, prefix);

  if (typeof window !== "undefined") {
    return BrowserCookieStore.load(formattedKey);
  }

  return getCookieFromServer(formattedKey, req);
};
