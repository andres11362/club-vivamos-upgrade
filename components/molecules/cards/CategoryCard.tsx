// components/CategoryCard.tsx
import Image from 'next/image';

interface CategoryCardProps {
    imageSrc: string;
    logoSrc: string;
    brand: string;
    discount: string;
    category: string;
}

const CategoryCard = ({ imageSrc, logoSrc, brand, discount, category }: CategoryCardProps) => {
    return (
        <div className="flex flex-col bg-white overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full rounded-b-xl rounded-tr-xl">

            {/* Contenedor Superior (Imagen Principal) */}
            <div className="relative w-full h-48 md:h-56">

                {/* Imagen de fondo con el recorte curvo inferior derecho */}
                <div
                    className="w-full h-full overflow-hidden relative"
                    style={{ borderBottomRightRadius: '4rem' }} // La curva distintiva
                >
                    <Image
                        src={imageSrc}
                        alt={brand}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Logo Circular Superpuesto */}
                <div className="absolute -bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full p-1 shadow-md border border-gray-100 flex items-center justify-center overflow-hidden z-10">
                    <div className="relative w-full h-full">
                        <Image 
                            src={logoSrc} 
                            alt={`${brand} logo`} 
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 48px, 56px"
                        />
                    </div>
                </div>
            </div>

            {/* Contenedor Inferior (Textos) */}
            <div className="p-4 md:p-5 flex flex-col flex-grow pt-8"> {/* pt-8 para dar espacio al logo que sobresale */}

                <span className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">{category}</span>

                <h3 className="font-bold text-gray-900 text-lg md:text-xl leading-tight mb-1">
                    {discount}
                </h3>

                <p className="text-sm text-gray-500">{brand}</p>

                <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-semibold text-gray-400">
                    {/* Un separador decorativo */}
                    <div className="w-6 h-1 bg-cyan-400 rounded-full"></div>
                    Válido en la app
                </div>
            </div>

        </div>
    );
}

export default CategoryCard;
