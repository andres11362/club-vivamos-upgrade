/**
 * Estructura de datos para una categoría.
 * Todas las propiedades son inmutables (`readonly`).
 */
export interface Category {
  readonly id: number;
  readonly title: string;
  readonly className: string;
  readonly iconFile: string;
  readonly route: string;
}

/**
 * Catálogo inmutable de categorías disponibles.
 */
export const CATEGORIES: ReadonlyArray<Category> = [
  {
    id: 1,
    title: "Hogar y Servicios",
    className: "hogar",
    iconFile: "/static/images/menu-mobile/hogar-y-servicios.svg",
    route: "hogar-y-servicios",
  },
  {
    id: 2,
    title: "Entretenimiento",
    className: "entretenimiento",
    iconFile: "/static/images/menu-mobile/entretenimiento.svg",
    route: "entretenimiento",
  },
  {
    id: 3,
    title: "Gastronomía",
    className: "gastronomia",
    iconFile: "/static/images/menu-mobile/gastronomia.svg",
    route: "gastronomia",
  },
  {
    id: 4,
    title: "Salud y Bienestar",
    className: "salud",
    iconFile: "/static/images/menu-mobile/salud-y-bienestar.svg",
    route: "salud-y-bienestar",
  },
  {
    id: 5,
    title: "Turismo",
    className: "turismo",
    iconFile: "/static/images/menu-mobile/turismo.svg",
    route: "turismo",
  },
  {
    id: 6,
    title: "Ropa y Accesorios",
    className: "ropa",
    iconFile: "/static/images/menu-mobile/ropa-y-accesorios.svg",
    route: "ropa-y-accesorios",
  },
] as const;

/**
 * Categoría por defecto en caso de no encontrarse coincidencias.
 */
export const DEFAULT_CATEGORY: Category = {
  id: 0,
  title: "",
  className: "",
  iconFile: "",
  route: "",
} as const;

/**
 * Diccionario inmutable para la traducción de tipos de usuario.
 */
export const USER_TYPES_MAP: Record<number, string> = {
  1: "basico",
  2: "clasico",
  3: "preferente",
} as const;

/**
 * Diccionario inmutable para la equivalencia de tipos de documento.
 */
export const DOCUMENT_TYPE_MAP: Record<number, number> = {
  1: 1,
  3: 2,
  4: 0,
  5: 4,
  10: 3,
} as const;

/**
 * Recupera los datos de una categoría por su ID o por su slug de ruta.
 * 
 * Cumple con SOLID:
 * - **SRP (Single Responsibility Principle)**: Separación nítida entre la base de datos estática
 *   (`CATEGORIES`) y la lógica funcional de búsqueda.
 * - **OCP (Open/Closed Principle)**: No requiere alterar sentencias condicionales `switch`. Para agregar
 *   nuevas categorías, basta con expandir el catálogo estático `CATEGORIES`.
 * 
 * @param id - Identificador numérico o cadena de ruta (slug) de la categoría.
 * @returns La categoría correspondiente o la categoría vacía por defecto.
 */
export const getCategory = (id: number | string): Category => {
  const category = CATEGORIES.find(
    (cat) => cat.id === id || cat.route === id
  );
  return category ?? DEFAULT_CATEGORY;
};

/**
 * Obtiene el nombre/slug del tipo de usuario basado en su identificador numérico.
 * 
 * @param id - Identificador del tipo de usuario.
 * @returns Nombre del tipo de usuario o cadena vacía si no existe.
 */
export const getUserType = (id: number | string): string => {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return USER_TYPES_MAP[numericId] ?? "";
};


/**
 * Mapea el identificador del tipo de documento local al del sistema externo.
 * 
 * @param type - ID del tipo de documento original.
 * @returns ID del tipo de documento equivalente, o undefined si no coincide.
 */
export const getDocumentType = (type: number): number | undefined => {
  return DOCUMENT_TYPE_MAP[type];
};

/**
 * Extrae el nombre de host (domain) de una URL dada de manera segura.
 * 
 * @param url - La URL a analizar.
 * @returns El nombre de host, o null si la URL es inválida o no cuenta con host.
 */
export const getHostname = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== "string") {
    return null;
  }
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  return matches ? (matches[1] ?? null) : null;
};
