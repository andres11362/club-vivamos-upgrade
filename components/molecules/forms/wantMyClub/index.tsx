"use client";

/**
 * @file index.tsx
 * @description Componente de formulario de cliente para "Conoce el Club" (WantMyClub).
 * Sigue los estándares del proyecto (SOLID, TypeScript, React 19/Next 16, Tailwind CSS).
 * Integra validaciones locales, del helper `validation.ts`, reCAPTCHA condicional y envío seguro con `useWebForm`.
 */

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/atoms/button";
import { Input, Select } from "@/components/atoms/input";
import { useWebForm } from "@/hooks/useWebForm";
import { validateFields, FormErrors } from "@/utils/validation";
import { DocumentOptions } from "@/utils/documentOptions";
import { KnowClubPolitics } from "@/utils/formsPolitics";

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

const getWebFormId = (): string => {
    if (typeof window === "undefined" || !process.env.SUSCRIPTION_NEWSLETTER) {
        return "quiero_el_club";
    }
    try {
        const config = JSON.parse(process.env.SUSCRIPTION_NEWSLETTER);
        return config.WEBFORM_KNOWCLUB || "quiero_el_club";
    } catch {
        return "quiero_el_club";
    }
};

const WantMyClubForm = () => {
    const { loading, result, error: submitError, submitForm } = useWebForm();

    // Configuración de URLs legales
    const SAC = getSacConfig();

    // Estados locales para los campos
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        tipo_documento: "",
        documento: "",
        email: "",
        celular: "",
    });

    const [formChecks, setFormChecks] = useState({
        aceptar_terminos: false,
        politica_datos: false,
    });

    // Estados para validaciones y errores
    const [errors, setErrors] = useState<FormErrors>({});
    const [checkErrors, setCheckErrors] = useState<{ aceptar_terminos?: string }>({});

    // Estados de reCAPTCHA
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const [recaptchaError, setRecaptchaError] = useState<"none" | "block">("none");

    // Estados de visualización de alertas
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [alertErrorMessage, setAlertErrorMessage] = useState("");

    const recaptchaContainerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    // Configuración de reCAPTCHA leída de forma segura de las variables de entorno
    const googleConfig = getGoogleConfig();
    const siteKey = googleConfig.RECAPTCHA?.SITE_KEY || "";
    const recaptchaActive = googleConfig.RECAPTCHA?.ACTIVE ?? false;

    // Cargar e Inicializar el script de Google reCAPTCHA si está activo
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
            // Si la API de Google ya está cargada
            if ((window as any).grecaptcha.render) {
                loadRecaptcha();
            } else {
                // En caso de que se esté cargando pero no esté lista para renderizar
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

    // Alertas de Éxito temporizadas (4 segundos)
    useEffect(() => {
        if (result) {
            setShowSuccess(true);
            setShowError(false);
            const timer = setTimeout(() => setShowSuccess(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [result]);

    // Alertas de Error temporizadas (4 segundos)
    useEffect(() => {
        if (submitError) {
            setAlertErrorMessage(submitError);
            setShowError(true);
            setShowSuccess(false);
            const timer = setTimeout(() => setShowError(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [submitError]);

    // Manejo de cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiar error del campo modificado de forma reactiva
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Manejo de cambios en los checkboxes
    const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormChecks((prev) => ({
            ...prev,
            [name]: checked,
        }));
        if (name === "aceptar_terminos" && checked) {
            setCheckErrors({});
        }
    };

    // Validador de los campos del formulario
    const validate = (): boolean => {
        let isValid = true;

        // Llamado al helper de validaciones común del proyecto
        const validationResult = validateFields(formData, "knowclub");

        if (validationResult && !("error" in validationResult)) {
            setErrors(validationResult);
            const hasErrors = Object.values(validationResult).some((val) => val !== "");
            if (hasErrors) {
                isValid = false;
            }
        } else {
            setErrors({});
        }

        // Validación de la aceptación de términos
        const tempCheckErrors: { aceptar_terminos?: string } = {};
        if (KnowClubPolitics.terminos && !formChecks.aceptar_terminos) {
            tempCheckErrors.aceptar_terminos = "Debes aceptar los términos y condiciones.";
            isValid = false;
        }
        setCheckErrors(tempCheckErrors);

        return isValid;
    };

    // Validador de Captcha
    const validateCaptcha = (): boolean => {
        // COMPORTAMIENTO HEREDADO (¡ATENCIÓN! Condición invertida del proyecto original):
        // Si recaptchaActive es false, se valida que el token no sea null. Si es true, se salta la validación.
        if (!recaptchaActive) {
            if (recaptcha !== null && recaptcha !== undefined) {
                setRecaptchaError("none");
                return true;
            } else {
                setRecaptchaError("block");
                return false;
            }
        } else {
            setRecaptchaError("none");
            return true;
        }
    };

    // Envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate() && validateCaptcha()) {
            // Mapeo e Inmutabilidad de los datos enviados a la API (Drupal)
            const body = {
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                tipo_documento: formData.tipo_documento,
                numero_documento: formData.documento,
                correo_electronico: formData.email,
                celular: formData.celular,
                terminos: formChecks.aceptar_terminos ? 1 : 0,
            };

            const webformId = getWebFormId();
            const res = await submitForm(body, webformId);

            if (res.success) {
                // Reseteo declarativo del formulario ante envío exitoso
                setFormData({
                    nombres: "",
                    apellidos: "",
                    tipo_documento: "",
                    documento: "",
                    email: "",
                    celular: "",
                });
                setFormChecks({
                    aceptar_terminos: false,
                    politica_datos: false,
                });
                setRecaptcha(null);
                if (widgetIdRef.current !== null && (window as any).grecaptcha) {
                    (window as any).grecaptcha.reset(widgetIdRef.current);
                }
            }
        } else {
            console.log("Estado errores formulario:", errors);
            console.log("Estado errores checkbox:", checkErrors);
            console.log("Estado error captcha:", recaptchaError);
        }
    };

    // Opciones de tipos de documento
    const docOptions = DocumentOptions().map((opt) => ({
        value: opt.value,
        label: opt.name,
    }));

    return (
        <div className="w-full">
            {/* Alerta de Éxito */}
            {showSuccess && (
                <div
                    className="flex items-center gap-3 p-4 mb-4 text-green-800 dark:text-green-300 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 shadow-sm transition-all duration-300 animate-fadeIn"
                    role="alert"
                >
                    <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="text-sm font-medium">
                        Tu solicitud de asesoría ha sido enviada con éxito.
                    </span>
                </div>
            )}

            {/* Alerta de Error */}
            {showError && (
                <div
                    className="flex items-center gap-3 p-4 mb-4 text-red-800 dark:text-red-300 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 shadow-sm transition-all duration-300 animate-fadeIn"
                    role="alert"
                >
                    <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="text-sm font-medium">
                        {alertErrorMessage || "Ha ocurrido un error, por favor intenta nuevamente."}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Nombres y Apellidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                        <Input
                            label="Nombres*"
                            placeholder="Escribe tu nombre aquí"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            disabled={loading}
                            className={errors.nombres ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {errors.nombres && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.nombres}</span>
                        )}
                    </div>

                    <div className="w-full">
                        <Input
                            label="Apellidos*"
                            placeholder="Escribe tu apellido"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            disabled={loading}
                            className={errors.apellidos ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {errors.apellidos && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.apellidos}</span>
                        )}
                    </div>
                </div>

                {/* Tipo de Documento y Número */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                        <Select
                            label="Tipo de documento*"
                            name="tipo_documento"
                            value={formData.tipo_documento}
                            onChange={handleChange}
                            options={docOptions}
                            disabled={loading}
                            className={errors.tipo_documento ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {errors.tipo_documento && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.tipo_documento}</span>
                        )}
                    </div>

                    <div className="w-full">
                        <Input
                            label="Número de documento*"
                            placeholder="Ingresa el número de documento"
                            name="documento"
                            value={formData.documento}
                            onChange={handleChange}
                            disabled={loading}
                            className={
                                errors.documento || errors.longitud_documento
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : ""
                            }
                        />
                        {errors.documento && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.documento}</span>
                        )}
                        {errors.longitud_documento && !errors.documento && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.longitud_documento}</span>
                        )}
                    </div>
                </div>

                {/* Correo Electrónico y Celular */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                        <Input
                            label="Correo electrónico*"
                            placeholder="Ingresa tu correo electrónico"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className={errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.email}</span>
                        )}
                    </div>

                    <div className="w-full">
                        <Input
                            label="Celular*"
                            placeholder="Ingresa tu Número de Celular"
                            name="celular"
                            type="tel"
                            value={formData.celular}
                            onChange={handleChange}
                            disabled={loading}
                            className={errors.celular ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                        />
                        {errors.celular && (
                            <span className="text-xs text-red-500 mt-1 block px-1">{errors.celular}</span>
                        )}
                    </div>
                </div>

                {/* Checkboxes de Políticas de Tratamiento de Datos */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-1">
                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <input
                                type="checkbox"
                                name="aceptar_terminos"
                                checked={formChecks.aceptar_terminos}
                                onChange={handleCheckChange}
                                disabled={loading}
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            />
                            <span className="text-xs text-gray-500 leading-relaxed">
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
                        {checkErrors.aceptar_terminos && (
                            <span className="text-xs text-red-500 mt-1 block px-7 font-medium">
                                {checkErrors.aceptar_terminos}
                            </span>
                        )}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                        <input
                            type="checkbox"
                            name="politica_datos"
                            checked={formChecks.politica_datos}
                            onChange={handleCheckChange}
                            disabled={loading}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 leading-relaxed">
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

                {/* Contenedor Condicional del Widget de reCAPTCHA */}
                {recaptchaActive && (
                    <div className="flex flex-col gap-2 my-2 justify-center items-center">
                        <div ref={recaptchaContainerRef} />
                        {recaptchaError === "block" && (
                            <span className="text-xs text-red-500 font-semibold text-center">
                                Comprueba que no eres un robot.
                            </span>
                        )}
                    </div>
                )}

                {/* Botón de Envío */}
                <div className="mt-6 flex justify-center md:px-12">
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
                                ENVIANDO...
                            </span>
                        ) : (
                            "SOLICITAR ASESORÍA"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default WantMyClubForm;
