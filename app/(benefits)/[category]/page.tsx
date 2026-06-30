import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CategoryTemplate from '@/components/template/category';
import { BenefitsProvider } from '@/context/BenefitsContext';

const VALID_CATEGORIES = [
  'gastronomia',
  'turismo',
  'ropa-y-accesorios',
  'salud-y-bienestar',
  'entretenimiento',
  'hogar-y-servicios',
  'buscar'
];

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  return (
    <BenefitsProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-[#0f092d] text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
            Cargando...
          </div>
        </div>
      }>
        <CategoryTemplate category={category} />
      </Suspense>
    </BenefitsProvider>
  );
}
