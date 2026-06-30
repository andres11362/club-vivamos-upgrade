"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import md5 from "js-md5";
import { sha256 } from "js-sha256";
import { getCookie, setCookie, removeCookie } from "../utils/cookieManager";
import { getDocumentType, getUserType } from "../utils/JSONObjects";
import { gtmsaveUserZone } from "../utils/gtmUtils";

// --- Interfaces de Configuración de Entorno ---

export interface EmptorConfig {
  readonly BASE_DOMAIN: string;
  readonly LOGIN: {
    readonly BASIC: string;
    readonly FACEBOOK: string;
    readonly GOOGLE: string;
  };
  readonly LOGOUT: {
    readonly BASIC: string;
  };
  readonly REGISTER: {
    readonly BASIC: string;
  };
  readonly ME: {
    readonly ME: string;
  };
  readonly RECOVERY: string;
  readonly RECOVERY_PASS: string;
  readonly BASIC_TOKEN: string;
  readonly USER_ZONE?: {
    readonly UPDATE_USER?: string;
    readonly CHANGE_EMAIL?: string;
    readonly CHANGE_PASSWORD?: string;
  };
}

export interface BacoConfig {
  readonly BASE_DOMAIN: string;
  readonly BENEFITS: {
    readonly SEGMENT: string;
  };
}

export interface CookiesConfig {
  readonly SESSION: string;
  readonly ALERT_HOME: string;
}

// --- Interfaces de Datos y Estado ---

export interface User {
  readonly id?: string;
  readonly email?: string;
  readonly document?: string;
  readonly document_type_id?: number;
  readonly segmentId?: number;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly [key: string]: any;
}

export interface RecoveryState {
  readonly sended: boolean;
  readonly error: any | null;
  readonly message: string;
  readonly emptorSended: boolean;
  readonly emptorError: any | null;
}

export interface AuthState {
  readonly authenticated: boolean;
  readonly user: User | null;
  readonly loading: boolean;
  readonly error: any | null;
  readonly recovery: RecoveryState;
}

export interface UpdateUserPayload {
  readonly first_name: string;
  readonly last_name: string;
  readonly document_type_id: string | number;
  readonly document: string;
}

export interface ChangePasswordPayload {
  readonly old_password: string;
  readonly new_password: string;
}

export interface PartnerTheme {
  readonly labelClass: string;
  readonly logoClass: string;
}

// --- Firma de Métodos y Acciones Expuestas ---

export interface AuthContextValue {
  readonly state: AuthState;
  readonly partnerTheme: PartnerTheme;
  readonly login: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  readonly register: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  readonly logout: (event?: React.MouseEvent) => Promise<void>;
  readonly facebookLogin: (resp: any, register?: boolean) => Promise<void>;
  readonly googleLogin: (resp: any, register?: boolean) => Promise<void>;
  readonly recoveryPassword: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  readonly recoveryPasswordEmptor: (user_hash: string, passwordVal: string, newPasswordVal: string) => Promise<void>;
  readonly clearResponseEmptor: () => void;
  readonly recoveryRestart: () => void;
  readonly updateUser: (data: UpdateUserPayload) => Promise<void>;
  readonly changeEmail: (newEmail: string) => Promise<void>;
  readonly changePassword: (data: ChangePasswordPayload) => Promise<void>;
}

// --- Contexto de React ---

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// --- Getters Seguros para Variables de Entorno (SSR Safe) ---

const getEmptorConfig = (): EmptorConfig => {
  try {
    const raw = process.env.EMPTOR || process.env.NEXT_PUBLIC_EMPTOR;
    return raw ? JSON.parse(raw) : {} as EmptorConfig;
  } catch {
    return {} as EmptorConfig;
  }
};

const getBacoConfig = (): BacoConfig => {
  try {
    const raw = process.env.BACO || process.env.NEXT_PUBLIC_BACO;
    return raw ? JSON.parse(raw) : {} as BacoConfig;
  } catch {
    return {} as BacoConfig;
  }
};

const getCookiesConfig = (): CookiesConfig => {
  try {
    const raw = process.env.COOKIES || process.env.NEXT_PUBLIC_COOKIES;
    return raw
      ? JSON.parse(raw)
      : { SESSION: "auth", ALERT_HOME: "alert_home" };
  } catch {
    return { SESSION: "auth", ALERT_HOME: "alert_home" };
  }
};

// --- Helper de Eventos GTM ---

const pushToDataLayer = (data: Record<string, any>): void => {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(data);
  }
};

// --- Proveedor del Contexto (AuthProvider) ---

export const AuthProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    user: null,
    loading: false,
    error: null,
    recovery: {
      sended: false,
      error: null,
      message: "",
      emptorSended: false,
      emptorError: null,
    },
  });

  // Efecto de inicialización para cargar la sesión desde la cookie de forma segura en cliente (SSR-Safe)
  useEffect(() => {
    const cookiesConfig = getCookiesConfig();
    const cachedSession = getCookie(cookiesConfig.SESSION);
    if (cachedSession) {
      try {
        const session = typeof cachedSession === "string" ? JSON.parse(cachedSession) : cachedSession;
        if (session && session.authenticated) {
          setState((prev) => ({
            ...prev,
            authenticated: true,
            user: session.user || null,
          }));
        }
      } catch (err) {
        console.error("Error al restaurar sesión de autenticación:", err);
      }
    }
  }, []);

  // --- Sub-Lógica: Consulta EMPTOR /me e Integración BACO segmento ---

  const emptorMe = async (responseLoginData: any, register = false, source = "Tradicional"): Promise<void> => {
    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const meUrl = `${EMPTOR.BASE_DOMAIN}${EMPTOR.ME.ME}`;

    const responseLogin = responseLoginData.data;
    const expires = new Date(responseLogin.accessTokenExpiresAt);
    const bearer = responseLogin.accessToken;

    try {
      const responseEmtor = await axios.post(
        meUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        }
      );

      const emtorUserData = responseEmtor.data.data;
      const documentTypeId = emtorUserData.document_type_id;
      const documentNumber = emtorUserData.document;

      // Traducir tipo de documento
      const mappedDocumentType = getDocumentType(documentTypeId) ?? documentTypeId;

      let segmentId = 1; // Default fallback

      try {
        const BACO = getBacoConfig();
        const segmentUrl = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.SEGMENT}`;

        const responseBaco = await axios.post(
          segmentUrl,
          { documentType: mappedDocumentType, documentNumber },
          {
            headers: {
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
          }
        );
        segmentId = responseBaco.data.data.segmentId;
      } catch (segmentErr) {
        console.error("Error al obtener segmentId de Baco, aplicando fallback (1):", segmentErr);
      }

      // Marcado GTM para registros exitosos
      if (register && emtorUserData?.email) {
        const emailUser = emtorUserData.email;
        const valueMd5 = (md5 as any)(emailUser);
        const valueSha256 = emailUser + valueMd5;
        const userId = sha256(valueSha256);
        const registerText = source === "Tradicional" ? "Ya tiene cuenta Iniciar sesion" : "Tipo de registro";

        pushToDataLayer({
          event: "ga_event",
          category: "Registro",
          action: `CV - Registro - ${source}`,
          label: registerText,
          "user id": userId,
          Socio: "Logueado",
        });
      }

      // Seguridad: Eliminación de contraseñas de las cargas del cliente
      delete emtorUserData.password;

      const mergedUser = {
        ...emtorUserData,
        ...responseLogin.user,
        segmentId,
      };

      const finalSessionState = {
        authenticated: true,
        error: false,
        user: mergedUser,
        accessToken: responseLogin.accessToken,
        accessTokenExpiresAt: responseLogin.accessTokenExpiresAt,
        refreshToken: responseLogin.refreshToken,
        refreshTokenExpiresAt: responseLogin.refreshTokenExpiresAt,
      };

      // Persistir sesión en cookie
      setCookie(cookiesConfig.SESSION, finalSessionState, {
        expires,
        path: "/",
      });

      setState((prev) => ({
        ...prev,
        authenticated: true,
        loading: false,
        error: null,
        user: mergedUser,
      }));

      pushToDataLayer({
        event: "ga_event",
        category: "Login",
        action: `CV - Login - ${source}`,
        label: "Exitoso",
      });

      if (typeof window !== "undefined") {
        window.open("/", "_self");
      }
    } catch (err: any) {
      console.error("Error al consultar perfil del usuario:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data || err.message || err,
      }));
      throw err;
    }
  };

  // --- Sub-Lógica: Autenticación con Parámetros ---

  const loginWithParams = async (params: URLSearchParams, register = false, source = "Tradicional"): Promise<void> => {
    const EMPTOR = getEmptorConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.LOGIN.BASIC}`;

    try {
      const response = await axios.post(url, params, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: EMPTOR.BASIC_TOKEN,
        },
      });

      await emptorMe(response.data, register, source);
    } catch (err: any) {
      pushToDataLayer({
        event: "ga_event",
        category: "Login",
        action: `CV - Login - ${source}`,
        label: "Fallido",
      });
      throw err;
    }
  };

  // --- Acciones de Autenticación Clásica (Tradicional) ---

  const login = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const params = new URLSearchParams(new FormData(event.currentTarget) as any);

    try {
      await loginWithParams(params, false, "Tradicional");
    } catch (err: any) {
      const errorPayload = err.response?.data || err.message || err;
      setState((prev) => ({
        ...prev,
        authenticated: false,
        loading: false,
        error: errorPayload,
        user: null,
      }));
    }
  };

  const register = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const params = new URLSearchParams(new FormData(event.currentTarget) as any);
    params.set("client_id", process.env.CLIENT_ID || "");
    params.set("terms", String(params.get("terms") !== null));
    params.set("politics", String(params.get("politics") !== null));

    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.REGISTER.BASIC}`;

    try {
      await axios.post(url, params, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: EMPTOR.BASIC_TOKEN,
        },
      });

      // Configura cookie de alerta de bienvenida en home
      setCookie(cookiesConfig.ALERT_HOME, "alerta valida");

      // Inicia sesión de manera inmediata con las credenciales registradas
      await loginWithParams(params, true, "Tradicional");
    } catch (err: any) {
      console.error("Error en registro de cuenta:", err);
      const errorPayload = err.response?.data || err.message || err;

      setState((prev) => ({
        ...prev,
        authenticated: false,
        loading: false,
        error: errorPayload,
        user: null,
      }));

      pushToDataLayer({
        event: "ga_event",
        category: "Registro",
        action: "CV - Registro - Tradicional",
        label: "Tipo de registro",
        Socio: "No logueado",
      });
    }
  };

  const logout = async (event?: React.MouseEvent): Promise<void> => {
    if (event) {
      event.preventDefault();
    }

    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.LOGOUT.BASIC}`;

    const sessionData = getCookie(cookiesConfig.SESSION) as any;
    const accessToken = sessionData?.accessToken;

    try {
      if (accessToken) {
        await axios.post(
          url,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (err) {
      console.error("Error al notificar cierre de sesión al servidor:", err);
    } finally {
      // Remover cookie y resetear estado
      removeCookie(cookiesConfig.SESSION);
      setState((prev) => ({
        ...prev,
        authenticated: false,
        user: null,
        error: null,
      }));

      if (typeof window !== "undefined") {
        window.open("/", "_self");
      }
    }
  };

  // --- Acciones de Autenticación Social (Facebook / Google) ---

  const socialLogin = async (params: URLSearchParams, url: string, source: string, register = false): Promise<void> => {
    const EMPTOR = getEmptorConfig();

    try {
      const response = await axios.post(url, params, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: EMPTOR.BASIC_TOKEN,
        },
      });

      // Rellena credenciales temporales del login social para emptorMe
      response.data.data.accessToken = params.get("code");
      response.data.data.accessTokenExpiresAt = params.get("codeExpiresAt");
      response.data.data.socialnetwork = params.get("socialnetwork");

      await emptorMe(response.data, register, source);
    } catch (err) {
      pushToDataLayer({
        event: "ga_event",
        category: "Login",
        action: `CV - Login - ${source}`,
        label: "Fallido",
      });
      throw err;
    }
  };

  const facebookLogin = async (resp: any, register = false): Promise<void> => {
    if (!resp.accessToken) {
      setState((prev) => ({
        ...prev,
        authenticated: false,
        error: "No se pudo iniciar sesión mediante Facebook.",
      }));
      return;
    }

    const EMPTOR = getEmptorConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.LOGIN.FACEBOOK}`;

    const params = new URLSearchParams();
    params.set("code", resp.accessToken);
    params.set("idprofile", resp.id);
    params.set("username", resp.userID);
    params.set("firstname", resp.name);
    params.set("lastname", resp.name);
    params.set("email", resp.email);
    params.set("socialnetwork", "facebook");
    params.set("client_id", process.env.CLIENT_ID || "");
    params.set("codeExpiresAt", String(new Date().getTime() + (resp.data_access_expiration_time || 0)));

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await socialLogin(params, url, "Facebook", register);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        authenticated: false,
        loading: false,
        error: err.response?.data || err.message || err,
      }));
    }
  };

  const googleLogin = async (resp: any, register = false): Promise<void> => {
    const EMPTOR = getEmptorConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.LOGIN.GOOGLE}`;

    const params = new URLSearchParams();
    params.set("code", resp.accessToken);
    params.set("idprofile", resp.googleId);
    params.set("username", resp.googleId);
    params.set("firstname", resp.profileObj ? resp.profileObj.givenName : "");
    params.set("lastname", resp.profileObj ? resp.profileObj.familyName : "");
    params.set("email", resp.profileObj ? resp.profileObj.email : "");
    params.set("socialnetwork", "google");
    params.set("client_id", process.env.CLIENT_ID || "");
    params.set("codeExpiresAt", resp.tokenObj ? resp.tokenObj.expires_at : "");

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await socialLogin(params, url, "Google", register);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        authenticated: false,
        loading: false,
        error: err.response?.data || err.message || err,
      }));
    }
  };

  // --- Acciones de Recuperación de Contraseña (Recovery) ---

  const recoveryPassword = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setState((prev) => ({
      ...prev,
      recovery: { ...prev.recovery, error: null, sended: false },
    }));

    const EMPTOR = getEmptorConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.RECOVERY}`;

    try {
      const response = await axios.post(url, new URLSearchParams(new FormData(event.currentTarget) as any), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.hasOwnProperty("error")) {
        pushToDataLayer({
          event: "ga_event",
          category: "Recuperar Contraseña",
          action: "CV - Recuperar Contraseña",
          label: "Fallido",
        });
        setState((prev) => ({
          ...prev,
          recovery: {
            ...prev.recovery,
            sended: false,
            error: response.data.error,
            message: "",
          },
        }));
      } else {
        pushToDataLayer({
          event: "ga_event",
          category: "Recuperar Contraseña",
          action: "CV - Recuperar Contraseña",
          label: "Exitoso",
        });
        setState((prev) => ({
          ...prev,
          recovery: {
            ...prev.recovery,
            sended: true,
            error: null,
            message: response.data.message || "Solicitud de recuperación enviada.",
          },
        }));
      }
    } catch (err: any) {
      pushToDataLayer({
        event: "ga_event",
        category: "Recuperar Contraseña",
        action: "CV - Recuperar Contraseña",
        label: "Fallido",
      });
      setState((prev) => ({
        ...prev,
        recovery: {
          ...prev.recovery,
          sended: false,
          error: err.response?.data || err.message || err,
        },
      }));
    }
  };

  const recoveryPasswordEmptor = async (
    user_hash: string,
    passwordVal: string,
    newPasswordVal: string
  ): Promise<void> => {
    const EMPTOR = getEmptorConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.RECOVERY_PASS}`;

    setState((prev) => ({
      ...prev,
      recovery: { ...prev.recovery, emptorSended: false, emptorError: null },
    }));

    try {
      await axios.post(
        url,
        `new_password=${passwordVal}&confirm_password=${newPasswordVal}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${user_hash}`,
          },
        }
      );

      setState((prev) => ({
        ...prev,
        recovery: {
          ...prev.recovery,
          emptorSended: true,
          emptorError: null,
        },
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        recovery: {
          ...prev.recovery,
          emptorSended: false,
          emptorError: err.response?.data || err.message || err,
        },
      }));
    }
  };

  const clearResponseEmptor = (): void => {
    setState((prev) => ({
      ...prev,
      recovery: {
        ...prev.recovery,
        emptorSended: false,
        emptorError: null,
      },
    }));
  };

  const recoveryRestart = (): void => {
    setState((prev) => ({
      ...prev,
      recovery: {
        sended: false,
        error: null,
        message: "",
        emptorSended: false,
        emptorError: null,
      },
    }));
  };

  // --- Sub-Lógica: Flujo de Actualización del Perfil (User Zone) ---

  const updateUser = async (data: UpdateUserPayload): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.USER_ZONE?.UPDATE_USER}`;

    const cachedSession = getCookie(cookiesConfig.SESSION);
    const session = typeof cachedSession === "string" ? JSON.parse(cachedSession) : cachedSession;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      const errorMsg = "Sesión no válida o expirada.";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }

    // GTM: Evaluación de campos modificados
    if (state.user) {
      let modifiedFields = "";
      if (state.user.first_name !== data.first_name) modifiedFields += " Nombre, ";
      if (state.user.last_name !== data.last_name) modifiedFields += " Apellido, ";
      if (state.user.document_type_id !== Number(data.document_type_id)) modifiedFields += " Tipo Documento, ";
      if (state.user.document !== data.document) modifiedFields += " Documento, ";

      if (modifiedFields) {
        gtmsaveUserZone(modifiedFields);
      }
    }

    const params = new URLSearchParams();
    params.set("first_name", data.first_name);
    params.set("last_name", data.last_name);
    params.set("document_type_id", String(data.document_type_id));
    params.set("document", data.document);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.mensajeError || `Error al actualizar perfil: ${response.status}`);
      }

      // Solicitud secundaria a BACO para actualizar el segmento del usuario
      let segmentId = 1;
      try {
        const BACO = getBacoConfig();
        const segmentUrl = `${BACO.BASE_DOMAIN}${BACO.BENEFITS.SEGMENT}`;
        const mappedDocumentType = getDocumentType(Number(data.document_type_id)) ?? Number(data.document_type_id);

        const responseBaco = await fetch(segmentUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            documentType: mappedDocumentType,
            documentNumber: data.document,
          }),
        });

        if (responseBaco.ok) {
          const bacoData = await responseBaco.json();
          segmentId = bacoData.data?.segmentId ?? 1;
        }
      } catch (segmentErr) {
        console.error("Error al consultar segmento en BACO:", segmentErr);
      }

      const updatedUser = {
        ...state.user,
        first_name: data.first_name,
        last_name: data.last_name,
        document_type_id: Number(data.document_type_id),
        document: data.document,
        segmentId,
      };

      const updatedSession = {
        ...session,
        user: updatedUser,
      };

      setCookie(cookiesConfig.SESSION, updatedSession, {
        expires: new Date(session.refreshTokenExpiresAt),
        path: "/",
      });

      setState((prev) => ({
        ...prev,
        loading: false,
        user: updatedUser,
        error: null,
      }));
    } catch (err: any) {
      console.error("Error en updateUser:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || err,
      }));
      throw err;
    }
  };

  const changeEmail = async (newEmail: string): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.USER_ZONE?.CHANGE_EMAIL}`;

    const cachedSession = getCookie(cookiesConfig.SESSION);
    const session = typeof cachedSession === "string" ? JSON.parse(cachedSession) : cachedSession;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      const errorMsg = "Sesión no válida o expirada.";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }

    const params = new URLSearchParams();
    params.set("email", newEmail);
    params.set("email_repeat", newEmail);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.mensajeError || `Error al cambiar correo: ${response.status}`);
      }

      const updatedUser = {
        ...state.user,
        email: newEmail,
      };

      const updatedSession = {
        ...session,
        user: updatedUser,
      };

      setCookie(cookiesConfig.SESSION, updatedSession, {
        expires: new Date(session.refreshTokenExpiresAt),
        path: "/",
      });

      setState((prev) => ({
        ...prev,
        loading: false,
        user: updatedUser,
        error: null,
      }));
    } catch (err: any) {
      console.error("Error en changeEmail:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || err,
      }));
      throw err;
    }
  };

  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const EMPTOR = getEmptorConfig();
    const cookiesConfig = getCookiesConfig();
    const url = `${EMPTOR.BASE_DOMAIN}${EMPTOR.USER_ZONE?.CHANGE_PASSWORD}`;

    const cachedSession = getCookie(cookiesConfig.SESSION);
    const session = typeof cachedSession === "string" ? JSON.parse(cachedSession) : cachedSession;
    const accessToken = session?.accessToken;

    if (!accessToken) {
      const errorMsg = "Sesión no válida o expirada.";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      throw new Error(errorMsg);
    }

    const params = new URLSearchParams();
    params.set("old_password", data.old_password);
    params.set("new_password", data.new_password);
    params.set("confirm_password", data.new_password);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.mensajeError || `Error al cambiar contraseña: ${response.status}`);
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      console.error("Error en changePassword:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || err,
      }));
      throw err;
    }
  };

  const partnerTheme: PartnerTheme = {
    labelClass: state.user?.segmentId ? (getUserType(state.user.segmentId) || "basico") : "basico",
    logoClass: `logo-${state.user?.segmentId ? (getUserType(state.user.segmentId) || "basico") : "basico"}`,
  };

  const contextValue: AuthContextValue = {
    state,
    partnerTheme,
    login,
    register,
    logout,
    facebookLogin,
    googleLogin,
    recoveryPassword,
    recoveryPasswordEmptor,
    clearResponseEmptor,
    recoveryRestart,
    updateUser,
    changeEmail,
    changePassword,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// --- Hook de Autenticación Personalizado (useAuth) ---

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro del componente AuthProvider");
  }
  return context;
};
