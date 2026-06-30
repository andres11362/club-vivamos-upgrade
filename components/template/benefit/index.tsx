"use client";

import React from 'react';
import { Home, Calendar, ShoppingBag, MapPin, Share2, Globe, HeartPulse, Tent, Utensils, Plane, ShieldCheck } from 'lucide-react';
import Breadcrumb from '@/components/molecules/breadcrumb';
import { Benefit, HeadquartersState } from '@/context/BenefitsContext';
import { CATEGORIES } from '@/utils/JSONObjects';

interface BeneficioDetailTemplateProps {
  readonly benefit: Benefit;
  readonly headquarters: HeadquartersState;
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

const getCategoryIcon = (categoryId: number | undefined) => {
  switch (categoryId) {
    case 1: return Home;
    case 2: return ShoppingBag;
    case 3: return Utensils;
    case 4: return HeartPulse;
    case 5: return Plane;
    case 6: return ShoppingBag;
    default: return HeartPulse;
  }
};

const BeneficioDetailTemplate: React.FC<BeneficioDetailTemplateProps> = ({ benefit, headquarters }) => {
  const imageBenefitUrl = getAbsoluteUrl(benefit.imageBenefit?.original || benefit.imageBenefit?.medium);
  const imageLogoUrl = getAbsoluteUrl(benefit.imageLogo?.original || benefit.imageLogo?.medium);

  const categoryInfo = CATEGORIES.find(c => c.id === benefit.categoryId);
  const categoryTitle = categoryInfo ? categoryInfo.title : 'Beneficios';
  const CategoryIcon = getCategoryIcon(benefit.categoryId);

  const segmentLabel = benefit.segmentId === 3 
    ? "SOCIOS PREFERENTES" 
    : benefit.segmentId === 2 
    ? "SOCIOS CLÁSICOS" 
    : "TODOS LOS SOCIOS";

  const formattedDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-CO');
    } catch {
      return dateStr;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${benefit.alliedName} - ${benefit.title}`,
        text: `Descubre este beneficio del Club EL TIEMPO: ${benefit.discount}`,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      alert(`Comparte este beneficio: ${window.location.href}`);
    }
  };

  // Compile total branch count
  const totalBranches = Object.keys(headquarters).reduce((acc, key) => {
    return acc + (headquarters[key]?.info?.length || 0);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-white">
      <main className="flex-grow pb-16">
        
        {/* =========================================
            SECCIÓN SUPERIOR: Imagen y Contenido Principal
            ========================================= */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LADO IZQUIERDO: Imagen Principal */}
            <div className="lg:col-span-5 w-full relative">
              <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden shadow-lg">
                {imageBenefitUrl ? (
                  <img 
                    src={imageBenefitUrl} 
                    alt={benefit.alliedName || 'Beneficio'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2c2b5e]/10 flex items-center justify-center text-gray-400">
                    Sin imagen disponible
                  </div>
                )}
                {/* Icono de Categoría flotante */}
                <div className="absolute top-0 right-8 bg-[#6f2c91] p-3 rounded-b-xl shadow-md">
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* LADO DERECHO: Información */}
            <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
              <Breadcrumb />
              
              {/* Cabecera del beneficio: Logos y Título */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-6 gap-6">
                <div className="flex items-center gap-6">
                  <h1 className="text-2xl font-bold text-[#03091e] uppercase">{benefit.alliedName}</h1>
                  <div className="h-12 border-l border-gray-300"></div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-teal-400">{benefit.title}</span>
                    <span className="text-xs text-teal-500 font-bold uppercase tracking-wide leading-tight">
                      {benefit.discount}
                    </span>
                  </div>
                </div>
                {imageLogoUrl && (
                  <img src={imageLogoUrl} alt={`Logo ${benefit.alliedName}`} className="h-12 object-contain" />
                )}
              </div>

              {/* Tags de Categoría y Aplicación */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                  <CategoryIcon className="w-5 h-5 text-gray-500" /> {categoryTitle}
                </div>
                <div className="flex flex-col text-xs font-semibold">
                  <span className="text-gray-400">APLICA PARA SOCIOS:</span>
                  <span className="text-[#03091e] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-teal-500" /> {segmentLabel}
                  </span>
                </div>
              </div>

              {/* Descripción Larga / Lead */}
              {benefit.lead && (
                <div 
                  className="prose prose-sm max-w-none text-gray-600 mb-8 leading-relaxed text-justify md:text-left"
                  dangerouslySetInnerHTML={{ __html: benefit.lead }}
                />
              )}

              {benefit.content && (
                <div 
                  className="prose prose-sm max-w-none text-gray-500 mb-8 text-xs leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: benefit.content }}
                />
              )}

              {/* Grilla de Detalles Técnicos (Vigencia, Modalidad) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-b border-gray-100 py-6">
                
                <div className="flex flex-col gap-6">
                  {(benefit.validFrom || benefit.validTo) && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-sm font-bold text-[#03091e]">Vigencia del descuento</span>
                        <span className="text-xs text-gray-500">
                          Válido {benefit.validFrom ? `del ${formattedDate(benefit.validFrom)}` : ''} {benefit.validTo ? `al ${formattedDate(benefit.validTo)}` : ''}
                        </span>
                      </div>
                    </div>
                  )}
                  {benefit.modality && (
                    <div className="flex items-start gap-3">
                      <ShoppingBag className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <span className="block text-sm font-bold text-[#03091e]">Modalidad de la compra</span>
                        <span className="text-xs text-gray-500">{benefit.modality}</span>
                      </div>
                    </div>
                  )}
                </div>

                {benefit.days && (
                  <div className="flex flex-col">
                    <span className="block text-sm font-bold text-[#03091e] mb-2">Días que aplica</span>
                    <div className="flex flex-wrap gap-2">
                      {String(benefit.days).split(',').map((dia, i) => (
                        <div key={i} className="px-2.5 py-1 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                          {dia.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Links y Compartir */}
              <div className="flex flex-col gap-4 mb-8">
                {benefit.siteUrl && (
                  <a 
                    href={benefit.siteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-max px-6 py-2 bg-teal-600 text-white text-sm font-bold rounded-full hover:bg-teal-700 transition shadow-sm"
                  >
                    <Globe className="w-4 h-4" /> Ir al sitio web aliado
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm font-bold text-[#03091e]">
                Comparte este beneficio 
                <Share2 className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" onClick={handleShare} />
              </div>

              {/* Términos y condiciones detallados */}
              {benefit.terms && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold text-[#03091e] mb-2">Términos y condiciones</h3>
                  <div 
                    className="text-xs text-gray-500 leading-relaxed text-justify space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: benefit.terms }}
                  />
                </div>
              )}

            </div>
          </div>
        </section>

        {/* =========================================
            SECCIÓN INFERIOR: Localiza tu Sede (Mapa)
            ========================================= */}
        {totalBranches > 0 && (
          <section className="w-full bg-gray-50 mt-12 pb-16">
            
            {/* Título de sección superpuesto con icono */}
            <div className="flex flex-col items-center -translate-y-6">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-[#03091e] uppercase tracking-wide">
                LOCALIZA TU SEDE
              </h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Lista de ciudades y sedes (Desktop: Izquierda) */}
                <div className="lg:col-span-5 w-full flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(headquarters).map((key) => {
                    const cityHead = headquarters[key];
                    if (!cityHead || !cityHead.city) return null;

                    return (
                      <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between font-bold text-sm text-[#03091e] border-b border-gray-50 pb-2 mb-2">
                          <span className="flex items-center gap-1.5 uppercase">
                            <MapPin className="w-4 h-4 text-red-500" /> {cityHead.city}
                          </span>
                          <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">
                            {cityHead.info.length} sedes
                          </span>
                        </div>
                        <ul className="text-xs text-gray-500 space-y-2.5 pl-4 list-disc">
                          {cityHead.info.map((branch: any) => (
                            <li key={branch.id} className="leading-tight">
                              <span className="font-semibold text-gray-700 block">{branch.address || 'Sede'}</span>
                              {branch.phone && (
                                <span className="text-[10px] text-gray-400 block mt-0.5">Tel: {branch.phone}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Contenedor del Mapa (Desktop: Derecha) */}
                <div className="lg:col-span-7 w-full h-[300px] lg:h-[450px] bg-[#2c2b5e]/5 rounded-3xl overflow-hidden relative shadow-inner border border-gray-100 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-3 text-red-500">
                    <MapPin className="w-8 h-8 stroke-1 animate-bounce" />
                  </div>
                  <h3 className="text-sm font-bold text-[#03091e] uppercase">Mapa de Cobertura</h3>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Visualiza las {totalBranches} sedes de {benefit.alliedName} disponibles para ti.
                  </p>
                </div>

              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default BeneficioDetailTemplate;
