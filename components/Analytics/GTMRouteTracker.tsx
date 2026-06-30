"use client";

/**
 * @file GTMRouteTracker.tsx
 * @description Componente global de cliente para el seguimiento automático de rutas (soft navigation)
 * en Next.js (App Router) e inyección del script de GTM.
 */

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { gtmRoutePageView } from "@/utils/gtmUtils";

interface GTMRouteTrackerProps {
  /**
   * ID del contenedor de Google Tag Manager (ej: GTM-XXXXXX).
   * Si no se suministra, buscará la variable de entorno process.env.NEXT_PUBLIC_GTM_ID.
   */
  readonly gtmId?: string;
}

/**
 * Componente interno que escucha el enrutador de Next.js.
 * Utiliza useSearchParams y usePathname para reaccionar a transiciones de rutas.
 */
function RouteTrackerTrigger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathname = useRef<string | null>(null);
  const lastSearch = useRef<string | null>(null);

  useEffect(() => {
    const searchStr = searchParams?.toString() || "";
    const currentUrl = `${pathname}${searchStr ? `?${searchStr}` : ""}`;

    // Disparar gtmRoutePageView solo si la ruta o parámetros de búsqueda reales cambian
    if (lastPathname.current !== pathname || lastSearch.current !== searchStr) {
      gtmRoutePageView(currentUrl);
      lastPathname.current = pathname;
      lastSearch.current = searchStr;
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Componente principal de seguimiento y carga de scripts GTM.
 */
export default function GTMRouteTracker({ gtmId }: GTMRouteTrackerProps) {
  const targetGtmId = gtmId || process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Inyección del Script oficial de Google Tag Manager */}
      {targetGtmId && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${targetGtmId}');
            `,
          }}
        />
      )}

      {/* 
        El trigger de navegación debe envolverse en Suspense.
        En Next.js App Router, usar useSearchParams en un layout sin Suspense
        puede forzar el renderizado dinámico de toda la página en tiempo de compilación.
      */}
      <Suspense fallback={null}>
        <RouteTrackerTrigger />
      </Suspense>
    </>
  );
}
