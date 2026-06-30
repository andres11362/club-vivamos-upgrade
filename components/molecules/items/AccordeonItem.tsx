// components/AccordionItem.tsx
"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
const AccordeonItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 w-full">
            {/* Botón Cabecera */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
            >
                <h3 className="font-bold text-[15px] md:text-base text-[#03091e] pr-4 group-hover:text-blue-700 transition-colors">
                    {title}
                </h3>
                <ChevronDown
                    className={`w-5 h-5 text-blue-700 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Contenido Animado (Usando el truco de Grid) */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className="overflow-hidden">
                    {/* Un padding bottom extra para que el texto no quede pegado a la línea al abrirse */}
                    <div className="pb-6 text-sm text-gray-600 leading-relaxed text-justify md:text-left space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccordeonItem;
