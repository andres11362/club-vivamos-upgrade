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

/* Estilos por bloque (container-home-1..7 de _home.scss): aspect / overlay / tipografía */
const BLOCK_STYLES: Record<
  number,
  { aspect: string; overlay: string; title: string; desc: string }
> = {
  1: { aspect: "aspect-[376/240]", overlay: "bottom-[14px] left-[25px] text-ink", title: "font-barlow font-medium text-[18px] leading-[23px]", desc: "font-barlow font-medium text-[20px] leading-[25px]" },
  2: { aspect: "aspect-[464/240]", overlay: "bottom-[14px] left-[25px] text-ink", title: "font-barlow font-medium text-[18px] leading-[23px]", desc: "font-barlow font-medium text-[20px] leading-[25px]" },
  3: { aspect: "aspect-[260/416]", overlay: "bottom-[25px] left-[28px] right-[28px] text-center text-white", title: "font-barlow font-semibold text-[16px] leading-5", desc: "font-barlow text-[15px] leading-5 mt-[5px]" },
  4: { aspect: "aspect-[870/472]", overlay: "top-[30%] left-[42px] text-white", title: "font-barlow font-semibold text-[28px] leading-[34px]", desc: "font-barlow text-[26px] leading-[30px] mt-[15px] w-1/2" },
  5: { aspect: "aspect-[260/262]", overlay: "top-[28%] left-[26px] text-white", title: "font-barlow font-medium text-[20px] leading-[23px]", desc: "font-barlow text-[20px] leading-[23px] mt-[10px] w-4/5" },
  6: { aspect: "aspect-[540/248]", overlay: "bottom-[25px] left-[35px] pr-[15px] text-ink", title: "font-barlow font-semibold text-[20px] leading-[27px]", desc: "font-maven text-[13px] leading-4" },
  7: { aspect: "aspect-[540/248]", overlay: "bottom-[25px] left-[35px] pr-[15px] text-ink", title: "font-barlow font-semibold text-[20px] leading-[27px]", desc: "font-maven text-[13px] leading-4" },
};

const Block = ({ data, className = "" }: { data?: CustomBlockItem; className?: string }) => {
  if (!data) return null;
  const s = BLOCK_STYLES[Number(data.block)] ?? BLOCK_STYLES[1];
  return (
    <a
      href={data.siteUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${s.aspect} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getAbsoluteUrl(data.imageCustomBanner)}
        alt={`Banner ${data.title}`}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
      />
      <span className={`absolute uppercase ${s.overlay}`}>
        <span className={`block ${s.title}`}>{data.title}</span>
        <span className={`block ${s.desc}`}>{data.description}</span>
      </span>
    </a>
  );
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

  // Bloque por número (mapea a container-home-N) para la masonry
  const block = (n: number) => initialBlocks.find((b) => Number(b.block) === n);

  return (
    <main className="flex-grow bg-white">

      {/* Carrusel superior hidratado con destacados por segmento */}
      <Carousel slides={carouselSlides} />

      <section className="mx-auto max-w-[1140px] px-4 py-12 text-center">
        {/* Título — BarlowCondensed-SemiBold 36px (desktop) / 19px (mobile) */}
        <h1 className="font-barlow text-[19px] font-semibold leading-[23px] text-ink min-[720px]:text-[36px] min-[720px]:leading-none">
          DISFRUTA UN MUNDO DE BENEFICIOS
        </h1>
        {/* Descripción — MavenPro 16/24, oculta en mobile como en producción */}
        <p className="mx-auto mt-[39px] mb-[82px] hidden max-w-[873px] font-maven text-[16px] leading-6 text-ink min-[720px]:block">
          Somos el programa de fidelización y lealtad de EL TIEMPO CASA EDITORIAL.
          Estamos conformados por un selecto grupo de suscriptores de los periódicos El Tiempo y Portafolio,
          las revistas Aló, Bocas y suscriptores de eltiempo.com. Con el Club aprovecha descuentos hasta del 50% en más de
          130 marcas aliadas distribuidas en 6 categorías. Podrás ahorrar en grande y disfrutar experiencias exclusivas
          para compartir con aquellos que más quieres.
        </p>
      </section>

      {/* Bloques destacados — masonry "Alianzas preferenciales" (container-home-1..7) */}
      {initialBlocks.length > 0 && (
        <section className="mx-auto max-w-[1160px] px-4 pb-12">
          <p className="mb-3 ml-[30px] font-maven text-[12px] uppercase text-ink min-[768px]:hidden">
            Alianzas preferenciales
          </p>

          {/* Fila principal: izquierda (1,2 / 4) + derecha (3 / 5) */}
          <div className="flex flex-col gap-[30px] min-[768px]:flex-row">
            <div className="flex flex-1 flex-col gap-[27px]">
              <div className="flex flex-col gap-[30px] min-[576px]:flex-row">
                <Block data={block(1)} className="min-w-0 min-[576px]:flex-[376]" />
                <Block data={block(2)} className="min-w-0 min-[576px]:flex-[464]" />
              </div>
              <Block data={block(4)} className="w-full" />
            </div>
            <div className="flex flex-col gap-[27px] min-[768px]:w-[260px] min-[768px]:shrink-0">
              <Block data={block(3)} />
              <Block data={block(5)} />
            </div>
          </div>

          {/* Fila inferior: bloques 6 y 7 */}
          <div className="mt-[54px] flex flex-col gap-[30px] min-[768px]:flex-row">
            <Block data={block(6)} className="min-w-0 min-[768px]:flex-1" />
            <Block data={block(7)} className="min-w-0 min-[768px]:flex-1" />
          </div>
        </section>
      )}

      {/* Formulario de Suscripción al Boletín */}
      <Newsletter />
          
    </main>
  );
}

export default HomeTemplate;

