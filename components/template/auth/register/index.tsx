'use client';

import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const RegistroTemplate = () => {
  const { state, register, facebookLogin, googleLogin } = useAuth();
  const { loading, error } = state;
  const [showPassword, setShowPassword] = React.useState(false);

  // Parse error message safely
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message || error.error_description || JSON.stringify(error)
    : null;

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
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
            
            <h1 className="text-xl md:text-2xl font-bold text-[#03091e] uppercase text-center mb-8">
              Registra una cuenta
            </h1>

            {errorMessage && (
              <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={register} className="w-full max-w-sm flex flex-col gap-4">
              
              <Input 
                label="" 
                placeholder="Nombre" 
                type="text" 
                name="firstname"
                required
                disabled={loading}
              />
              
              <Input 
                label="" 
                placeholder="Apellidos" 
                type="text" 
                name="lastname"
                required
                disabled={loading}
              />

              <Input 
                label="" 
                placeholder="beneficiarioclub12@yopmail.com" 
                type="email" 
                name="email"
                required
                disabled={loading}
                className="bg-blue-50/30" 
              />

              <div className="flex flex-col gap-1 w-full">
                <div className="relative w-full">
                  <Input 
                    label="" 
                    placeholder="Contraseña" 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    disabled={loading}
                    className="bg-blue-50/30 pr-10" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 px-1">
                  *Mínimo 6 caracteres, 1 minúscula, 1 mayúscula y 1 número
                </span>
              </div>

              {/* Checkboxes Legales */}
              <div className="flex flex-col gap-4 mt-2 mb-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="politics"
                    required
                    disabled={loading}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" 
                  />
                  <span className="text-xs text-gray-500 leading-relaxed text-justify">
                    Autorizo el tratamiento de mis datos personales conforme con las <Link href="/static/privacy" className="text-blue-500 hover:underline">políticas de privacidad</Link> y datos de <Link href="/static/privacy" className="text-blue-500 hover:underline">Navegación / cookies</Link> de EL TIEMPO, las cuales he leído y entendido.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    name="terms"
                    disabled={loading}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" 
                  />
                  <span className="text-xs text-gray-500 leading-relaxed text-center w-full">
                    Autorizo el envío de información comercial y promocional diferente a la relacionada con el bien o servicio adquirido.
                  </span>
                </label>
              </div>

              {/* Botón Principal */}
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>

              {/* Botones Sociales */}
              <div className="flex flex-col gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => googleLogin({ accessToken: "dummy" }, true)}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-11 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  Ingresar con Google
                </button>
                
                <button 
                  type="button" 
                  onClick={() => facebookLogin({ accessToken: "dummy" }, true)}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-11 rounded-full bg-[#3b5998] text-white font-semibold text-sm hover:bg-[#3b5998]/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  Ingresar con Facebook
                </button>
              </div>

              <div className="text-center mt-6">
                <Link href="/login" className="text-sm text-teal-600 hover:underline">
                  ¿Ya tienes una cuenta? <span className="font-semibold underline">¡Inicia sesión!</span>
                </Link>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

export default RegistroTemplate;
