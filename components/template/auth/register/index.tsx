'use client';

import RegisterForm from "@/components/molecules/forms/auth/register";

const RegistroTemplate = () => {
 

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-gray-50/50">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden min-h-[650px]">
          
          {/* LADO IZQUIERDO: Imagen (Oculto en móvil) */}
          <div className="hidden md:flex w-full md:w-1/2 bg-[#2c2b5e] p-12 relative flex-col justify-end">
            <div className="relative z-10 border-l-4 border-white pl-4 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white uppercase leading-tight drop-shadow-md">
                Abre la puerta <br />
                <span className="text-blue-300">A un mundo de beneficios</span> <br />
                Y experiencias inolvidables
              </h2>
            </div>
          </div>

          {/* LADO DERECHO: Formulario de Registro */}
          <RegisterForm />
          

        </div>
      </main>
    </div>
  );
}

export default RegistroTemplate;
