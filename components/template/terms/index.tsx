import AccordeonItem from '@/components/molecules/items/AccordeonItem';

const TermsTemplate = () => {
  return (
    <div className="min-h-screen flex flex-col font-barlow bg-white">
      <main className="flex-grow pb-20">
        
        {/* =========================================
            Cabecera Principal
            ========================================= */}
        <section className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 mb-10 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#03091e] uppercase tracking-wide">
            TÉRMINOS Y CONDICIONES CLUB EL TIEMPO VIVAMOS
          </h1>
        </section>

        {/* =========================================
            SECCIÓN 1: Términos Generales
            ========================================= */}
        <section className="max-w-4xl mx-auto px-6 mb-16">
          
          <AccordeonItem title="1. Definiciones" defaultOpen={true}>
            <p>
              Para una mejor comprensión de los presentes Términos y Condiciones...
            </p>
            
            {/* Los botones de descarga de PDF que se ven en la imagen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <a href="#" className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition">
                <img src="/pdf-icon.png" alt="PDF" className="w-8 h-8 mb-2" />
                <span className="text-xs font-semibold text-center text-gray-700">Anexo A</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition">
                <img src="/pdf-icon.png" alt="PDF" className="w-8 h-8 mb-2" />
                <span className="text-xs font-semibold text-center text-gray-700">Anexo B</span>
              </a>
              {/* Añade más según necesites */}
            </div>
          </AccordeonItem>

          <AccordeonItem title="2. Alcance y Naturaleza">
             <p>El Programa tiene por objeto premiar la lealtad de los suscriptores...</p>
             <p>El Club Vivamos El Tiempo no es un programa de acumulación de puntos...</p>
          </AccordeonItem>

          <AccordeonItem title="3. Responsabilidad de El Tiempo Casa Editorial">
             <p>EL TIEMPO actúa únicamente como un intermediario o canalizador...</p>
          </AccordeonItem>

          <AccordeonItem title="4. Suscripción y membresía">
             <p>Podrán ser socios del Club Vivamos todas las personas naturales o jurídicas...</p>
          </AccordeonItem>

          {/* ... Agrega el resto de los items de la primera sección aquí ... */}

        </section>

        {/* =========================================
            SECCIÓN 2: Garantía de 60 días
            ========================================= */}
        <section className="max-w-4xl mx-auto px-6">
          
          <div className="mb-8 mt-12">
             <h2 className="text-lg md:text-xl font-bold text-[#03091e]">
               Términos y condiciones Garantía de 60 días del Club EL TIEMPO Vivamos y el Tiempo Digital
             </h2>
          </div>

          <AccordeonItem title="1. Definiciones">
            <p>Para esta garantía específica, aplican las siguientes definiciones exclusivas...</p>
          </AccordeonItem>

          <AccordeonItem title="2. Condiciones Generales">
            <p>La garantía de satisfacción de 60 días aplica únicamente para...</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
               <li>Nuevos suscriptores.</li>
               <li>Suscripciones adquiridas mediante canales digitales.</li>
               <li>Cuentas al día en sus pagos.</li>
            </ul>
          </AccordeonItem>

          <AccordeonItem title="3. Reclamaciones">
            <p>El suscriptor deberá presentar su reclamación formal dentro de los 60 días calendario...</p>
          </AccordeonItem>

        </section>

      </main>
    </div>
  );
}

export default TermsTemplate;
