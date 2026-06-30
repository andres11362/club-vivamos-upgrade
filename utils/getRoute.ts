/**
 * Opciones para la extracción de segmentos de ruta.
 * Todas las propiedades son de solo lectura (`readonly`).
 */
export interface RouteExtractionOptions {
  /** Separador de ruta (por defecto '/'). */
  readonly separator?: string;
  /** Valor retornado en caso de que no haya ruta o la entrada sea inválida. */
  readonly fallback?: string;
}

/**
 * Obtiene el último segmento de una cadena de ruta dada.
 * Es una función pura e inmutable que no depende de objetos globales del navegador.
 * 
 * SRP: Enfocada únicamente en procesar lógicamente la cadena de texto de la ruta.
 * 
 * @param pathname - La ruta de la que extraer el segmento.
 * @param options - Opciones de delimitador y fallback.
 * @returns El último segmento de la ruta.
 */
export const getLastPathSegment = (
  pathname: string,
  options: RouteExtractionOptions = {}
): string => {
  const { separator = '/', fallback = '' } = options;

  if (!pathname || typeof pathname !== 'string') {
    return fallback;
  }

  // Sanitizar barras diagonales al final si las hay, para evitar segmentos vacíos
  const sanitizedPath = pathname.endsWith(separator) && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  const segments = sanitizedPath.split(separator);
  const lastSegment = segments[segments.length - 1];

  return lastSegment !== undefined ? lastSegment : fallback;
};

/**
 * Obtiene el último segmento de la ruta actual basada en `window.location.pathname`.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Delega la manipulación de la cadena a `getLastPathSegment`
 *    y se encarga exclusivamente del acceso seguro al entorno del navegador (`window`).
 * 2. **Seguridad SSR (Server-Side Rendering)**: Valida la presencia de `window` previniendo
 *    excepciones durante la renderización en el servidor o procesos de compilación en Next.js.
 * 
 * @param options - Opciones de delimitador y fallback.
 * @returns El último segmento de la ruta en el cliente, o el fallback en el servidor.
 */
export const getRoute = (options: RouteExtractionOptions = {}): string => {
  const { fallback = '' } = options;

  if (typeof window === 'undefined') {
    return fallback;
  }

  return getLastPathSegment(window.location.pathname, options);
};
