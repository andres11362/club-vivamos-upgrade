import React from 'react';
import { Button } from '@/components/atoms/button';
import { CheckCircle2, Download } from 'lucide-react'; // Iconos
import FormCarousel from '@/components/molecules/carousel/FormCarousel';
import WantMyClubForm from '@/components/molecules/forms/wantMyClub';

const IMAGE_ARRAY = [
  '/images/kwow-club/Carrusel-1.jpg',
  '/images/kwow-club/Carrusel-2.jpg',
  '/images/kwow-club/Carrusel-3.jpg',
  '/images/kwow-club/Carrusel-4.jpg'
] as const;

const IMAGE_ARRAY_MOBILE = [
  '/images/kwow-club/Carrusel-1-mobile.jpg',
  '/images/kwow-club/Carrusel-2-mobile.jpg',
  '/images/kwow-club/Carrusel-3-mobile.jpg',
  '/images/kwow-club/Carrusel-4-mobile.jpg'
] as const;

export default function WantMyClubTemplate() {
  return (
    // Fondo azul oscuro sólido solicitado
    <div className="min-h-screen font-barlow bg-[#060d20]">
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Grid Principal: 1 columna en móvil, 2 en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* =========================================
              COLUMNA IZQUIERDA: Textos y Beneficios
              ========================================= */}
          <div className="flex flex-col gap-8 text-white animate-fade-in">
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              ¿Buscas beneficios para tus empleados de alto impacto y bajo costo?
            </h1>
            
            <p className="text-base md:text-lg text-gray-200">
              Active <strong className="text-white">30 días sin costo</strong> y descubra cómo mejorar el bienestar, la motivación y la fidelización de su equipo.
            </p>

            {/* Carrusel adaptado del proyecto viejo con rutas actualizadas */}
            <div className="w-full">
              <FormCarousel imageArray={IMAGE_ARRAY} imageArrayMobile={IMAGE_ARRAY_MOBILE} />
            </div>

            {/* Lista de Beneficios */}
            <div className="flex flex-col gap-5">
              <BenefitItem 
                title="Descuentos en más de 120 marcas aliadas" 
                desc="Gastronomía, entretenimiento, salud, educación y más" 
              />
              <BenefitItem 
                title="Ahorros en promedio de hasta $800.000 al año" 
                desc="Beneficios reales que impactan el bolsillo de sus colaboradores" 
              />
              <BenefitItem 
                title="Beneficios para colaboradores y sus familias" 
                desc="Posibilidad de incluir 2 beneficiarios y extender las ventajas." 
              />
              <BenefitItem 
                title="Suscripción digital incluida" 
                desc={<span>Acceso ilimitado a contenido exclusivo en <span className="underline">El Tiempo</span></span>} 
              />
            </div>

            {/* Uso del átomo Button con variante 'outline' */}
            <div className="mt-4 md:w-max">
              <Button variant="outline" size="lg" fullWidth className="md:w-auto gap-2">
                <Download className="w-5 h-5" />
                DESCARGAR BROCHURE CORPORATIVO
              </Button>
            </div>
            
          </div>

          {/* =========================================
              COLUMNA DERECHA: Tarjeta del Formulario
              ========================================= */}
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl">
            
            <div className="text-center mb-8">
              <h2 className="text-lg md:text-xl font-bold text-teal-800 uppercase tracking-wide">
                SOLICITE UNA ASESORÍA
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Déjenos sus datos y un asesor corporativo se comunicará con usted para presentarle el programa de beneficios para empresas.
              </p>
            </div>

            <WantMyClubForm />
          </div>

        </div>
      </main>
    </div>
  );
}

// Sub-componente simple para la lista de la izquierda
function BenefitItem({ title, desc }: { title: string, desc: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex-shrink-0 bg-white/10 rounded-full p-0.5">
        {/* Usando CheckCircle2 de lucide-react para simular el chulito */}
        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
      </div>
      <div>
        <h4 className="font-bold text-white text-[15px]">{title}</h4>
        <p className="text-sm text-gray-300 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}