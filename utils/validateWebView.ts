/**
 * Abstracción de un sistema de almacenamiento clave-valor (como localStorage).
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface StorageAdapter {
  readonly getItem: (key: string) => string | null;
  readonly setItem: (key: string, value: string) => void;
}

/**
 * Obtiene un adaptador seguro de almacenamiento local en entornos SSR (Server-Side Rendering).
 */
export const getSafeLocalStorage = (): StorageAdapter | null => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  return window.localStorage;
};

/**
 * Determina si una URL indica que la vista debe cargarse dentro de un WebView.
 * 
 * SRP: Enfocado puramente en la lógica del string de la URL.
 * 
 * @param url - La URL a analizar.
 * @param parameter - El fragmento o query param a buscar (por defecto '?webview').
 * @returns boolean indicando si es una URL de WebView.
 */
export const isWebViewUrl = (
  url: string | undefined | null,
  parameter = "?webview"
): boolean => {
  if (!url || typeof url !== "string") {
    return false;
  }
  return url.includes(parameter);
};

/**
 * Inicializa la llave 'webView' en el almacenamiento local en falso en caso de no existir.
 * 
 * @param storage - Adaptador de almacenamiento (por defecto localstorage del navegador).
 */
export const createWebView = (
  storage: StorageAdapter | null = getSafeLocalStorage()
): void => {
  if (!storage) return;

  const webView = storage.getItem("webView");
  if (webView === null || webView === undefined) {
    storage.setItem("webView", "false");
  }
};

/**
 * Analiza la URL actual y actualiza el estado de 'webView' en el almacenamiento local si se detecta el marcador.
 * 
 * Cumple con SOLID:
 * - **SRP (Single Responsibility Principle)**: Delega la lógica de negocio en `isWebViewUrl` e inyecta la obtención segura del entorno.
 * - **OCP (Open/Closed Principle)**: Permite inyectar cualquier adaptador de almacenamiento o cadena de URL para testing
 *   o para usar otros mecanismos de guardado (por ejemplo, sessionStorage o cookies) sin modificar el comportamiento interno.
 * - **SSR-Safe**: No arroja errores si se ejecuta durante la compilación o ejecución en el servidor de Next.js.
 * 
 * @param storage - Adaptador de almacenamiento.
 * @param currentUrl - La URL actual a analizar (por defecto la de window.location.href en el cliente).
 */
export const validateWebView = (
  storage: StorageAdapter | null = getSafeLocalStorage(),
  currentUrl: string | undefined = typeof window !== "undefined" ? window.location.href : undefined
): void => {
  if (!storage || !currentUrl) return;

  if (isWebViewUrl(currentUrl)) {
    storage.setItem("webView", "true");
  }
};

/**
 * Obtiene la dirección URL actual de forma segura frente a Server-Side Rendering (SSR).
 * 
 * @returns URL completa actual, o una cadena vacía en el servidor.
 */
export const getCurrentURL = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.href;
};
