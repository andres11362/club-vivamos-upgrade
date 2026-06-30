import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-barlow bg-white">
      <main className="flex-grow pb-16">

        {/* =========================================
            1. Banner Estático Superior
            ========================================= */}
        <section className="relative w-full h-[250px] md:h-[350px] lg:h-[400px]">
          {/* Aquí idealmente pones la imagen del collage */}
          <img
            src="/quienes-somos-banner.jpg"
            alt="Personas disfrutando beneficios"
            className="w-full h-full object-cover object-center"
          />

          {/* Curva Blanca Inferior */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[50px] lg:h-[70px]">
              <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" fill="#ffffff"></path>
            </svg>
          </div>
        </section>

        {/* =========================================
            2. Contenido Principal
            ========================================= */}
        <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">

          {/* Título con adorno azul */}
          <div className="relative flex justify-center mb-12 md:mb-20">
            {/* Cuadro azul decorativo */}
            <div className="absolute -left-2 md:left-auto md:-ml-80 top-0 w-8 h-8 md:w-10 md:h-10 border-[1.5px] border-blue-800/20 rounded-tl-lg rounded-br-lg -z-10"></div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#03091e] uppercase tracking-wide text-center max-w-lg">
              ¿Qué es el club de suscriptores?
            </h1>
          </div>

          {/* Grilla Responsiva (Texto e Imagen) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* BLOQUE DE TEXTO 
                En móvil va abajo (order-2), en desktop va a la izquierda (md:order-1) 
            */}
            <div className="order-2 md:order-1 flex flex-col gap-6 text-gray-600 text-sm md:text-base leading-relaxed text-justify md:text-left">
              <p>
                Somos el programa de fidelización y lealtad de EL TIEMPO CASA EDITORIAL. Contamos con más de 35 años de experiencia y estamos conformados por un selecto grupo de suscriptores de los periódicos EL TIEMPO, Portafolio, las revistas Aló, Bocas, Credencial y suscriptores de eltiempo.com.
              </p>
              <p>
                En el Club Vivamos EL TIEMPO damos día a día a nuestros socios experiencias memorables para compartir con quienes más quieren y descuentos especiales en más de 120 marcas aliadas. Para disfrutar todo lo que tiene el Club, solo debes solicitar tu beneficio en nuestras marcas aliadas y presentar tu cédula.
              </p>
            </div>

            {/* BLOQUE DEL GRÁFICO 
                En móvil va arriba (order-1), en desktop va a la derecha (md:order-2) 
            */}
            <div className="order-1 md:order-2 flex justify-center items-center">
              {/* NOTA: Para este gráfico circular con los 4 iconos flotantes, 
                 la mejor práctica en frontend es exportarlo como un solo archivo SVG o PNG 
                 transparente desde Figma/Illustrator para evitar problemas de alineación responsiva.
              */}
              <img
                src="/infografico-club.png"
                alt="Infográfico de beneficios del club"
                className="w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] object-contain"
              />
            </div>

          </div>
        </section>

        {/* =========================================
            3. Sección de Descarga (Apps)
            ========================================= */}
        <section className="max-w-4xl mx-auto px-6 mt-20 mb-10 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-6">
            Descarga nuestra app
          </p>
          <div className="flex justify-center items-center gap-4">
            {/* Botón Google Play */}
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/google-play-badge.png" alt="Disponible en Google Play" className="h-10 md:h-12" />
            </a>
            {/* Botón App Store */}
            <a href="#" className="hover:opacity-80 transition-opacity">
              <img src="/app-store-badge.png" alt="Descárgalo en el App Store" className="h-10 md:h-12" />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
