// components/molecules/Breadcrumb.tsx
'use client';

import { usePathname } from 'next/navigation';
import AppLink from '@/components/atoms/link';

const Breadcrumb = () => {
    const paths = usePathname();

    // Dividimos la ruta y eliminamos los segmentos vacíos
    const pathNames = paths.split('/').filter((path) => path);

    return (
        <nav aria-label="breadcrumb" className="flex py-2 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
                {/* Enlace raíz siempre visible */}
                <li>
                    <AppLink href="/">Inicio</AppLink>
                </li>

                {pathNames.length > 0 && <span className="text-gray-400">/</span>}

                {/* Mapeo de los segmentos de la ruta */}
                {pathNames.map((link, index) => {
                    // Construimos el href acumulativo para cada nivel
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathNames.length - 1;

                    // Formateo básico: Primera letra en mayúscula (puedes ajustarlo)
                    const itemLabel = link.charAt(0).toUpperCase() + link.slice(1).replace(/-/g, ' ');

                    return (
                        <li key={index} className="flex items-center">
                            {!isLast ? (
                                <>
                                    <AppLink href={href}>
                                        {itemLabel}
                                    </AppLink>
                                    <span className="mx-2 text-gray-400">/</span>
                                </>
                            ) : (
                                // El último elemento no es un enlace, indica la página actual
                                <span className="font-semibold text-gray-900" aria-current="page">
                                    {itemLabel}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
