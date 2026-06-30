import React from 'react';
import { notFound } from 'next/navigation';
import BeneficioDetailTemplate from '@/components/template/benefit';
import { getDetail, getHeadquartersByBenefit } from '@/services/benefitsService';

const VALID_CATEGORIES = [
  'gastronomia',
  'turismo',
  'ropa-y-accesorios',
  'salud-y-bienestar',
  'entretenimiento',
  'hogar-y-servicios'
];

interface PageProps {
  params: Promise<{
    category: string;
    benefit_name: string;
    benefit_id: string;
  }>;
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { category, benefit_name, benefit_id } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  // Fetch benefit details and headquarters in parallel on the server (SSR)
  const [detailResult, headquartersResult] = await Promise.all([
    getDetail({ benefit_id }),
    getHeadquartersByBenefit({ benefit_id })
  ]);

  // If the benefit is not found, return a 404 page
  if (detailResult.statusCode !== 200 || !detailResult.data) {
    notFound();
  }

  return (
    <BeneficioDetailTemplate 
      benefit={detailResult.data} 
      headquarters={headquartersResult.data} 
    />
  );
}
