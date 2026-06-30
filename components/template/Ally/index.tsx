"use client";
import { useState } from 'react';
import { ShoppingBag, HeartPulse, Utensils, Home, Plane, Film, HelpCircle } from 'lucide-react';
import AllyCard from '@/components/molecules/cards/AllyCard';
import { CATEGORIES } from '@/utils/JSONObjects';
import { Ally } from '@/services/directoryService';

interface AllyTemplateProps {
  readonly initialAllies?: Ally[];
}

const getCategoryIcon = (categoryId: number) => {
  switch (categoryId) {
    case 1: return Home;           // Hogar y Servicios
    case 2: return Film;           // Entretenimiento
    case 3: return Utensils;       // Gastronomía
    case 4: return HeartPulse;     // Salud y Bienestar
    case 5: return Plane;          // Turismo
    case 6: return ShoppingBag;    // Ropa y Accesorios
    default: return HelpCircle;
  }
};

const AllyTemplate = ({ initialAllies = [] }: AllyTemplateProps) => {
    const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);

    // Manejador local de filtros
    const aliadosFiltrados = categoriaActiva
        ? initialAllies.filter((aliado) => aliado.categoryId === categoriaActiva)
        : initialAllies;

    return (
        <div className="min-h-screen flex flex-col font-barlow bg-white">
            <main className="flex-grow pb-16">

                {/* =========================================
            Cabecera y Título
            ========================================= */}
                <section className="max-w-7xl mx-auto px-4 pt-10 pb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold uppercase text-[#03091e] tracking-wide">
                        Nuestro <span className="text-red-600">Directorio de Aliados</span>
                    </h1>
                    <p className="mt-4 text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-medium">
                        Conoce todos nuestros aliados y disfruta de los mejores descuentos a nivel nacional.
                    </p>
                </section>

                {/* =========================================
            Filtros (Categorías en Píldoras)
            ========================================= */}
                <section className="max-w-7xl mx-auto px-4 mb-10">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {/* Botón de limpiar filtros */}
                        <button
                            onClick={() => setCategoriaActiva(null)}
                            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors border ${categoriaActiva === null
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-600 hover:text-red-600'
                                }`}
                        >
                            Todos
                        </button>

                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaActiva(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors border ${categoriaActiva === cat.id
                                        ? 'bg-red-600 text-white border-red-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-600 hover:text-red-600'
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </section>

                {/* =========================================
            Grilla de Aliados
            ========================================= */}
                <section className="max-w-7xl mx-auto px-4">
                    {aliadosFiltrados.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-4">
                            {aliadosFiltrados.map((aliado) => (
                                <div key={aliado.id} className="col-span-1">
                                    <AllyCard
                                        name={aliado.name}
                                        discount={aliado.discount}
                                        logoSrc={aliado.logo}
                                        CategoryIcon={getCategoryIcon(aliado.categoryId)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            No se encontraron aliados para esta categoría.
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}

export default AllyTemplate;
