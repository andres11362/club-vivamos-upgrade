/**
 * @file gtmUtils.ts
 * @description Utilidades fuertemente tipadas para la marcación y seguimiento en Google Tag Manager (GTM).
 * Diseñado específicamente para entornos SSR (como Next.js App Router) con validaciones seguras.
 */

import { getCategory, getUserType } from "@/utils/JSONObjects";

// --- Interfaces de Datos de GTM ---

export interface GtmProduct {
  readonly name: string;
  readonly id: string | number;
  readonly price: string;
  readonly brand: string;
  readonly category: string;
  readonly position: number;
  readonly list: string;
  readonly dimension4: string;
}

export interface GtmImpressionItem {
  readonly item_name: string;
  readonly item_id: string | number;
  readonly price: string;
  readonly item_brand: string;
  readonly item_category: string;
  readonly item_variant: string;
  readonly item_list_name: string;
  readonly item_list_id: string;
  readonly index: number;
  readonly quantity: number;
}

export interface BenefitSearchResult {
  readonly title: string;
  readonly benefitId: string | number;
  readonly discount: string;
  readonly alliedName: string;
  readonly categoryId: number | string;
  readonly segmentId: number;
}

export interface CustomResultItem {
  readonly title: string;
  readonly siteUrl: string;
  readonly block: number;
  readonly description: string;
}

export interface GtmCustomProduct {
  readonly name: string;
  readonly list: string;
  readonly position: number;
  readonly dimension5: string;
  readonly id?: number;
  readonly brand: string;
  readonly dimension16: string;
}

// --- Helpers Base y de Inyección ---

/**
 * Agrega datos de forma segura al dataLayer del navegador.
 */
export const pushToDataLayer = (payload: Record<string, any>): void => {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(payload);
  }
};

/**
 * Limpia el estado de ecommerce para GA4 (Recomendado antes de disparar un evento de Ecommerce).
 */
export const clearEcommerce = (): void => {
  pushToDataLayer({ ecommerce: null });
};

// --- Marcaciones de Rutas (PageViews) ---

/**
 * Registra un evento de cambio de ruta (pageview) en Next.js.
 * Consolida la lógica sin depender de Redux.
 */
export const gtmRoutePageView = (url: string): void => {
  pushToDataLayer({
    event: "pageview",
    page: url,
  });
};

// --- Eventos de Detalle de Beneficio ---

/**
 * Registra la visualización del detalle de beneficio en formato Universal Analytics.
 */
export const gtmPageViewDetail = (
  title: string,
  id: string | number,
  discount: string,
  alliedName: string,
  categoryTitle: string,
  benefitType: string,
  origen: string
): void => {
  pushToDataLayer({
    event: "product-details",
    ecommerce: {
      detail: {
        actionField: { list: `${origen} de Beneficio` },
        products: [
          {
            name: title,
            id: id,
            price: discount,
            brand: alliedName,
            category: categoryTitle,
            position: 1,
            dimension4: benefitType,
          },
        ],
      },
    },
  });
};

/**
 * Registra la visualización del detalle de beneficio en formato GA4.
 */
export const gtmViewItemDetail = (
  title: string,
  id: string | number,
  discount: string,
  alliedName: string,
  categoryTitle: string,
  benefitType: string,
  origen: string
): void => {
  try {
    clearEcommerce();
    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_name: title,
            item_id: id,
            price: discount,
            item_brand: alliedName,
            item_category: categoryTitle,
            item_variant: benefitType,
            item_list_name: origen === "Categoria" ? `${origen} Beneficio` : `${origen} Aliados`,
            item_list_id: origen === "Categoria" ? "CATBENEFICIO" : "DIRALIA2",
            index: 1,
            quantity: 1,
          },
        ],
      },
    });
  } catch (error) {
    console.error("GTM: Error en gtmViewItemDetail:", error);
  }
};

// --- Impresiones de Listas y Directorio ---

/**
 * Registra impresiones de listas de beneficios en formato Universal Analytics.
 */
export const gtmPageViewResults = (results: GtmProduct[]): void => {
  pushToDataLayer({
    event: "product-list-impressions",
    ecommerce: {
      currencyCode: "COP",
      impressions: results,
    },
  });
};

/**
 * Registra impresiones del directorio de aliados en formato GA4.
 */
export const gtmDirectoryAlied = (results: GtmImpressionItem[]): void => {
  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      currencyCode: "COP",
      impressions: results,
    },
  });
};

// --- Clicks en Beneficios ---

/**
 * Registra el click en un beneficio en formato Universal Analytics.
 */
export const gtmBenefitClick = (
  title: string,
  id: string | number,
  discount: string,
  alliedName: string,
  categoryTitle: string,
  benefitType: string,
  position: number = 1,
  list: string = "Resultado Busqueda"
): void => {
  pushToDataLayer({
    event: "productClick",
    ecommerce: {
      click: {
        actionField: { list: list },
        products: [
          {
            name: title,
            id: id,
            price: discount,
            brand: alliedName,
            category: categoryTitle,
            position: position,
            dimension4: benefitType,
          },
        ],
      },
    },
  });
};

/**
 * Registra la selección de un item en formato GA4.
 */
export const gtmSelectItemClick = (
  title: string,
  id: string | number,
  discount: string,
  alliedName: string,
  categoryTitle: string,
  position: number = 1,
  benefitType: string,
  origen: string
): void => {
  clearEcommerce();
  pushToDataLayer({
    event: "select_item",
    ecommerce: {
      items: [
        {
          item_name: title,
          item_id: id,
          item_brand: alliedName,
          item_category: categoryTitle,
          item_variant: benefitType,
          item_list_name: origen === "Categoria" ? `${origen} Beneficio` : `${origen} Aliados`,
          item_list_id: origen === "Categoria" ? "CATBENEFICIO" : "DIRALIA2",
          index: position,
          quantity: 1,
          price: discount,
        },
      ],
    },
  });
};

// --- Mapeadores de Estructura de Datos ---

/**
 * Transforma los resultados de búsqueda al formato requerido por UA para impresiones.
 */
export const gtmFetchToBenefitStructure = (
  searchResult: Record<string | number, BenefitSearchResult> | BenefitSearchResult[],
  list: string = "Resultado",
  position: number = 1
): GtmProduct[] => {
  const searchResultGtm: GtmProduct[] = [];
  const items = Array.isArray(searchResult) ? searchResult : Object.values(searchResult);

  items.forEach((item, index) => {
    const categoryInfo = getCategory(item.categoryId);
    const segmentInfo = getUserType(item.segmentId);
    
    searchResultGtm.push({
      name: item.title,
      id: item.benefitId,
      price: item.discount,
      brand: item.alliedName,
      category: categoryInfo.title,
      position: index + position,
      list: list,
      dimension4: segmentInfo,
    });
  });

  return searchResultGtm;
};

/**
 * Transforma los resultados de búsqueda al formato requerido por GA4 para impresiones.
 */
export const gtmFetchToDirectoryStructure = (
  searchResult: Record<string | number, BenefitSearchResult> | BenefitSearchResult[],
  list: string = "Directorio Aliados",
  position: number = 1
): GtmImpressionItem[] => {
  const searchResultGtm: GtmImpressionItem[] = [];
  const items = Array.isArray(searchResult) ? searchResult : Object.values(searchResult);

  items.forEach((item, index) => {
    const categoryInfo = getCategory(item.categoryId);
    
    searchResultGtm.push({
      item_name: item.title,
      item_id: item.benefitId,
      price: item.discount,
      item_brand: item.alliedName,
      item_category: categoryInfo.title,
      item_variant: "clasico",
      item_list_name: list,
      item_list_id: list === "Categoria Beneficio" ? "CATBENEFICIO" : "DIRALIA2",
      index: index + position,
      quantity: 1,
    });
  });

  return searchResultGtm;
};

/**
 * Transforma datos para bloques personalizados.
 */
export const gtmFetchToCustomStructure = (
  customResult: Record<string | number, CustomResultItem> | CustomResultItem[],
  list: string = "Destacado"
): GtmCustomProduct[] => {
  const customGtm: GtmCustomProduct[] = [];
  const items = Array.isArray(customResult) ? customResult : Object.values(customResult);
  const urlSite = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_BASE_URL || "https://www.clubvivamos.com");

  items.forEach((item) => {
    let benefitId: number | undefined = undefined;
    if (item.siteUrl.indexOf(urlSite) !== -1) {
      const urlBenefit = item.siteUrl.split("/");
      const lastPath = parseInt(urlBenefit.pop() || "");
      if (Number.isInteger(lastPath)) {
        benefitId = lastPath;
      }
    }
    customGtm.push({
      name: item.title,
      list: list,
      position: item.block,
      dimension5: item.siteUrl,
      id: benefitId,
      brand: item.title,
      dimension16: item.description,
    });
  });

  return customGtm;
};

// --- Clicks en Bloques Custom e Interacciones de Detalle ---

export const gtmCustomClick = (
  block: number,
  description: string,
  siteUrl: string,
  title: string
): void => {
  const urlSite = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_BASE_URL || "https://www.clubvivamos.com");
  let benefitId: number | undefined = undefined;
  
  if (siteUrl.indexOf(urlSite) !== -1) {
    const urlBenefit = siteUrl.split("/");
    const lastPath = parseInt(urlBenefit.pop() || "");
    if (Number.isInteger(lastPath)) {
      benefitId = lastPath;
    }
  }

  pushToDataLayer({
    event: "productClick",
    ecommerce: {
      click: {
        actionField: { list: "Destacado" },
        products: [
          {
            position: block,
            dimension16: description,
            dimension5: siteUrl,
            name: title,
            brand: title,
            id: benefitId,
            list: "Destacado",
          },
        ],
      },
    },
  });
};

export const gtmDetailSocialMedia = (
  label: string,
  allied: string,
  partner: string,
  benefit: string
): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Compartir",
    label: label,
    Aliado: allied,
    Socio: partner,
    Beneficio: benefit,
  });
};

export const gtmDetailLinkAllied = (
  label: string,
  idBenefit: string | number,
  alliedName: string,
  nameBenefit: string
): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Sitio de Aliado",
    label: `Ir a: ${label}`,
    aliado: alliedName,
    "id beneficio": idBenefit,
    beneficio: nameBenefit,
  });
};

export const gtmDetailCities = (label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Ciudad",
    label: label,
  });
};

export const gtmDetailHeadquartersCities = (
  label: string,
  benefit: { readonly alliedName: string; readonly id: string | number; readonly title: string }
): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Ver Sedes",
    label: `Ir a: ${label}`,
    ciudad: label,
    aliado: benefit.alliedName,
    idBeneficio: benefit.id,
    beneficio: benefit.title,
  });
};

export const gtmDetaiCloselHeadquartersCities = (city: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Cerrar Sedes",
    label: "Cerrar Sede",
    Ciudad: city,
  });
};

export const gtmDetailReadMore = (label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Detalle de Beneficio",
    action: "CV - Condiciones del Beneficio",
    label: label,
  });
};

// --- Resultados y Filtros ---

export const gtmResultType = (type: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Resultado de Busqueda",
    action: "CV - Ordenar por productos",
    label: `Ordenar por: ${type}`,
  });
};

export const gtmResultLoadMore = (label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Resultado de Busqueda",
    action: "CV - Cargar Mas Beneficios",
    label: label,
  });
};

export const gtmResultsuggested = (cantidad: number): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Resultado de Busqueda",
    action: "CV - Resultado Busqueda",
    label: `Sugeridos:${cantidad}`,
  });
};

// --- Footer e Interacciones de Navegación ---

export const gtmFooterLinkApp = (app: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Footer",
    action: "CV - Descargar App",
    label: app,
  });
};

export const gtmFooterExternalLink = (link: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Footer",
    action: "CV - Links Externos",
    label: link,
  });
};

export const gtmSocialLink = (social: string, { position, version }: { position: number; version: string }): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Footer",
    action: `CV - Redes Sociales - ${version}`,
    label: social,
    posicion: position,
  });
};

export const gtmFooterChatLink = (social: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Footer",
    action: "CV - Canales de Contacto - Chat",
    label: social,
  });
};

// --- Cabezote (Header) y Buscador ---

export const gtmHeaderLogo = (): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: "CV - Logo Cabezote",
    label: "Ir al Home",
  });
};

export const gtmHeadermenu = (menu: string, version: string = ""): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: `CV - Menu Cabezote - ${version}`,
    label: menu,
  });
};

export const gtmSuscription = (position: string | number, version: string = ""): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Suscripcion",
    action: "CV - Boton Suscribete",
    label: `Boton:${position} - ${version}`,
  });
};

export const gtmSearchInput = (search: string, version: string = ""): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: `CV - Buscador Cabezote - ${version}`,
    label: search,
  });
};

export const gtmSearchInputResult = (search: string, quantity: number): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Resultado de Busqueda",
    action: "CV - Palabra Buscada",
    label: `${search} - Resultados:${quantity}`,
  });
};

export const gtmContact = (version: string = ""): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: `CV - Canales de contacto - ${version}`,
    label: "Ir a Canales de Contacto",
  });
};

export const gtmUpperMenu = (menu: string, version: string = ""): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: `CV - Menu Superior - ${version}`,
    label: menu,
  });
};

export const gtmUpperSubMenu = (menu: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: "CV - SubMenu Superior",
    label: menu,
  });
};

export const gtmAccessAccount = (menu: string, { userId }: { userId: string | number }): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: "CV - Acceso Cuenta",
    label: menu,
    idUsuario: userId,
  });
};

export const gtmUserMenu = (menu: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cabezote",
    action: "CV - Menu Usuario",
    label: menu,
  });
};

// --- Home Slider y Bloques Custom ---

export const gtmFeaturedSlider = (results: GtmProduct[]): void => {
  pushToDataLayer({
    event: "product-list-impressions",
    ecommerce: {
      currencyCode: "COP",
      impressions: results,
    },
  });
};

export const gtmFeaturedSliderControls = (
  title: string,
  position: number | string,
  control: string,
  path: string
): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Home - Destacados",
    action: `CV - Controles Destacados - ${control}`,
    label: `${title} - Posicion:${position} - Url:${path}`,
  });
};

export const gtmcustomBlock = (results: GtmCustomProduct[]): void => {
  pushToDataLayer({
    event: "product-list-impressions",
    ecommerce: {
      currencyCode: "COP",
      impressions: results,
    },
  });
};

export const gtmNotificationApp = (label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Home - Descarga App",
    action: "CV - Banner Descarga App",
    label: label,
  });
};

// --- Autenticación y Flujo de Recuperación ---

export const gtmLoginOption = (option: string, result: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Login",
    action: `CV - Login - ${option}`,
    label: result,
  });
};

export const gtmRecoverClick = (): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Login",
    action: "CV - Recordar Clave",
    label: "Ir a recordar clave",
  });
};

export const gtmRecoverResult = (result: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Recordar Clave",
    action: "CV - Recordar Clave",
    label: result,
  });
};

export const gtmRecoverExploreBenefit = (label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Recordar Clave",
    action: "CV - Explorar Beneficios",
    label: label,
  });
};

export const gtmRecoverConfirmClick = (): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Recordar Clave",
    action: "CV - Aceptar Confirmacion",
    label: "Ir a login",
  });
};

// --- Registro e Información de Usuario ---

export const gtmRegisterOption = (
  option: string,
  text: string = "Tipo de registro",
  userId?: string | number,
  estado_usuario: string = "Logueado"
): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Registro",
    action: `CV - Registro - ${option}`,
    label: text,
    idUsuario: userId,
    estado_usuario: estado_usuario,
  });
};

export const gtmHasAccount = (): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Registro",
    action: "CV - Ya tengo cuenta",
    label: "Ir a login",
  });
};

export const gtmUpgradeBanner = (link: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Home - Upgrade",
    action: "CV - Banner Actualizate",
    label: link,
  });
};

export const gtmChangePassword = (): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Cambiar Clave",
    action: "CV - Cambiar Clave",
    label: "Cambio exitoso",
  });
};

export const gtmsaveUserZone = (fields: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Zona Usuario",
    action: "CV - Datos Personales",
    label: fields,
  });
};

export const gtmFaqOption = (option: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: "Preguntas Frecuentes",
    action: "CV - Detalle Pregunta",
    label: option,
  });
};

export const gtmUserInfo = (
  userState: string,
  suscriptionState: string = "no suscrito",
  partnerType: string = "Sin segmento",
  userId: string | number = "",
  userName: string = ""
): void => {
  pushToDataLayer({
    event: "user_info",
    user_state: userState,
    suscription_state: suscriptionState,
    partner_type: partnerType,
    user_id: userId,
    user_name: userName,
  });
};

export const gtmBeneficiariesInfo = (category: string, label: string): void => {
  pushToDataLayer({
    event: "ga_event",
    category: category,
    action: "CV - Beneficiarios",
    label: label,
  });
};
