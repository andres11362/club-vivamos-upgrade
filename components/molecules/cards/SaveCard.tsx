import React from 'react';
import { PiggyBank, HeartPulse, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface SaveCardProps {
  rank: number;
  logoUrl: string;
  brandName: string;
  savedAmount: string;
  usageCount: number;
  category: string;
  categoryColor: string; // Ej: "bg-teal-400"
}

const SaveCard = ({ rank, logoUrl, brandName, savedAmount, usageCount, category, categoryColor }: SaveCardProps) =>  {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col overflow-hidden w-[220px] md:w-[240px] flex-shrink-0">
      
      {/* Parte Superior: Ranking y Logo */}
      <div className="relative pt-6 pb-2 px-4 flex flex-col items-center">
        {/* Número de Ranking flotante */}
        <div className="absolute top-2 left-2 bg-blue-50 text-blue-800 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-sm">
          {rank}
        </div>
        
        <div className="w-full h-10 relative mb-3">
          <Image 
            src={logoUrl} 
            alt={brandName} 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 160px, 200px"
          />
        </div>
        
        <h3 className="text-xs font-bold text-[#03091e] uppercase text-center w-full truncate">
          {brandName}
        </h3>
      </div>

      {/* Parte Central: Ahorros y Usos */}
      <div className="px-4 py-3 bg-gray-50/50 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <PiggyBank className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-semibold uppercase leading-tight">Ahorraste</span>
            <span className="text-sm font-bold text-orange-500 leading-tight">{savedAmount}</span>
          </div>
        </div>
        <div className="text-center text-xs font-semibold text-gray-700">
          Lo usaste <span className="font-bold text-[#03091e]">{usageCount}</span>
        </div>
      </div>

      {/* Parte Inferior: Categoría (Banda de color) */}
      <div className={`mt-auto py-2 w-full flex items-center justify-center gap-1.5 text-white text-[11px] font-bold ${categoryColor}`}>
        {/* Aquí podrías renderizar un icono condicional basado en la categoría */}
        <HeartPulse className="w-3.5 h-3.5" />
        {category}
      </div>
      
    </div>
  );
}

export default SaveCard;
