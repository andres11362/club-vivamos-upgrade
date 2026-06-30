// components/AliadoCard.tsx
import Image from 'next/image';

interface AllyCardProps {
  logoSrc: string;
  name: string;
  discount: string;
  // Opcional: Si quieres pasarle un icono de lucide-react según la categoría
  CategoryIcon?: React.ElementType; 
}

const AllyCard = ({ logoSrc, name, discount, CategoryIcon }: AllyCardProps) => {
  return (
    <div className="flex items-center bg-white p-3 md:p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow relative w-full">
      
      {/* Icono de Categoría (Esquina superior derecha) */}
      {CategoryIcon && (
        <div className="absolute top-3 right-3 text-cyan-400/50">
          <CategoryIcon className="w-4 h-4" />
        </div>
      )}

      {/* Contenedor del Logo */}
      <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center p-1 bg-white relative">
        <Image 
          src={logoSrc} 
          alt={`Logo de ${name}`} 
          fill
          className="object-contain" 
          sizes="(max-width: 768px) 48px, 64px"
        />
      </div>

      {/* Información del Aliado */}
      <div className="ml-4 flex flex-col justify-center pr-6">
        <h3 className="font-bold text-sm md:text-[15px] text-gray-900 leading-tight uppercase">
          {name}
        </h3>
        <p className="text-[11px] md:text-xs text-gray-500 mt-1 uppercase font-medium tracking-wide">
          {discount}
        </p>
      </div>
    </div>
  );
}

export default AllyCard;