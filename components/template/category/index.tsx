"use client";

import React from 'react';
import Carousel from '@/components/molecules/carousel';
import CategoryCard from '@/components/molecules/cards/CategoryCard';
import Breadcrumb from '@/components/molecules/breadcrumb';
import { useBenefits } from '@/context/BenefitsContext';
import { getCategory } from '@/utils/JSONObjects';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

interface CategoryTemplateProps {
  readonly category: string;
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

const CategoryTemplate: React.FC<CategoryTemplateProps> = ({ category }) => {
  const { state, getSearchResult, getFeatured, clearSearchResult, clearFeatured } = useBenefits();
  const { searchResult, totalCount, loading } = state;
  
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || undefined;

  const categoryMeta = getCategory(category);
  const categoryTitle = categoryMeta ? categoryMeta.title : 'Beneficios';

  // Initial load
  React.useEffect(() => {
    clearSearchResult();
    clearFeatured();
    getSearchResult({ category, keyword, from: 0, size: 8 });
    getFeatured({ category });
  }, [category, keyword, getSearchResult, getFeatured, clearSearchResult, clearFeatured]);

  // Load more pagination
  const handleLoadMore = () => {
    if (loading) return;
    getSearchResult({ category, keyword, from: searchResult.length, size: 8 }, true);
  };

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-gray-50 relative">
      
      {/* Loading indicator top banner */}
      {loading && searchResult.length === 0 && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#0f092d] text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
            Buscando aliados...
          </div>
        </div>
      )}

      <main className="flex-grow">

        {/* Banner/Carrusel Superior */}
        <section className="w-full">
          <Carousel />
        </section>

        <section className='max-w-7xl mx-auto'>
          <Breadcrumb />
        </section>

        {/* Título y Filtros de la Sección */}
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#03091e]">
            {totalCount > 0 ? `${totalCount} aliados en ${categoryTitle}` : `Aliados en ${categoryTitle}`}
          </h1>
          <div className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded cursor-pointer">
            Ordenar por Relevancia ▼
          </div>
        </section>

        {/* Grilla Principal de Tarjetas */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          {searchResult.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {searchResult.map((item, index) => {
                const imageSrc = getAbsoluteUrl(item.imageBenefit?.medium || item.imageBenefit?.original);
                const logoSrc = getAbsoluteUrl(item.imageLogo?.medium || item.imageLogo?.original);
                const itemKey = item.benefitId || item.id || `benefit-${index}`;
                
                // Construct URL variables safely
                const titleseo = item.titleseo || 'detalle';
                const benefitId = item.benefitId || item.id;
                const detailUrl = `/${category}/${titleseo}/${benefitId}`;

                return (
                  <Link key={itemKey} href={detailUrl} className="col-span-1 block">
                    <CategoryCard
                      imageSrc={imageSrc}
                      logoSrc={logoSrc}
                      brand={item.alliedName || ''}
                      discount={item.discount || ''}
                      category={categoryTitle}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-lg mx-auto">
                <p className="text-gray-500 font-semibold mb-2">No se encontraron aliados disponibles.</p>
                <p className="text-xs text-gray-400">Intenta buscando en otras categorías del Club.</p>
              </div>
            )
          )}

          {/* Botón "Ver Más" */}
          {searchResult.length < totalCount && searchResult.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-white border-2 border-red-600 text-red-600 font-bold py-3 px-8 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Cargar más aliados"}
              </button>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default CategoryTemplate;
