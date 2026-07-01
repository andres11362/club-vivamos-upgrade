import Image from "next/image";

interface CategoryCardProps {
  imageSrc: string;
  logoSrc: string;
  brand: string;
  discount: string;
  category: string;
}

/**
 * Tarjeta de beneficio (grid de categoría) — fiel a `.results-grid li` (_results.scss):
 * imagen con curva inferior-derecha 60px, descuento en BarlowCondensed, link "Ver beneficio".
 */
const CategoryCard = ({ imageSrc, logoSrc, brand, discount }: CategoryCardProps) => {
  return (
    <div className="group flex h-full flex-col rounded-b-[10px] border border-gray-line bg-white transition hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.17)]">
      {/* Imagen del beneficio con curva inferior-derecha (distintiva de producción) */}
      <div className="relative w-full">
        <div className="relative h-48 w-full overflow-hidden rounded-br-[60px] md:h-56">
          <Image
            src={imageSrc}
            alt={brand}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        {/* Logo del aliado superpuesto */}
        <div className="absolute -bottom-6 right-5 z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-line bg-white p-1 shadow-md md:h-14 md:w-14">
          <div className="relative h-full w-full">
            <Image src={logoSrc} alt={`${brand} logo`} fill className="object-contain" sizes="56px" />
          </div>
        </div>
      </div>

      {/* Textos */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
        {/* Descuento — BarlowCondensed-Medium */}
        <p className="font-barlow text-[22px] font-medium uppercase leading-tight text-ink">{discount}</p>
        {/* Nombre del aliado */}
        <p className="mt-1 line-clamp-2 font-maven text-[14px] leading-snug text-gray-2">{brand}</p>
        {/* Acción */}
        <div className="mt-auto pt-4">
          <span className="font-maven text-[12px] font-medium text-primary underline transition group-hover:text-primary-hover">
            Ver beneficio
          </span>
          <p className="mt-1 font-barlow text-[12px] text-ink">Todos los socios</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
