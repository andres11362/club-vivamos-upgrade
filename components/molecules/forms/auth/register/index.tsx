"use client";

/**
 * @file index.tsx
 * @description Componente de formulario de registro de cuenta (RegisterForm).
 * Sigue los estándares del proyecto (SOLID, TypeScript, React 19/Next 16, Tailwind CSS).
 * Integra registro de usuario clásico con validación reactiva de campos (`validation.ts`),
 * registro social (Google y Facebook mediante carga de SDKs), y validación de checkboxes obligatorios.
 */

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useAuth } from "@/context/AuthContext";
import { validateString, validateEmail, validatePassword } from "@/utils/validation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Configuración de URLs del Club (SAC)
const DEFAULT_SAC = {
    TERMS: {
        URL: "http://mailpush.eltiempo.com/Terminos%20y%20condiciones/Politicas.pdf",
    },
    AUTH: {
        URL: "https://www.eltiempo.com/legal/AUTORIZACION_DE_TRATAMIENTO_DE_DATOS_PERSONALES_CEET.pdf",
    },
    PROCESSING_POLICY: {
        URL: "https://www.eltiempo.com/legal/POLITICA_DE_TRATAMIENTO_Y_PROCEDIMIENTOS_EN_MATERIA_DE_PROTECCION_DE_DATOS_PERSONALES.pdf",
    },
    DATA_POLICY: {
        URL: "https://www.eltiempo.com/politica-de-cookies",
    },
};

const getSacConfig = () => {
    if (typeof window === "undefined" || !process.env.SAC) {
        return DEFAULT_SAC;
    }
    try {
        return JSON.parse(process.env.SAC);
    } catch (e) {
        return DEFAULT_SAC;
    }
};

const RegisterForm = () => {
    const { state, register, facebookLogin, googleLogin } = useAuth();
    const { loading, error } = state;

    // URLs de soporte al cliente
    const SAC = getSacConfig();

    // Estados locales para los campos
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [formChecks, setFormChecks] = useState({
        politics: false,
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    // Estados de errores de validación de campos
    const [fieldErrors, setFieldErrors] = useState<{
        firstname?: string;
        lastname?: string;
        email?: string;
        password?: string;
        politics?: string;
    }>({});

    const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
    const facebookAppId = process.env.FACEBOOK_APP_ID || "";

    // Precarga dinámica de los SDKs de Google y Facebook para login social
    useEffect(() => {
        // Cargar Google GSI
        if (!(window as any).google?.accounts) {
            const googleScript = document.createElement("script");
            googleScript.src = "https://accounts.google.com/gsi/client";
            googleScript.async = true;
            googleScript.defer = true;
            document.body.appendChild(googleScript);
        }

        // Cargar Facebook SDK
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

    // Manejo del cambio de texto en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpieza reactiva de errores del campo modificado
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Manejo del cambio de los checkboxes
    const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormChecks((prev) => ({
            ...prev,
            [name]: checked,
        }));
        if (name === "politics" && checked) {
            setFieldErrors((prev) => ({
                ...prev,
                politics: "",
            }));
        }
    };

    // Manejo de Google Login social para registro (`register = true`)
    const handleGoogleRegister = () => {
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

                            // Adaptar respuesta al formato exacto de AuthContext.googleLogin(resp, true)
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
                            }, true);
                        } catch (err) {
                            console.error("Error en flujo Google Register:", err);
                        }
                    }
                },
            });

            tokenClient.requestAccessToken();
        } catch (e) {
            console.error("Error al iniciar Google Register:", e);
        }
    };

    // Manejo de Facebook Login social para registro (`register = true`)
    const handleFacebookRegister = () => {
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
                                    // Adaptar al formato exacto de AuthContext.facebookLogin(resp, true)
                                    await facebookLogin({
                                        accessToken: auth.accessToken,
                                        id: profileResponse.id,
                                        userID: auth.userID,
                                        name: profileResponse.name || `${profileResponse.first_name} ${profileResponse.last_name}`,
                                        email: profileResponse.email || "",
                                        data_access_expiration_time: auth.data_access_expiration_time || auth.expiresIn || 0,
                                    }, true);
                                } catch (err) {
                                    console.error("Error en flujo Facebook Register:", err);
                                }
                            }
                        );
                    }
                },
                { scope: "public_profile,email" }
            );
        } catch (e) {
            console.error("Error al iniciar Facebook Register:", e);
        }
    };

    // Validaciones locales del registro basadas en el archivo original y helpers
    const validateForm = (): boolean => {
        let isValid = true;
        const tempErrors: typeof fieldErrors = {};

        // 1. Validar Nombres
        const nameErr = validateString(formData.firstname, "Nombres");
        if (nameErr !== "") {
            tempErrors.firstname = nameErr;
            isValid = false;
        } else if (formData.firstname.length < 3 || formData.firstname.length > 30) {
            tempErrors.firstname = "Este campo debe tener minimo 3 caracteres y maximo 30";
            isValid = false;
        }

        // 2. Validar Apellidos
        const lastnameErr = validateString(formData.lastname, "Apellidos");
        if (lastnameErr !== "") {
            tempErrors.lastname = lastnameErr;
            isValid = false;
        } else if (formData.lastname.length < 3 || formData.lastname.length > 30) {
            tempErrors.lastname = "Este campo debe tener minimo 3 caracteres y maximo 30";
            isValid = false;
        }

        // 3. Validar Correo Electrónico
        const emailErr = validateEmail(formData.email);
        if (emailErr !== "") {
            tempErrors.email = emailErr;
            isValid = false;
        }

        // 4. Validar Contraseña
        const passwordErr = validatePassword(formData.password);
        if (passwordErr.error) {
            tempErrors.password = passwordErr.message;
            isValid = false;
        } else if (formData.password.length < 6) {
            tempErrors.password = "La contraseña debe tener al menos 6 caracteres";
            isValid = false;
        }

        // 5. Validar Aceptación de Políticas de Privacidad
        if (!formChecks.politics) {
            tempErrors.politics =
                "Recuerda aceptar los Términos y condiciones, las Políticas de tratamiento de datos y las políticas de navegación.";
            isValid = false;
        }

        setFieldErrors(tempErrors);
        return isValid;
    };

    // Envío del registro clásico
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            await register(e);
        } else {
            console.log("Validación de registro fallida:", fieldErrors);
        }
    };

    // Procesamiento del mensaje de error general del servidor
    const errorMessage = error
        ? typeof error === "string"
            ? error
            : error.message || error.error_description || JSON.stringify(error)
        : null;

    return (
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
            <h1 className="text-xl md:text-2xl font-bold text-[#03091e] uppercase text-center mb-8">
                Registra una cuenta
            </h1>

            {errorMessage && (
                <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200 animate-fadeIn">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                {/* Nombres Input */}
                <div className="w-full">
                    <Input
                        label=""
                        placeholder="Nombre"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        disabled={loading}
                        className={fieldErrors.firstname ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.firstname && (
                        <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                            {fieldErrors.firstname}
                        </span>
                    )}
                </div>

                {/* Apellidos Input */}
                <div className="w-full">
                    <Input
                        label=""
                        placeholder="Apellidos"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        disabled={loading}
                        className={fieldErrors.lastname ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                    />
                    {fieldErrors.lastname && (
                        <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                            {fieldErrors.lastname}
                        </span>
                    )}
                </div>

                {/* Email Input */}
                <div className="w-full">
                    <Input
                        label=""
                        placeholder="Correo electrónico"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        className={fieldErrors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-blue-50/30" : "bg-blue-50/30"}
                    />
                    {fieldErrors.email && (
                        <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                            {fieldErrors.email}
                        </span>
                    )}
                </div>

                {/* Password Input */}
                <div className="w-full flex flex-col gap-1">
                    <div className="relative w-full">
                        <Input
                            label=""
                            placeholder="Contraseña"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            className={
                                fieldErrors.password
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-blue-50/30 pr-10"
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
                    <span className="text-[10px] md:text-xs text-gray-400 px-1 leading-normal select-none">
                        *Mínimo 6 caracteres, 1 minúscula, 1 mayúscula y 1 número
                    </span>
                    {fieldErrors.password && (
                        <span className="text-xs text-red-500 mt-1 block px-1 animate-fadeIn font-semibold">
                            {fieldErrors.password}
                        </span>
                    )}
                </div>

                {/* Checkboxes Legales y de Políticas */}
                <div className="flex flex-col gap-4 mt-2 mb-2">
                    <div className="flex flex-col gap-1">
                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <input
                                type="checkbox"
                                name="politics"
                                checked={formChecks.politics}
                                onChange={handleCheckChange}
                                disabled={loading}
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            />
                            <span className="text-xs text-gray-500 leading-relaxed text-justify">
                                Autorizo el tratamiento de mis datos personales conforme con las{" "}
                                <a
                                    href={SAC.PROCESSING_POLICY.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline font-semibold"
                                >
                                    políticas de privacidad
                                </a>{" "}
                                y datos de{" "}
                                <a
                                    href={SAC.DATA_POLICY.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline font-semibold"
                                >
                                    Navegación / cookies
                                </a>{" "}
                                de EL TIEMPO, las cuales he leído y entendido.
                            </span>
                        </label>
                        {fieldErrors.politics && (
                            <span className="text-xs text-red-500 mt-1 block px-7 animate-fadeIn font-semibold">
                                {fieldErrors.politics}
                            </span>
                        )}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formChecks.terms}
                            onChange={handleCheckChange}
                            disabled={loading}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 leading-relaxed text-justify">
                            Autorizo el envío de información comercial y promocional diferente a la relacionada con el bien o servicio adquirido.{" "}
                            <a
                                href={SAC.AUTH.URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline font-semibold"
                            >
                                Autorización
                            </a>
                        </span>
                    </label>
                </div>

                {/* Botón Principal Registrarse */}
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
                            Registrando...
                        </span>
                    ) : (
                        "Registrarse"
                    )}
                </Button>

                {/* Separador */}
                <div className="flex items-center gap-4 my-2 w-full select-none">
                    <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                    <span className="text-gray-400 text-sm font-semibold">O</span>
                    <hr className="flex-grow border-gray-300 dark:border-gray-700" />
                </div>

                {/* Botones de Login Social para Registro */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleGoogleRegister}
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
                        Registrarme con Google
                    </button>

                    <button
                        type="button"
                        onClick={handleFacebookRegister}
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
                        Registrarme con Facebook
                    </button>
                </div>

                {/* Enlace Iniciar Sesión */}
                <div className="text-center mt-6">
                    <Link href="/login" className="text-sm text-teal-600 hover:underline">
                        ¿Ya tienes una cuenta? <span className="font-semibold underline">¡Inicia sesión!</span>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
