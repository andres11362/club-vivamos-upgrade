import React from 'react';

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col font-barlow bg-white">
      <main className="flex-grow pb-16">

        {/* =========================================
            1. Cabecera y Título Principal
            ========================================= */}
        <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
          <div className="relative flex justify-center mb-8 md:mb-12">
            {/* Cuadro azul decorativo */}
            <div className="absolute -left-2 md:left-auto md:-ml-[420px] top-0 w-8 h-8 md:w-10 md:h-10 border-[1.5px] border-[#03091e]/20 rounded-tl-lg rounded-br-lg -z-10"></div>
            
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#03091e] uppercase tracking-wide text-center">
              Bienvenido a un mundo de beneficios y experiencias
            </h1>
          </div>

          {/* =========================================
              2. Enlaces Rápidos (Anclas)
              ========================================= */}
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-x-10 md:gap-y-4 mb-8 text-[13px] md:text-sm font-bold text-teal-700">
            <a href="#pertenecer" className="hover:underline">¿Cómo pertenecer al club de suscriptores El Tiempo?</a>
            <a href="#socio" className="hover:underline">¿CÓMO SER SOCIO PREFERENTE?</a>
            <a href="#politicas" className="hover:underline">Políticas de Inscripción de Beneficiarios</a>
            <a href="#redimir" className="hover:underline">¿Cómo redimir tus beneficios?</a>
            <a href="#solicitar" className="hover:underline">¿Cómo solicitar la Tarjeta de Crédito Club Vivamos AV Villas?</a>
            <a href="#configurar" className="hover:underline">¿CÓMO CONFIGURAR TU TARJETA VIRTUAL?</a>
          </div>

          {/* =========================================
              3. Banner Publicitario
              ========================================= */}
          <div className="w-full mb-12">
            <img 
              src="/banner-diviertete-aprende.jpg" 
              alt="Diviértete y Aprende" 
              className="w-full h-auto object-cover rounded shadow-sm"
            />
          </div>
        </section>

        {/* =========================================
            4. Grilla de Contenido (Preguntas)
            ========================================= */}
        <section className="max-w-7xl mx-auto px-6">
          {/* Grid: 1 columna en móvil, 2 en tablet/desktop.
            Usamos grid-auto-flow para que los elementos caigan en la columna que les indiquemos.
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

            {/* BLOQUE 1 (Izquierda) */}
            <div id="pertenecer" className="md:col-start-1">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                ¿CÓMO PERTENECER AL CLUB DE SUSCRIPTORES EL TIEMPO?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-justify md:text-left">
                Debes suscribirte a cualquier producto de EL TIEMPO CASA EDITORIAL, como: Los periódicos El Tiempo y Portafolio, o las revistas Aló, Habitar, Bocas y Carrusel. Suscríbete ya llamando al 426 6000 opción 1 en Bogotá, a la línea nacional 01 8000 110 990 o ingresa a suscripciones.eltiempo.com.
              </p>
            </div>

            {/* IMAGEN DE LA PAREJA (Derecha, ocupa 2 filas) 
                Se oculta en móvil para ahorrar espacio vertical, como se ve en tu captura
            */}
            <div className="hidden md:block md:col-start-2 md:row-start-1 md:row-span-2">
              <img 
                src="/pareja-sonriendo.jpg" 
                alt="Pareja disfrutando beneficios" 
                className="w-full h-full object-cover rounded-xl rounded-tr-[4rem] shadow-md"
              />
            </div>

            {/* BLOQUE 2 (Izquierda) */}
            <div id="socio" className="md:col-start-1">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                ¿CÓMO SER SOCIO PREFERENTE?
              </h2>
              <p className="text-gray-600 text-sm mb-4">Debes cumplir con los siguientes criterios:</p>
              <ul className="list-disc marker:text-blue-500 pl-5 text-gray-600 text-sm space-y-2 mb-4">
                <li>Ser suscriptor activo al periódico EL TIEMPO, los 7 días a la semana.</li>
                <li>Permanencia de 1 año o más con tu suscripción.</li>
                <li>Haber realizado 12 o más utilizaciones en alguna de nuestras marcas aliadas en el último año.</li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed">
                La clasificación del segmento se realiza de forma anual para cada suscriptor...
              </p>
            </div>

            {/* BLOQUE 3 (Derecha, debajo de la imagen) */}
            <div id="politicas" className="md:col-start-2">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                POLÍTICAS DE INSCRIPCIÓN DE BENEFICIARIOS
              </h2>
              <p className="font-bold text-gray-800 text-sm mb-2">Personas Naturales:</p>
              <ul className="list-disc marker:text-blue-500 pl-5 text-gray-600 text-sm space-y-1 mb-4">
                <li>Segmento Clásico: hasta 2 beneficiarios</li>
                <li>Segmento Preferente: hasta 4 beneficiarios</li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Para inscribir a tus beneficiarios comunícate a la línea 426 60 00 Opc. 1-4... y envía la siguiente información: nombre, cédula, teléfono, email...
              </p>
            </div>

            {/* BLOQUE 4 (Izquierda) */}
            <div id="redimir" className="md:col-start-1">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                ¿CÓMO REDIMIR TUS BENEFICIOS?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Accede a los beneficios que tenemos para ti en las categorías... para acceder al beneficio debes presentar tu cédula de ciudadanía y/o extranjería.
              </p>
              <p className="text-gray-600 text-sm font-semibold">
                Para más información escríbenos a <a href="mailto:clubvivamos@eltiempo.com" className="text-teal-600 underline">clubvivamos@eltiempo.com</a>
              </p>
            </div>

            {/* BLOQUE 5 (Izquierda) */}
            <div id="solicitar" className="md:col-start-1">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                ¿CÓMO SOLICITAR LA TARJETA DE CRÉDITO CLUB VIVAMOS AV VILLAS?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                El Banco AV Villas es la entidad que realiza la gestión de aprobación... Bogotá: 4441777 - Barranquilla: 3304330...
              </p>
            </div>

            {/* BLOQUE 6 (Derecha) */}
            <div id="configurar" className="md:col-start-2">
              <h2 className="border-l-[3px] border-[#03091e] pl-3 text-base md:text-lg font-bold text-[#03091e] uppercase mb-4 tracking-wide">
                ¿CÓMO CONFIGURAR TU TARJETA VIRTUAL?
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Los Socios deberán descargar la aplicación Club Vivamos en las tiendas Apple Store o Play Store... Una vez actualizados estos datos se mostrará en esa misma sesión la tarjeta virtual.
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
