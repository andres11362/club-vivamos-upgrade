'use client';
import EditDataForm from '@/components/molecules/forms/auth/editData';

export default function MyDataTemplate() {

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-gray-50/50">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
          
          {/* LADO IZQUIERDO: Imagen (Oculto en móvil) */}
          <div className="hidden md:block w-full md:w-1/2 relative p-4 lg:p-6">
            <div className="w-full h-full relative overflow-hidden rounded-2xl rounded-br-[5rem] md:rounded-br-[6rem] shadow-sm">
              <img 
                src="/configurar-datos-bg.jpg" 
                alt="Usuario configurando datos" 
                className="absolute inset-0 w-full h-full object-cover object-center" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-[#2c2b5e]/10" />
            </div>
          </div>

          {/* LADO DERECHO: Formulario de Datos */}
          <EditDataForm />

        </div>
      </main>
    </div>
  );
}