'use client';

import React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const LoginTemplate = () => {
  const { state, login, facebookLogin, googleLogin } = useAuth();
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
        <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden min-h-[600px]">
          
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

          {/* LADO DERECHO: Formulario de Login */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center">
            
            <h1 className="text-lg md:text-xl font-bold text-[#03091e] uppercase text-center max-w-xs mb-8">
              Ingresa con tu cuenta de Casa Editorial El Tiempo
            </h1>

            {errorMessage && (
              <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={login} className="w-full max-w-sm flex flex-col gap-4">
              
              <Input 
                label="" 
                placeholder="beneficiarioclub12@yopmail.com" 
                type="email" 
                name="username"
                required
                disabled={loading}
                className="bg-blue-50/30"
              />

              <div className="relative w-full">
                <Input 
                  label="" 
                  placeholder="••••••••••••" 
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

              <div className="w-full text-left mt-1">
                <Link href="/usuario/restablecer-contrasena" className="text-sm text-teal-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón Principal */}
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              {/* Separador */}
              <div className="flex items-center gap-4 my-4 w-full">
                <hr className="flex-grow border-gray-300" />
                <span className="text-gray-400 text-sm font-medium">O</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Botones Sociales */}
              <div className="flex flex-col gap-3">
                <button 
                  type="button" 
                  onClick={() => googleLogin({ accessToken: "dummy" })}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-11 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  Ingresar con Google
                </button>
                
                <button 
                  type="button" 
                  onClick={() => facebookLogin({ accessToken: "dummy" })}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-11 rounded-full bg-[#3b5998] text-white font-semibold text-sm hover:bg-[#3b5998]/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  <img src="/facebook-icon.svg" alt="Facebook" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  Ingresar con Facebook
                </button>
              </div>

              <div className="text-center mt-6">
                <Link href="/zona-usuario/crear" className="text-sm text-teal-600 hover:underline">
                  No tengo una cuenta. <span className="font-semibold">¡Registrarme!</span>
                </Link>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

export default LoginTemplate;
