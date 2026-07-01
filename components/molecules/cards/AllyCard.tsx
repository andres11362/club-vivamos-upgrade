// components/AliadoCard.tsx
import Image from 'next/image';

interface AllyCardProps {
  logoSrc: string;
  name: string;
  discount: string;
  // Opcional: Si quieres pasarle un icono de lucide-react según la categoría
  CategoryIcon?: React.ElementType;
  // Color del icono de categoría (token de marca, ej. "text-cat-purple")
  categoryColorClass?: string;
}

const AllyCard = ({ logoSrc, name, discount, CategoryIcon, categoryColorClass = 'text-gray-300' }: AllyCardProps) => {
  return (
    <div className="flex items-center gap-3 bg-white p-2.5 md:p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow relative w-full">

      {/* Icono de Categoría (Esquina superior derecha) */}
      {CategoryIcon && (
        <div className={`absolute top-2.5 right-2.5 ${categoryColorClass}`}>
          <CategoryIcon className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Contenedor del Logo */}
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-white relative">
        <Image
          src={logoSrc}
          alt={`Logo de ${name}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 40px, 48px"
        />
      </div>

      {/* Información del Aliado */}
      <div className="flex flex-col justify-center pr-5 min-w-0">
        <h3 className="font-bold text-[13px] md:text-sm text-gray-900 leading-tight uppercase truncate">
          {name}
        </h3>
        <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 uppercase font-medium tracking-wide leading-snug">
          {discount}
        </p>
      </div>
    </div>
  );
}

export default AllyCard;