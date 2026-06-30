"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, User, Search, LogOut, PiggyBank, Mail, ChevronDown, X } from "lucide-react";
import { CATEGORIES } from "@/utils/JSONObjects";
import { useAuth } from "@/context/AuthContext";

/** Subrayado de color por categoría — replica el `:after` (50×4px) del nav2 legacy. */
const CATEGORY_UNDERLINE: Record<string, string> = {
  hogar: "after:bg-cat-purple",
  entretenimiento: "after:bg-cat-blue",
  turismo: "after:bg-cat-yellow",
  gastronomia: "after:bg-cat-red",
  ropa: "after:bg-cat-green",
  salud: "after:bg-cat-aqua",
};

/** Sombra dura del logo por segmento (legacy .logo-clasico / .logo-preferente). */
const LOGO_SHADOW: Record<string, string> = {
  clasico: "shadow-[4px_0_0_0_var(--color-accent)]",
  preferente: "shadow-[4px_0_0_0_#afafaf]",
  basico: "shadow-[6px_0_0_0_var(--color-ink)]",
};

// URLs externas (El Tiempo)
const URL_SUBSCRIBE =
  "https://www.eltiempo.com/suscripcion-digital?utm_source=website&utm_medium=ribbon&utm_campaign=PaywallLandingOffer&utm_content=LandingClubVivamos_Multipaquete";
const URL_MY_SUBSCRIPTION = "https://suscripciones.eltiempo.com";
const URL_CONTACT = "https://eltiempo.zendesk.com/hc/es-419/requests/new";

/* ---------- Sub-componentes de dropdown (hover/focus) ---------- */

const Dropdown = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="group relative flex items-center">
    <button className="flex items-center gap-1 font-maven text-[14px] font-medium text-primary transition-colors hover:text-primary-hover">
      {label}
      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
    </button>
    {/* Panel: blanco, 210px, alineado a la derecha, sombra gray-1 (legacy) */}
    <div className="invisible absolute right-0 top-full z-20 w-[210px] bg-white opacity-0 shadow-[0_6px_16px_0_var(--color-gray-1)] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <ul className="px-5">{children}</ul>
    </div>
  </div>
);

const DD_ITEM =
  "block w-full py-4 text-left font-maven text-[14px] text-primary transition-colors hover:text-primary-hover";

const DdItem = ({
  href,
  external,
  onClick,
  children,
}: {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <li className="border-b border-gray-3 last:border-b-0">
    {onClick ? (
      <button onClick={onClick} className={DD_ITEM}>
        {children}
      </button>
    ) : external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={DD_ITEM}>
        {children}
      </a>
    ) : (
      <Link href={href ?? "/"} className={DD_ITEM}>
        {children}
      </Link>
    )}
  </li>
);

/* ============================ Header ============================ */

const Header = () => {
  const router = useRouter();
  const { state, logout, partnerTheme } = useAuth();
  const { user, authenticated } = state;

  const userType = partnerTheme.labelClass; // "basico" | "clasico" | "preferente"
  const isMember = userType === "clasico" || userType === "preferente";

  const [isOpen, setIsOpen] = useState(false); // drawer mobile
  const [isSticky, setIsSticky] = useState(false); // sticky desktop
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Sticky al hacer scroll (legacy: scrollY > 110)
  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 110);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Foco automático al abrir el buscador
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = () => {
    const q = query.trim();
    if (q) router.push(`/buscar?keyword=${encodeURIComponent(q)}`);
  };

  return (
    <header className="relative z-[9999] w-full">
      {/* =========================================================
          DESKTOP  (>= 812px · breakpoint `mobile`)
          ========================================================= */}
      <div
        className={`hidden mobile:block ${
          isSticky
            ? "mobile:fixed mobile:inset-x-0 mobile:top-0 mobile:z-[9999] mobile:shadow-md"
            : "relative"
        }`}
      >
        {/* nav1 — barra blanca utilitaria (full-bleed) */}
        <div className="bg-white">
          <div className="mx-auto flex h-10 max-w-[1160px] items-center justify-end gap-5 px-4">
            {/* Logo compacto cuando está sticky */}
            {isSticky && (
              <Link href="/" aria-label="Inicio" className="mr-auto">
                <Image
                  src="/images/header/icono-header-fixed2.svg"
                  alt="Club El Tiempo Vivamos"
                  width={80}
                  height={35}
                  className="h-7 w-auto"
                />
              </Link>
            )}

            {/* Suscripción — promo CMS en legacy; placeholder por ahora */}
            <Link
              href="/quiero-el-club"
              className="rounded-full bg-danger px-4 py-1 text-[12px] font-medium uppercase tracking-wide text-white transition hover:brightness-95"
            >
              Suscríbete ahora
            </Link>

            {/* Buscador expandible */}
            <div className="flex items-center gap-1">
              {searchOpen && (
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  placeholder="Buscar..."
                  className="w-[220px] shrink-0 rounded-full border border-gray-3 px-3 py-1 font-maven text-[14px] text-gray-1 outline-none focus:border-primary"
                />
              )}
              <button
                aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"}
                onClick={() => setSearchOpen((o) => !o)}
                className="text-gray-1 transition hover:text-primary"
              >
                {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
              </button>
            </div>

            {/* Correo / Contáctanos */}
            <a
              href={URL_CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contáctanos"
              className="text-gray-1 transition hover:text-primary"
            >
              <Mail className="h-[18px] w-[18px]" />
            </a>

            {/* Acerca del club (dropdown) */}
            <Dropdown label="Acerca del club">
              <DdItem href="/quienes-somos">Quiénes somos »</DdItem>
              {userType === "preferente" ? null : userType === "clasico" ? (
                <DdItem href="/preguntas-frecuentes#faq2">¿Cómo ser preferente? »</DdItem>
              ) : (
                <DdItem href="/preguntas-frecuentes">¿Cómo ser socio? »</DdItem>
              )}
            </Dropdown>

            {/* Login / Usuario (dropdown) */}
            {authenticated && user ? (
              <Dropdown label={user.first_name || "Mi cuenta"}>
                <DdItem href="/user/account">Configurar mis datos »</DdItem>
                {isMember ? (
                  <DdItem href={URL_MY_SUBSCRIPTION} external>
                    Mi Suscripción »
                  </DdItem>
                ) : (
                  <DdItem href={URL_SUBSCRIBE} external>
                    Suscribirme »
                  </DdItem>
                )}
                <DdItem href="/user/mis-ahorros">Mi ahorro »</DdItem>
                {isMember && <DdItem href="/invitacion-beneficiarios">Inscribir Beneficiarios »</DdItem>}
                <DdItem href="/preguntas-frecuentes">Preguntas frecuentes »</DdItem>
                {userType === "clasico" && (
                  <DdItem href="/preguntas-frecuentes#faq2">¿Cómo ser Preferente? »</DdItem>
                )}
                <DdItem onClick={() => logout()}>Cerrar Sesión</DdItem>
              </Dropdown>
            ) : (
              <Link
                href="/login"
                className="font-maven text-[14px] font-medium text-primary transition hover:text-primary-hover"
              >
                Registro/Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* nav2 — barra navy de categorías (full-bleed) */}
        <div className="bg-ink">
          <div className="mx-auto flex h-10 max-w-[1160px] items-center justify-end gap-1 px-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.route}`}
                className={`relative flex h-10 items-center px-2.5 font-maven text-[14px] uppercase text-white transition-colors max-[1100px]:text-[13px] max-[935px]:px-1.5 max-[935px]:text-[12px] after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-[50px] after:-translate-x-1/2 after:opacity-0 after:transition-opacity hover:after:opacity-100 ${CATEGORY_UNDERLINE[cat.className] ?? ""}`}
              >
                {cat.title}
              </Link>
            ))}

            {/* Directorio Aliados — botón rojo (header .btn-directorio) */}
            <Link
              href="/directorio-aliados"
              className="ml-3 flex h-8 items-center rounded-[14px] bg-danger px-4 font-maven text-[12px] font-bold uppercase tracking-wide text-white transition hover:brightness-90"
            >
              Directorio Aliados
            </Link>
          </div>
        </div>

        {/* Logo circular sobresaliente + badge de socio (solo cuando NO sticky) */}
        {!isSticky && (
          <div className="absolute top-0 left-[max(1rem,calc(50%_-_580px))] z-10 flex items-center">
            <Link
              href="/"
              aria-label="Club El Tiempo Vivamos — Inicio"
              className={`flex h-[130px] w-[130px] -translate-y-[10px] items-center justify-center rounded-full bg-white ${LOGO_SHADOW[userType] ?? LOGO_SHADOW.basico}`}
            >
              <Image
                src="/images/header/logo-header3.svg"
                alt="Club El Tiempo Vivamos"
                width={126}
                height={50}
                className="h-auto w-[104px]"
                priority
              />
            </Link>

            {/* Badge de socio (clásico / preferente) */}
            {isMember && (
              <span
                className={`-ml-3 -translate-y-[10px] rounded-r-2xl px-4 py-1 font-barlow text-[16px] font-medium uppercase tracking-wide ${
                  userType === "clasico"
                    ? "bg-sky-2 text-[#054249]"
                    : "bg-gradient-silver text-ink"
                }`}
              >
                {userType === "clasico" ? "Socio Clásico" : "Socio Preferente"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Spacer para evitar salto de contenido cuando el header desktop es fixed */}
      {isSticky && <div aria-hidden className="hidden h-20 mobile:block" />}

      {/* =========================================================
          MOBILE  (< 812px)
          ========================================================= */}
      <div className="flex items-center justify-between bg-white p-4 shadow-sm mobile:hidden">
        <button onClick={() => setIsOpen(true)} aria-label="Abrir menú">
          <Menu className="h-6 w-6 text-ink" />
        </button>
        <Link href="/" aria-label="Inicio">
          <Image
            src="/images/header/icono-header-fixed2.svg"
            alt="Club El Tiempo Vivamos"
            width={80}
            height={35}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <Link href={authenticated ? "/user/account" : "/login"} aria-label="Mi cuenta">
          <User className="h-6 w-6 text-gray-1" />
        </Link>
      </div>

      {/* Overlay del drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 mobile:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer lateral mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform overflow-y-auto bg-white transition-transform duration-300 mobile:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-line p-4">
          <div className="flex w-full items-center gap-2 rounded bg-gray-light p-2">
            <Search className="h-4 w-4 text-gray-3" />
            <input
              type="text"
              placeholder="BUSCAR"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {authenticated && user && (
          <div className="flex items-center justify-between border-b border-gray-line bg-gray-light/50 p-4">
            <Link
              href="/user/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-1 hover:text-primary"
            >
              <User className="h-4 w-4" /> Hola, {user.first_name}
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              aria-label="Cerrar sesión"
              className="text-danger hover:brightness-90"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        <nav className="flex flex-col">
          <Link
            href="/directorio-aliados"
            onClick={() => setIsOpen(false)}
            className="border-b border-gray-line p-4 font-bold text-danger"
          >
            DIRECTORIO ALIADOS
          </Link>

          {authenticated && (
            <Link
              href="/user/mis-ahorros"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 border-b border-gray-line p-4 font-medium text-gray-1 transition-colors hover:bg-gray-light"
            >
              <PiggyBank className="h-4 w-4 text-primary" /> Mis Ahorros
            </Link>
          )}

          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.route}`}
              onClick={() => setIsOpen(false)}
              className="border-b border-gray-line p-4 font-medium uppercase text-gray-1 transition-colors hover:bg-gray-light"
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
