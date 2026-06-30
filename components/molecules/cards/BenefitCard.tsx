interface BenefitCardProps {
    title: string;
    discount: string;
    terms: string;
    bgColor?: string; // Para tarjetas con fondo de color en lugar de imagen
}

const BenefitCard = ({ title, discount, terms, bgColor = 'bg-gray-200' }: BenefitCardProps) => {
    return (
        <div className="flex flex-col bg-white shadow-md overflow-hidden h-full">
            {/* Área de la Imagen / Fondo */}
            <div className={`h-48 w-full ${bgColor} relative flex items-center justify-center`}>
                {/* Aquí iría el componente <Image /> de Next.js real */}
                <span className="text-gray-500 italic">Espacio para Imagen</span>
            </div>

            {/* Área de Contenido */}
            <div className="p-4 flex flex-col grow">
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="font-semibold text-gray-800 text-sm mb-2">{discount}</p>
                <p className="text-xs text-gray-500 mt-auto">{terms}</p>
            </div>
        </div>
    );
}

export default BenefitCard;
