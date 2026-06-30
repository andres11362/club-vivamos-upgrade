"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCategory, getUserType } from "@/utils/JSONObjects";
import {
  gtmFeaturedSlider,
  gtmFeaturedSliderControls,
  gtmBenefitClick,
  gtmFetchToBenefitStructure,
} from "@/utils/gtmUtils";

export interface CarouselSlide {
  id: string | number;
  image: string;       // Desktop background
  imageMobile?: string; // Mobile background
  logo: string;
  title: string;
  subtitle: string;
  legal: string;
  externalLink?: string;
  titleseo?: string;
  categoryId?: number | string;
  segmentId?: number | string;
  alliedName?: string;
}

export interface CarouselProps {
  readonly slides?: readonly CarouselSlide[];
  readonly delay?: number; // Delay in seconds (e.g. 5)
  readonly duration?: number; // Duration in seconds (e.g. 1)
}

const DEFAULT_SLIDES: readonly CarouselSlide[] = [
  {
    id: 1,
    image: "/fondo-doctora.jpg",
    logo: "/colsanitas-logo.png",
    title: "TARIFA EXCLUSIVA",
    subtitle: "PLAN ESENCIAL ESPECIAL DE $39.900 + IVA POR USUARIO",
    legal: "Válido del 01 de enero hasta el 31 de diciembre de 2026. Vigencia sujeta a modificaciones y/o cambios de la alianza.",
  },
  {
    id: 2,
    image: "/otro-fondo.jpg",
    logo: "/otra-marca.png",
    title: "OTRA OFERTA",
    subtitle: "DESCRIPCIÓN DE LA OTRA OFERTA",
    legal: "Términos y condiciones...",
  },
];

const Carousel: React.FC<CarouselProps> = ({ 
  slides = DEFAULT_SLIDES,
  delay = 5,
  duration = 1,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  // Track impressions on mount and when slides list changes
  useEffect(() => {
    if (activeSlides.length > 0) {
      // Map slides to format expected by GTM mapper
      const gtmInput = activeSlides.map((slide) => ({
        title: slide.title,
        benefitId: slide.id,
        discount: slide.subtitle,
        alliedName: slide.alliedName || slide.title,
        categoryId: typeof slide.categoryId === "number" || typeof slide.categoryId === "string" ? slide.categoryId : 1,
        segmentId: typeof slide.segmentId === "number" ? slide.segmentId : 2,
      }));

      const featuredGtm = gtmFetchToBenefitStructure(gtmInput, "home - banner");
      gtmFeaturedSlider(featuredGtm);
    }
  }, [activeSlides]);

  // Autoplay functionality using delay (delay is in seconds, defaults to 5s)
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length);
    }, delay * 1000);

    return () => clearInterval(interval);
  }, [currentIndex, activeSlides.length, delay]);

  const handlePrevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? activeSlides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    // GTM: Track manual control click (Previous)
    const slide = activeSlides[currentIndex];
    const categoryRoute = slide.categoryId ? getCategory(slide.categoryId).route : "beneficios";
    const path = `/${categoryRoute}/${slide.titleseo || "detalle"}/${slide.id}`;
    gtmFeaturedSliderControls(slide.title, currentIndex + 1, "Back", path);
  };

  const handleNextSlide = () => {
    const isLastSlide = currentIndex === activeSlides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);

    // GTM: Track manual control click (Next)
    const slide = activeSlides[currentIndex];
    const categoryRoute = slide.categoryId ? getCategory(slide.categoryId).route : "beneficios";
    const path = `/${categoryRoute}/${slide.titleseo || "detalle"}/${slide.id}`;
    gtmFeaturedSliderControls(slide.title, currentIndex + 1, "Next", path);
  };

  return (
    <div className="relative w-full h-[430px] bg-ink overflow-hidden font-barlow">
      
      {/* =========================================
          Pista del Carrusel (Track)
          ========================================= */}
      <div
        className="flex w-full h-full transition-transform ease-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          transitionDuration: `${duration * 1000}ms`
        }}
      >
        {activeSlides.map((slide, index) => {
          const categoryRoute = slide.categoryId ? getCategory(slide.categoryId).route : "beneficios";
          const detailUrl = slide.externalLink
            ? slide.externalLink
            : `/${categoryRoute}/${slide.titleseo || "detalle"}/${slide.id}`;

          // Color de acento por segmento (azul clásico / amarillo preferente)
          const isPref = getUserType(slide.segmentId ?? "") === "preferente";
          const discountColor = isPref ? "text-secondary" : "text-accent";
          const barColor = isPref ? "border-secondary" : "border-accent";

          const handleSlideClick = () => {
            const segmentLabel = slide.segmentId ? getUserType(slide.segmentId) : "clasico";
            gtmBenefitClick(
              slide.title,
              slide.id,
              slide.subtitle,
              slide.alliedName || slide.title,
              slide.categoryId ? getCategory(slide.categoryId).title : "Beneficios",
              segmentLabel,
              index + 1,
              "Banner Superior"
            );
          };

          return (
            <div key={slide.id} className="min-w-full h-full relative">
              
              {/* Full overlay link (external or internal) */}
              {slide.externalLink ? (
                <a
                  href={slide.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20 cursor-pointer"
                  onClick={handleSlideClick}
                  aria-label={`Ir a beneficio ${slide.title}`}
                />
              ) : (
                <Link
                  href={detailUrl}
                  className="absolute inset-0 z-20 cursor-pointer"
                  onClick={handleSlideClick}
                  aria-label={`Ir a beneficio ${slide.title}`}
                />
              )}

              {/* Imagen de fondo para Desktop */}
              {slide.image && (
                <div className={`absolute inset-0 w-full h-full ${slide.imageMobile ? "hidden md:block" : "block"}`}>
                  <Image
                    src={slide.image}
                    alt="Fondo"
                    fill
                    className="object-cover object-top md:object-center"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              )}

              {/* Imagen de fondo para Móvil */}
              {slide.imageMobile && (
                <div className="absolute inset-0 w-full h-full block md:hidden">
                  <Image
                    src={slide.imageMobile}
                    alt="Fondo Móvil"
                    fill
                    className="object-cover object-top md:object-center"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              )}
              
              {/* Overlay: oscurece ambos bordes (gradiente simétrico como producción) */}
              <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none md:bg-gradient-to-r md:from-ink/90 md:via-transparent md:to-ink/90"></div>

              {/* Contenido (alineado a la derecha con barra de acento, como producción) */}
              <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-center px-12 pb-16 text-center text-white md:items-end md:text-right">
                <div className={`max-w-md md:border-l-4 md:pl-5 ${barColor}`}>
                  {/* Logo del aliado */}
                  {slide.logo && (
                    <div className="relative mx-auto mb-3 h-[70px] w-[70px] md:ml-auto md:mr-0 md:h-[100px] md:w-[100px]">
                      <Image
                        src={slide.logo}
                        alt="Logo Aliado"
                        fill
                        className="rounded-br-[30px] object-contain"
                        sizes="100px"
                      />
                    </div>
                  )}
                  {/* Nombre del aliado — BarlowCondensed-SemiBold 26px */}
                  <h2 className="font-barlow text-[22px] font-semibold uppercase leading-[30px] [text-shadow:2px_1px_var(--color-ink)] md:text-[26px]">
                    {slide.title}
                  </h2>
                  {/* Descuento — 45px, color por segmento */}
                  <h3 className={`mt-1 font-barlow text-[28px] font-semibold uppercase leading-tight md:text-[45px] ${discountColor}`}>
                    {slide.subtitle}
                  </h3>
                  {/* Legal */}
                  <p className="mt-3 font-barlow text-[12px] leading-4 text-white/80">
                    {slide.legal}
                  </p>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

      {/* =========================================
          Controles (Flechas)
          ========================================= */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-2 md:left-6 z-30 p-2 md:p-3 bg-black/20 hover:bg-black/50 text-white rounded-md transition backdrop-blur-sm cursor-pointer"
            aria-label="Anterior beneficio"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={handleNextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-2 md:right-6 z-30 p-2 md:p-3 bg-black/20 hover:bg-black/50 text-white rounded-md transition backdrop-blur-sm cursor-pointer"
            aria-label="Siguiente beneficio"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* =========================================
          Curva Inferior Blanca (SVG)
          ========================================= */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px] pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[40px] md:h-[60px] lg:h-[80px]"
        >
          <path
            d="M0,0 L600,120 L1200,0 L1200,120 L0,120 Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>

    </div>
  );
};

export default Carousel;