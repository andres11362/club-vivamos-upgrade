import { Button } from '@/components/atoms/button'; // Importamos el átomo que creamos previamente

const Newsletter = () => {
    return (
        <section className="w-full py-12 px-4">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                {/* Título Principal */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#03091e] mb-8 tracking-tight">
                    Sé el primero en recibir la información sobre ofertas y promociones de temporada
                </h2>

                <form className="w-full flex flex-col gap-6">

                    {/* =========================================
              El Contenedor "Fusionado" (Input + Botón)
              ========================================= */}
                    {/* El div padre tiene el borde redondeado (rounded-md) y un padding pequeño (p-1) */}
                    <div className="relative w-full h-8 md:h-8 shadow-sm">
                        {/* Input:
                            - 'border-r-0' elimina la línea gris del lado derecho.
                            - 'rounded-l-md rounded-r-full' mantiene la izquierda ligeramente cuadrada 
                                y hace la derecha totalmente redonda para que se esconda bajo el botón.
                            - Eliminamos el 'focus:ring' para que el halo de enfoque no se asome por la derecha.
                        */}
                        <input 
                            type="email" 
                            placeholder="Ingresa tu correo" 
                            className="w-full h-full bg-white border border-gray-300 border-r-0 rounded-l-md rounded-r-full pl-4 pr-[180px] md:pr-[220px] text-sm md:text-base outline-none focus:border-[#e6194b] transition-all"
                            required
                        />

                        {/* Botón "Sticker":
                            'absolute right-0 top-0' lo ancla sobre la esquina derecha del input.
                            'h-full' hace que iguale la altura exacta de la caja.
                            'rounded-full' le da la forma de píldora total en ambos extremos.
                        */}
                        <button 
                            type="submit" 
                            className="absolute right-0 top-0 h-full bg-[#e6194b] hover:bg-[#c2143d] text-white font-bold text-sm md:text-base px-6 md:px-8 rounded-full transition-colors"
                        >
                            Suscribirme al boletín
                        </button>
                    </div>

                    {/* =========================================
              Checkboxes Legales
              ========================================= */}
                    <div className="flex flex-col gap-3 px-1">

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#e6194b] focus:ring-[#e6194b]"
                                required
                            />
                            <span className="text-xs md:text-sm text-gray-600 leading-relaxed text-justify md:text-left">
                                Autorizo el tratamiento de mis datos personales conforme con las <a href="#" className="text-blue-500 hover:underline">políticas de privacidad</a> y datos de <a href="#" className="text-blue-500 hover:underline">Navegación / cookies</a> de EL TIEMPO, las cuales he leído y entendido.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#e6194b] focus:ring-[#e6194b]"
                            />
                            <span className="text-xs md:text-sm text-gray-600 leading-relaxed text-justify md:text-left">
                                Autorizo el envío de información comercial y promocional diferente a la relacionada con el bien o servicio adquirido. <a href="#" className="text-blue-500 hover:underline">Encuesta</a>
                            </span>
                        </label>

                    </div>

                </form>

            </div>
        </section>
    );
}

export default Newsletter;
