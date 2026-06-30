import Link from "next/link";
import Image from "next/image";

/**
 * URLs del footer. Internas → rutas migradas del App Router.
 * Externas conocidas embebidas; las inciertas marcadas con TODO (provienen del
 * `process.env.SAC` legacy, a confirmar contra el entorno de producción).
 */
const SAC = {
  TERMS: "/terminos-y-condiciones",
  CONTACT: "/contactenos",
  PRIVACY: "/aviso-de-privacidad",
  ETHICAL_LINE: "https://lineaeticaceet.com/", // TODO: confirmar (SAC.ETHICAL_LINE)
  SUBSCRIPTIONS: "https://suscripciones.eltiempo.com",
  COLLECTIONS: "https://colecciones.eltiempo.com", // TODO: confirmar (SAC.COLLECTIONS)
  ALLIES: "/aliados",
} as const;

const SOCIAL = {
  facebook: "https://es-la.facebook.com/VivamosELTIEMPO",
  instagram: "https://www.instagram.com/vivamos_et/?hl=es-la",
  youtube: "https://www.youtube.com/channel/UCfvD6kztWt1t77FSuhO8W3w",
} as const;

const APP = {
  googlePlay: "https://play.google.com/store/apps/details?id=com.kubo.vivamos&hl=es_CO",
  appStore: "https://apps.apple.com/co/app/club-vivamos-el-tiempo/id945530183",
} as const;

const LINKS_LEFT = [
  { t: "TERMINOS Y CONDICIONES", href: SAC.TERMS, ext: false },
  { t: "CONTÁCTENOS", href: SAC.CONTACT, ext: false },
  { t: "AVISO DE PRIVACIDAD", href: SAC.PRIVACY, ext: false },
  { t: "LINEA ÉTICA", href: SAC.ETHICAL_LINE, ext: true },
];

const LINKS_RIGHT = [
  { t: "SUSCRIPCIONES EL TIEMPO", href: SAC.SUBSCRIPTIONS, ext: true },
  { t: "COLECCIONES EL TIEMPO", href: SAC.COLLECTIONS, ext: true },
  { t: "ALIADOS", href: SAC.ALLIES, ext: false },
];

// Enlace de columna (MavenPro-Medium 12/24, blanco, hover subrayado)
const linkCls =
  "font-maven text-[12px] leading-6 text-white no-underline transition hover:underline";

const FooterLink = ({ t, href, ext }: { t: string; href: string; ext: boolean }) =>
  ext ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {t}
    </a>
  ) : (
    <Link href={href} className={linkCls}>
      {t}
    </Link>
  );

// Bloque "tratamiento de datos" (en producción se duplica: derecha en desktop, izquierda en mobile)
const DataProtection = () => (
  <div className="leading-tight">
    <p className="font-maven text-[11px] text-white/35">
      Atención de solicitudes por tratamiento de datos personales
    </p>
    <a
      href="mailto:protecciondedatos@eltiempo.com"
      className="font-maven text-[12px] leading-6 text-white underline"
    >
      protecciondedatos@eltiempo.com
    </a>
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-ink text-white shadow-[0_2px_13px_0_rgba(0,0,0,0.67)]">
      <div className="mx-auto flex max-w-[1160px] flex-col px-4 mobile:flex-row">
        {/* ---- Logo + fondo (solo desktop) ---- */}
        <div className="relative hidden w-[280px] shrink-0 items-center mobile:flex">
          <Image
            src="/images/footer/fondo-logo.png"
            alt=""
            width={170}
            height={195}
            aria-hidden
            className="pointer-events-none absolute left-[50px] top-0 h-[195px] w-auto"
          />
          <Image
            src="/images/footer/logo-footer-club.svg"
            alt="Club El Tiempo Vivamos"
            width={170}
            height={74}
            className="relative z-10 ml-6 mt-16 h-[74px] w-[170px]"
          />
        </div>

        {/* ---- Contenido ---- */}
        <div className="flex flex-1 flex-col">
          {/* Fila: enlaces + redes */}
          <div className="flex flex-col gap-6 py-6 mobile:flex-row mobile:justify-between">
            {/* Columna izquierda */}
            <ul className="flex flex-col items-center gap-1 text-center mobile:items-start mobile:text-left">
              {LINKS_LEFT.map((l) => (
                <li key={l.t} className="px-2.5">
                  <FooterLink {...l} />
                </li>
              ))}
              {/* En mobile, el bloque de datos va en la columna izquierda */}
              <li className="mt-2 px-2.5 mobile:hidden">
                <DataProtection />
              </li>
            </ul>

            {/* Columna derecha */}
            <ul className="flex flex-col items-center gap-1 text-center mobile:items-start mobile:text-left">
              {LINKS_RIGHT.map((l) => (
                <li key={l.t} className="px-2.5">
                  <FooterLink {...l} />
                </li>
              ))}
              {/* En desktop, el bloque de datos va en la columna derecha */}
              <li className="mt-2 hidden px-2.5 mobile:block">
                <DataProtection />
              </li>
            </ul>

            {/* Redes (solo desktop) */}
            <div className="hidden flex-col gap-2 pl-8 mobile:flex">
              <p className="font-maven text-[16px] leading-6 text-white">
                Síguenos en nuestras redes sociales
              </p>
              {/* Íconos del sprite real de producción (sprite-header2.svg) */}
              <div className="mt-2 flex items-center gap-6">
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-block bg-no-repeat transition hover:opacity-70"
                  style={{ backgroundImage: "url(/images/sprite-header2.svg)", backgroundPosition: "-3px -269px", width: 32, height: 32 }}
                />
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-block bg-no-repeat transition hover:opacity-70"
                  style={{ backgroundImage: "url(/images/sprite-header2.svg)", backgroundPosition: "-114px -269px", width: 32, height: 32 }}
                />
                <a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="inline-block bg-no-repeat transition hover:opacity-70"
                  style={{ backgroundImage: "url(/images/sprite-header2.svg)", backgroundPosition: "-162px -266px", width: 47, height: 35 }}
                />
              </div>
            </div>
          </div>

          {/* Fila: copyright + SIC */}
          <div className="flex flex-col items-center gap-3 border-t border-[#202240] py-2 text-center mobile:flex-row mobile:text-left">
            <div className="flex-1 mobile:border-r mobile:border-[#202240] mobile:pr-4">
              <p className="font-maven text-[10px] leading-[13px] text-white">
                PBX: 57 (1) 2940100. Bogotá 426 60 00 Opc. 1-4 línea nacional 01 8000 110 990.
                Dirección: Avenida Calle 26 N 68B - 70 · Nit: 860001022-7
              </p>
              <p className="font-maven text-[10px] leading-[13px] text-white">
                COPYRIGHT © {year} CEET Prohibida su reproducción total o parcial, así como su
                traducción a cualquier idioma sin autorización escrita de su titular
              </p>
            </div>
            <a
              href="https://www.sic.gov.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4"
              aria-label="Superintendencia de Industria y Comercio"
            >
              <Image
                src="/images/footer/logo-sic.svg"
                alt="Logo SIC"
                width={50}
                height={50}
                className="w-[50px]"
              />
            </a>
          </div>
        </div>
      </div>
      {/* ---- Descarga la app (desktop, oculto < 720px como en legacy) ---- */}
      <div className="hidden h-[138px] flex-col items-center justify-center min-[720px]:flex">
        <p className="mb-4 font-maven text-[14px] text-white">Descarga nuestra app</p>
        <div className="flex items-center gap-4">
          <a
            href={APP.googlePlay}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Disponible en Google Play"
            className="inline-block bg-no-repeat"
            style={{
              backgroundImage: "url(/images/sprites-header-footer.svg)",
              backgroundPosition: "-342px -264px",
              width: 136,
              height: 42,
            }}
          />
          <a
            href={APP.appStore}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar en el App Store"
            className="inline-block bg-no-repeat"
            style={{
              backgroundImage: "url(/images/sprites-header-footer.svg)",
              backgroundPosition: "-494px -265px",
              width: 123,
              height: 42,
            }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
