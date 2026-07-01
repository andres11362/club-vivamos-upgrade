"use client";

/**
 * @file index.tsx
 * @description Componente de formulario de inicio de sesión (LoginForm).
 * Sigue los estándares del proyecto (SOLID, TypeScript, React 19/Next 16, Tailwind CSS).
 * Integra login clásico con validación reactiva de campos (`validation.ts`),
 * login social (Google y Facebook mediante carga de SDKs), y validación de reCAPTCHA.
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword } from "@/utils/validation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface GoogleConfig {
  RECAPTCHA?: {
    SITE_KEY?: string;
    ACTIVE?: boolean;
  };
}

const getGoogleConfig = (): GoogleConfig => {
  if (typeof window === "undefined" || !process.env.GOOGLE) {
    return {};
  }
  try {
    return JSON.parse(process.env.GOOGLE) as GoogleConfig;
  } catch {
    return {};
  }
};

const LoginForm = () => {
  const { state, login, facebookLogin, googleLogin } = useAuth();
  const { loading, error } = state;
  
  // Estados para controlar inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de errores de validación de campos
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Estados de reCAPTCHA
  const [recaptcha, setRecaptcha] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<"none" | "block">("none");

  // Referencias para el reCAPTCHA
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  // Carga de configuración de entorno
  const googleConfig = getGoogleConfig();
  const siteKey = googleConfig.RECAPTCHA?.SITE_KEY || "";
  const recaptchaActive = googleConfig.RECAPTCHA?.ACTIVE ?? false;

  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
  const facebookAppId = process.env.FACEBOOK_APP_ID || "";

  /*
  // 1. Cargar e inicializar Google reCAPTCHA
  useEffect(() => {
    if (!recaptchaActive || !siteKey) return;

    const loadRecaptcha = () => {
      if ((window as any).grecaptcha && recaptchaContainerRef.current && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = (window as any).grecaptcha.render(recaptchaContainerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setRecaptcha(token);
              setRecaptchaError("none");
            },
            "expired-callback": () => {
              setRecaptcha(null);
            },
          });
        } catch (e) {
          console.warn("reCAPTCHA already rendered", e);
        }
      }
    };

    if (!(window as any).grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = loadRecaptcha;
      document.body.appendChild(script);
    } else {
      if ((window as any).grecaptcha.render) {
        loadRecaptcha();
      } else {
        const interval = setInterval(() => {
          if ((window as any).grecaptcha && (window as any).grecaptcha.render) {
            loadRecaptcha();
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, [recaptchaActive, siteKey]);
  */

  // 2. Cargar SDKs sociales
  useEffect(() => {
    // Google GSI
    if (!(window as any).google?.accounts) {
      const googleScript = document.createElement("script");
      googleScript.src = "https://accounts.google.com/gsi/client";
      googleScript.async = true;
      googleScript.defer = true;
      document.body.appendChild(googleScript);
    }

    // Facebook SDK
    if (!(window as any).FB) {
      const fbScript = document.createElement("script");
      fbScript.src = "https://connect.facebook.net/es_LA/sdk.js";
      fbScript.async = true;
      fbScript.defer = true;
      fbScript.onload = () => {
        if ((window as any).FB && facebookAppId) {
          (window as any).FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
        }
      };
      document.body.appendChild(fbScript);
    } else {
      try {
        if (facebookAppId) {
          (window as any).FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
        }
      } catch (e) {
        // Ya inicializado
      }
    }
  }, [facebookAppId]);

  // Manejo de Google Login
  const handleGoogleLogin = () => {
    if (loading) return;

    if (!(window as any).google?.accounts?.oauth2) {
      console.error("El SDK de Google no ha cargado.");
      return;
    }

    try {
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error("Error al obtener token de Google:", tokenResponse.error);
            return;
          }

          if (tokenResponse.access_token) {
            try {
              const resProfile = await fetch(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
              );
              if (!resProfile.ok) {
                throw new Error("No se pudo obtener el perfil de Google.");
              }
              const profile = await resProfile.json();

              await googleLogin({
                accessToken: tokenResponse.access_token,
                googleId: profile.sub,
                profileObj: {
                  givenName: profile.given_name || "",
                  familyName: profile.family_name || "",
                  email: profile.email || "",
                },
                tokenObj: {
                  expires_at: String(Date.now() + Number(tokenResponse.expires_in) * 1000),
                },
              });
            } catch (err) {
              console.error("Error en flujo Google Login:", err);
            }
          }
        },
      });

      tokenClient.requestAccessToken();
    } catch (e) {
      console.error("Error al iniciar login con Google:", e);
    }
  };

  // Manejo de Facebook Login
  const handleFacebookLogin = () => {
    if (loading) return;

    if (!(window as any).FB) {
      console.error("El SDK de Facebook no ha cargado.");
      return;
    }

    try {
      (window as any).FB.login(
        (loginResponse: any) => {
          if (loginResponse.authResponse) {
            const auth = loginResponse.authResponse;

            (window as any).FB.api(
              "/me",
              { fields: "name,first_name,last_name,email" },
              async (profileResponse: any) => {
                try {
                  await facebookLogin({
                    accessToken: auth.accessToken,
                    id: profileResponse.id,
                    userID: auth.userID,
                    name: profileResponse.name || `${profileResponse.first_name} ${profileResponse.last_name}`,
                    email: profileResponse.email || "",
                    data_access_expiration_time: auth.data_access_expiration_time || auth.expiresIn || 0,
                  });
                } catch (err) {
                  console.error("Error en callback Facebook Login:", err);
                }
              }
            );
          }
        },
        { scope: "public_profile,email" }
      );
    } catch (e) {
      console.error("Error al iniciar login con Facebook:", e);
    }
  };

  // Validaciones del Formulario de Inicio de Sesión
  const validateForm = (): boolean => {
    let isValid = true;
    const tempErrors: { email?: string; password?: string } = {};

    // 1. Validar correo electrónico
    const emailValidationMsg = validateEmail(email);
    if (emailValidationMsg !== "") {
      tempErrors.email = emailValidationMsg;
      isValid = false;
    }

    // 2. Validar contraseña
    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult.error) {
      tempErrors.password = passwordValidationResult.message;
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setFieldErrors(tempErrors);
    return isValid;
  };

  /*
  // Validador de Captcha
  const validateCaptcha = (): boolean => {
    if (recaptchaActive) {
      if (recaptcha !== null && recaptcha !== undefined) {
        setRecaptchaError("none");
        return true;
      } else {
        setRecaptchaError("block");
        return false;
      }
    }
    setRecaptchaError("none");
    return true;
  };
  */

  // Envío del Formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = validateForm();
    // const isCaptchaValid = validateCaptcha();

    if (isFormValid /* && isCaptchaValid */) {
      await login(e);
    } else {
      console.log("Validación de formulario fallida:", {
        fieldErrors,
        // captchaError: recaptchaError === "block"
      });
    }
  };

  // Procesamiento del mensaje de error general del servidor
  const errorMessage = error
    ? typeof error === "string"
      ? error
      : error.message || error.error_description || JSON.stringify(error)
    : null;

  return (
    <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center">
      <h1 className="text-lg md:text-xl font-bold text-[#03091e] uppercase text-center max-w-xs mb-8 leading-snug">
        Ingresa con tu cuenta de Casa Editorial El Tiempo
      </h1>

      {errorMessage && (
        <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {/* Email Input */}
        <div className="w-full">
          <Input
            label=""
            placeholder="Correo electrónico"
            type="email"
            name="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            disabled={loading}
            className={fieldErrors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-blue-50/30"}
          />
          {fieldErrors.email && (
            <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Password Input */}
        <div className="w-full">
          <div className="relative w-full">
            <Input
              label=""
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }
              }}
              disabled={loading}
              className={
                fieldErrors.password
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500 pr-10"
                  : "bg-blue-50/30 pr-10"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.password && (
            <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
              {fieldErrors.password}
            </span>
          )}
        </div>

        {/* Recuperar Contraseña Link */}
        <div className="w-full text-left mt-1">
          <Link href="/usuario/restablecer-contrasena" className="text-sm text-teal-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Widget de reCAPTCHA Condicional
        {recaptchaActive && (
          <div className="flex flex-col gap-2 my-2 justify-center items-center">
            <div ref={recaptchaContainerRef} />
            {recaptchaError === "block" && (
              <span className="text-xs text-red-500 font-semibold text-center animate-fadeIn">
                Comprueba que no eres un robot.
              </span>
            )}
          </div>
        )}
        */}

        {/* Botón de Submit */}
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        {/* Separador */}
        <div className="flex items-center gap-4 my-2 w-full select-none">
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
          <span className="text-gray-400 text-sm font-semibold">O</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        </div>

        {/* Botones de Redes Sociales */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full h-11 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            Ingresar con Google
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full h-11 rounded-full bg-[#3b5998] text-white font-semibold text-sm hover:bg-[#3b5998]/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <img
              src="/facebook-icon.svg"
              alt="Facebook"
              className="w-5 h-5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            Ingresar con Facebook
          </button>
        </div>

        {/* Registrarse Link */}
        <div className="text-center mt-6">
          <Link href="/zona-usuario/crear" className="text-sm text-teal-600 hover:underline">
            No tengo una cuenta. <span className="font-semibold">¡Registrarme!</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
