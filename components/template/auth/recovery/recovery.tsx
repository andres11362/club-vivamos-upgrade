import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';

const RecoveryPasswordTemplate = () => {
    return (
        <div className="min-h-screen flex flex-col font-barlow bg-white">

            {/* Contenedor principal que centra el contenido vertical y horizontalmente */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24">

                {/* Contenedor restringido a un ancho máximo para que no se estire en Desktop */}
                <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">

                    {/* Títulos */}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#03091e] uppercase tracking-wide mb-3">
                            ¿Olvidaste tu contraseña?
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            Ingresa tu correo electrónico para enviar tu nueva contraseña
                        </p>
                    </div>

                    {/* Formulario */}
                    <form className="w-full flex flex-col items-center gap-5 mt-4">

                        {/* Input de correo */}
                        <div className="w-full">
                            <Input
                                label=""
                                type="email"
                                placeholder="Correo electrónico"
                                className="w-full"
                            />
                        </div>

                        {/* Placeholder del reCAPTCHA */}
                        <div className="border border-gray-300 bg-gray-50 w-[300px] h-[78px] rounded flex items-center px-4 shadow-sm">
                            <div className="w-7 h-7 border-2 border-gray-300 bg-white rounded-sm mr-3"></div>
                            <span className="text-sm text-gray-700">No soy un robot</span>
                            <div className="ml-auto flex flex-col items-center">
                                <img src="/recaptcha-logo.png" alt="reCAPTCHA" className="w-8 h-8 opacity-50" />
                                <span className="text-[10px] text-gray-400">Privacidad - Términos</span>
                            </div>
                        </div>

                        {/* Botón de envío (Asumido, ya que la publicidad lo tapaba) */}
                        <div className="w-full mt-2">
                            <Button type="submit" variant="primary" size="lg" fullWidth>
                                Enviar nueva contraseña
                            </Button>
                        </div>

                    </form>

                </div>
            </main>
        </div>
    );
}

export default RecoveryPasswordTemplate;
