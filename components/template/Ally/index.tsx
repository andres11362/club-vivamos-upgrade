"use client";
import { useState } from 'react';
import { ShoppingBag, HeartPulse, Utensils, Home, Plane, Film, HelpCircle } from 'lucide-react';
import AllyCard from '@/components/molecules/cards/AllyCard';
import Breadcrumb from '@/components/molecules/breadcrumb';
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

// Color de marca por categoría (mismo criterio que el subrayado del nav en Header)
const CATEGORY_COLOR: Record<number, string> = {
  1: 'text-cat-purple',   // Hogar y Servicios
  2: 'text-cat-blue',     // Entretenimiento
  3: 'text-cat-red',      // Gastronomía
  4: 'text-cat-aqua',     // Salud y Bienestar
  5: 'text-cat-yellow',   // Turismo
  6: 'text-cat-green',    // Ropa y Accesorios
};

const CATEGORY_PILL: Record<number, { active: string; inactive: string }> = {
  1: { active: 'bg-cat-purple text-white border-cat-purple', inactive: 'bg-white text-cat-purple border-cat-purple/40 hover:bg-cat-purple/10' },
  2: { active: 'bg-cat-blue text-white border-cat-blue', inactive: 'bg-white text-cat-blue border-cat-blue/40 hover:bg-cat-blue/10' },
  3: { active: 'bg-cat-red text-white border-cat-red', inactive: 'bg-white text-cat-red border-cat-red/40 hover:bg-cat-red/10' },
  4: { active: 'bg-cat-aqua text-white border-cat-aqua', inactive: 'bg-white text-cat-aqua border-cat-aqua/40 hover:bg-cat-aqua/10' },
  5: { active: 'bg-cat-yellow text-ink border-cat-yellow', inactive: 'bg-white text-ink border-cat-yellow/40 hover:bg-cat-yellow/10' },
  6: { active: 'bg-cat-green text-white border-cat-green', inactive: 'bg-white text-cat-green border-cat-green/40 hover:bg-cat-green/10' },
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

                {/* Breadcrumb — arriba, misma regla de espaciado que el resto del sitio
                    (pt extra en desktop para no quedar bajo el logo circular absoluto del Header) */}
                <section className="max-w-[1140px] mx-auto px-4 md:px-6 pt-6 mobile:pt-14">
                    <Breadcrumb />
                </section>

                {/* =========================================
            Cabecera y Título
            ========================================= */}
                <section className="max-w-[1140px] mx-auto px-4 md:px-6 pt-6 pb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold uppercase text-[#03091e] tracking-wide">
                        Nuestro <span className="text-red-600">Directorio de Aliados</span>
                    </h1>
                    <p className="mt-4 text-sm md:text-base text-gray-500 max-w-2xl mx-auto font-medium">
                        Conoce todos nuestros aliados y disfruta de los mejores descuentos a nivel nacional.
                    </p>
                </section>

                {/* =========================================
            Filtros (Categorías en Píldoras, color por categoría)
            ========================================= */}
                <section className="max-w-[1140px] mx-auto px-4 md:px-6 mb-8">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {/* Botón de limpiar filtros */}
                        <button
                            onClick={() => setCategoriaActiva(null)}
                            className={`px-4 py-1.5 rounded-full text-xs md:text-[13px] font-semibold transition-colors border ${categoriaActiva === null
                                    ? 'bg-danger text-white border-danger'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-danger hover:text-danger'
                                }`}
                        >
                            Todos
                        </button>

                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaActiva(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-xs md:text-[13px] font-semibold transition-colors border ${categoriaActiva === cat.id
                                        ? CATEGORY_PILL[cat.id]?.active
                                        : CATEGORY_PILL[cat.id]?.inactive
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
                <section className="max-w-[1140px] mx-auto px-4 md:px-6">
                    {aliadosFiltrados.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-x-5 md:gap-y-3">
                            {aliadosFiltrados.map((aliado) => (
                                <div key={aliado.id} className="col-span-1">
                                    <AllyCard
                                        name={aliado.name}
                                        discount={aliado.discount}
                                        logoSrc={aliado.logo}
                                        CategoryIcon={getCategoryIcon(aliado.categoryId)}
                                        categoryColorClass={CATEGORY_COLOR[aliado.categoryId]}
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
