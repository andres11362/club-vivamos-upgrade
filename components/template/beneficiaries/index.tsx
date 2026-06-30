"use client";
import React, { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input, Select } from '@/components/atoms/input';

const InviteBeneficiariesTemplate = () => {
  // Estado para manejar la cantidad de formularios. 
  // Iniciamos con 1 invitado por defecto.
  const [invitados, setInvitados] = useState([{ id: 1 }]);

  // Función para agregar un nuevo bloque de formulario
  const agregarInvitado = () => {
    setInvitados([...invitados, { id: invitados.length + 1 }]);
  };

  // Función para remover el último bloque (opcional, para el botón Cancelar)
  const removerUltimoInvitado = () => {
    if (invitados.length > 1) {
      setInvitados(invitados.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-barlow bg-white">
      
      {/* =========================================
          BANNER SUPERIOR (Visible en todos los tamaños)
          ========================================= */}
      <section className="relative w-full bg-[#0f092d] text-white pt-12 pb-20 md:pb-24 px-4 text-center">
        <h1 className="text-xl md:text-3xl font-bold uppercase tracking-wide mb-4">
          ¡CON EL CLUB VIVAMOS EL TIEMPO AHORRAN TODOS!
        </h1>
        <p className="text-sm md:text-base font-medium max-w-2xl mx-auto">
          <span className="font-bold">Invita a familiares o amigos</span> para que sean tus beneficiarios y comiencen a ahorrar en grande.
        </p>

        {/* Curva blanca inferior */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[50px] lg:h-[70px]">
            <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-16 w-full">
        
        {/* Grid Principal: 1 col en móvil, 2 cols en Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* =========================================
              COLUMNA IZQUIERDA: Imagen (Solo Desktop)
              ========================================= */}
          <div className="hidden lg:flex lg:col-span-5 w-full justify-center sticky top-8">
            <img 
              src="/familia-comprando.jpg" 
              alt="Familia feliz comprando" 
              className="w-full max-w-md object-contain"
            />
          </div>

          {/* =========================================
              COLUMNA DERECHA: Formularios Dinámicos
              ========================================= */}
          <div className="col-span-1 lg:col-span-7 flex flex-col w-full">
            
            <form className="w-full flex flex-col">
              
              {/* Renderizado dinámico (N-veces) */}
              {invitados.map((invitado, index) => {
                const isLastItem = index === invitados.length - 1;

                return (
                  <div key={invitado.id} className="flex flex-col w-full mb-6">
                    
                    <h3 className="text-[#03091e] font-bold text-lg mb-4">
                      Invitado {index + 1}
                    </h3>
                    
                    {/* Campos del formulario */}
                    <div className="flex flex-col gap-4 md:gap-5">
                      
                      {/* Fila 1: Nombres y Apellidos (1 col móvil, 2 cols desktop) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <Input label="Nombres*" placeholder="Escribe el nombre de tu invitado" />
                        <Input label="Apellidos*" placeholder="Escribe el apellido de tu invitado" />
                      </div>

                      {/* Fila 2: Tipo de Doc y Documento */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <Select 
                          label="Tipo de documento*" 
                          options={[
                            { value: 'cc', label: 'Cédula de Ciudadanía' },
                            { value: 'ce', label: 'Cédula de Extranjería' },
                            { value: 'ti', label: 'Tarjeta de Identidad' }
                          ]} 
                        />
                        <Input label="Documento*" placeholder="Ingresa el número de documento de tu invitado" type="number" />
                      </div>

                      {/* Fila 3: Correo (Ancho completo) */}
                      <Input label="Correo electrónico*" placeholder="Ingresa el correo electrónico de tu invitado" type="email" />
                    </div>

                    {/* Botones de Acción (Añadir/Cancelar) - SE MUESTRAN SOLO EN EL ÚLTIMO ITEM */}
                    {isLastItem && (
                      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                        {/* Botón Cancelar (Aparece si hay más de 1 invitado) */}
                        {invitados.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" // Asumiendo que configuraste una variante fantasma, o usamos clases directas
                            onClick={removerUltimoInvitado}
                            className="border border-red-500 text-red-500 hover:bg-red-50 rounded-full font-bold px-6 py-2"
                          >
                            CANCELAR
                          </Button>
                        )}
                        
                        {/* Botón Añadir */}
                        <Button 
                          type="button" 
                          variant="primary" 
                          onClick={agregarInvitado}
                          className="rounded-full px-8 py-2"
                        >
                          AÑADIR OTRO INVITADO
                        </Button>
                      </div>
                    )}

                    {/* Línea divisoria punteada */}
                    <hr className="border-t border-dashed border-gray-300 my-8" />
                  </div>
                );
              })}

              {/* Textos Legales Finales */}
              <div className="flex flex-col gap-4 text-xs text-gray-500 text-justify mb-8">
                <p>*Solamente se podrán vincular como beneficiarios personas naturales mayores de 18 años de edad.</p>
                <p>*Declaro que cuento con la autorización previa y expresa de mi Beneficiario para ingresar sus datos en el presente formulario para ser contactado por el Club Vivamos EL TIEMPO.</p>
              </div>

              {/* Botón ENVIAR principal */}
              <div className="flex justify-center mt-4">
                <Button type="submit" variant="primary" size="lg" className="px-16">
                  ENVIAR
                </Button>
              </div>

            </form>

          </div>
        </div>
      </main>
    </div>
  );
}

export default InviteBeneficiariesTemplate;
