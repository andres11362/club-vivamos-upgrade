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
    <div className="relative w-full h-[450px] md:h-[450px] lg:h-[450px] bg-[#03091e] overflow-hidden font-barlow">
      
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
              
              {/* Overlay Oscuro / Gradiente (Crucial para leer el texto) */}
              <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-r md:from-[#03091e]/90 md:to-transparent md:w-2/3 lg:w-1/2 z-10 pointer-events-none"></div>

              {/* Contenido de la Diapositiva */}
              <div className="relative z-10 max-w-7xl mx-auto px-12 md:px-20 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white pb-16 pointer-events-none">
                
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4">
                   {slide.logo && (
                     <div className="w-24 md:w-32 bg-white p-2 rounded-lg shadow-md h-16 relative">
                       <Image 
                         src={slide.logo} 
                         alt="Logo Aliado" 
                         fill
                         className="object-contain p-2"
                         sizes="(max-width: 768px) 96px, 128px"
                       />
                     </div>
                   )}
                   <div>
                      <h2 className="text-3xl md:text-5xl font-bold font-barlow-condensed uppercase drop-shadow-md">
                        {slide.title}
                      </h2>
                   </div>
                </div>
                
                <h3 className="text-lg md:text-2xl text-cyan-300 font-semibold mb-6 max-w-2xl drop-shadow">
                  {slide.subtitle}
                </h3>
                
                <p className="text-[10px] md:text-xs text-gray-300 max-w-xl opacity-80">
                  {slide.legal}
                </p>
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