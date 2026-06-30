"use client";

import React from 'react';
import Carousel, { CarouselSlide } from "@/components/molecules/carousel";
import Newsletter from "@/components/molecules/forms/newsletter";
import { BenefitFeatured, CustomBlockItem } from "@/services/homeService";

interface HomeTemplateProps {
  readonly initialFeatured?: readonly BenefitFeatured[];
  readonly initialBlocks?: readonly CustomBlockItem[];
}

const bacoDomain = process.env.BACO 
  ? JSON.parse(process.env.BACO).BASE_DOMAIN
  : 'https://stg.clubvivamos.com'; // fallback

const getAbsoluteUrl = (path: string | undefined) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanedDomain = bacoDomain.endsWith('/') ? bacoDomain.slice(0, -1) : bacoDomain;
  const cleanedPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanedDomain}${cleanedPath}`;
};

const HomeTemplate: React.FC<HomeTemplateProps> = ({ 
  initialFeatured = [], 
  initialBlocks = [] 
}) => {
  // Convert featured benefits to slide structure
  const carouselSlides: CarouselSlide[] = initialFeatured.map((item) => ({
    id: item.benefitId,
    image: getAbsoluteUrl(item.imageHome?.original || item.imageHome?.medium || item.imageBenefit?.original),
    imageMobile: getAbsoluteUrl(item.imageBenefit?.original || item.imageBenefit?.medium),
    logo: getAbsoluteUrl(item.imageLogo?.original || item.imageLogo?.medium),
    title: item.title || '',
    subtitle: item.discount || '',
    legal: item.lead || '',
    externalLink: item.externalLink || '',
    titleseo: item.titleseo || '',
    categoryId: item.categoryId || '',
    segmentId: item.segmentId || '',
    alliedName: item.alliedName || '',
  }));

  return (
    <main className="flex-grow bg-gray-50/20">
      
      {/* Carrusel superior hidratado con destacados por segmento */}
      <Carousel slides={carouselSlides} />

      <section className="max-w-285 mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black">DISFRUTA UN MUNDO DE BENEFICIOS</h1>
        <p className="text-gray-600 max-w-4xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
          Somos el programa de fidelización y lealtad de EL TIEMPO CASA EDITORIAL. 
          Estamos conformados por un selecto grupo de suscriptores de los periódicos El Tiempo y Portafolio,
          las revistas Aló, Bocas y suscriptores de eltiempo.com. Con el Club aprovecha descuentos hasta del 50% en más de 
          130 marcas aliadas distribuidas en 6 categorías. Podrás ahorrar en grande y disfrutar experiencias exclusivas 
          para compartir con aquellos que más quieres.
        </p>
      </section>

      {/* Grid de publicidad y bloques personalizados */}
      {initialBlocks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-[#03091e] mb-6 uppercase tracking-wide">
            Campañas Recomendadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialBlocks.map((block) => {
              const imageUrl = getAbsoluteUrl(block.imageCustomBanner);
              return (
                <div key={block.block} className="col-span-1 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                  <div className="h-44 w-full overflow-hidden relative">
                    <img 
                      src={imageUrl} 
                      alt={block.title} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 text-base mb-1">{block.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">{block.description}</p>
                    
                    {block.siteUrl && (
                      <a 
                        href={block.siteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-auto text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline uppercase tracking-wider"
                      >
                        Más información →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Formulario de Suscripción al Boletín */}
      <Newsletter />
          
    </main>
  );
}

export default HomeTemplate;

