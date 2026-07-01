import Image from "next/image";

interface BenefitListItemProps {
  logoSrc: string;
  brand: string;
  discount: string;
}

/**
 * Item de beneficio en vista LISTA — fiel a `.results-list li` (_results.scss):
 * fila de 100px, logo (98×97 con curva inf-der), barra de acento, nombre +
 * descuento (BarlowCondensed) y botón "ver más" (pill rojo).
 */
const BenefitListItem = ({ logoSrc, brand, discount }: BenefitListItemProps) => {
  return (
    <div className="group flex h-[100px] items-center overflow-hidden rounded-r-[10px] border border-[#d3d3d3] bg-white transition hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.17)]">
      {/* Logo del aliado */}
      <div className="relative h-[97px] w-[100px] shrink-0">
        <Image src={logoSrc} alt={brand} fill className="rounded-br-[30px] object-cover" sizes="100px" />
      </div>
      {/* Barra de acento (segmento) */}
      <span className="ml-3 h-[65px] w-1 shrink-0 bg-accent" aria-hidden />
      {/* Nombre + descuento */}
      <div className="ml-4 flex min-w-0 flex-1 flex-col justify-center">
        <p className="truncate font-barlow text-[18px] font-semibold text-ink">{brand}</p>
        <p className="truncate font-barlow text-[25px] font-medium leading-tight text-ink">{discount}</p>
      </div>
      {/* Ver más */}
      <span className="mr-6 shrink-0 rounded-[17.5px] border border-danger px-4 py-1 font-maven text-[12px] text-danger transition group-hover:bg-danger/5">
        ver más
      </span>
    </div>
  );
};

export default BenefitListItem;
