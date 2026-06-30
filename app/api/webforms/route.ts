import { NextRequest, NextResponse } from "next/server";

/**
 * @file route.ts
 * @description Route Handler de Next.js para enviar de forma segura formularios (Webforms)
 * a Drupal sin exponer credenciales ni endpoints internos en el cliente.
 */

export interface WebFormPayload {
  readonly webform_id: string;
  readonly body: Record<string, any>;
}

export interface WebFormResponse {
  readonly success: boolean;
  readonly data?: any;
  readonly error?: string;
}

interface NewsletterConfig {
  readonly BASE_DOMAIN: string;
  readonly TOKEN_URL: string;
}

/**
 * Helper interno para parsear de forma segura la configuración de SUSCRIPTION_NEWSLETTER
 */
const getNewsletterConfig = (): NewsletterConfig => {
  const envVal = process.env.SUSCRIPTION_NEWSLETTER;
  if (!envVal) {
    throw new Error("La variable de entorno SUSCRIPTION_NEWSLETTER no está definida.");
  }
  try {
    return JSON.parse(envVal) as NewsletterConfig;
  } catch (err) {
    throw new Error("El formato de SUSCRIPTION_NEWSLETTER en las variables de entorno es inválido.");
  }
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as WebFormPayload;

    if (!payload || !payload.webform_id || !payload.body) {
      return NextResponse.json(
        { success: false, error: "Faltan parámetros requeridos: webform_id y body son obligatorios." },
        { status: 400 }
      );
    }

    const { webform_id, body } = payload;
    const config = getNewsletterConfig();

    // Paso A: Obtener el token de sesión (CSRF Token)
    const tokenResponse = await fetch(config.TOKEN_URL, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { success: false, error: `Error al obtener el CSRF token de Drupal: ${tokenResponse.status}` },
        { status: 502 }
      );
    }

    const csrfToken = await tokenResponse.text();
    if (!csrfToken) {
      return NextResponse.json(
        { success: false, error: "El token de Drupal recibido está vacío." },
        { status: 502 }
      );
    }

    // Paso B: Enviar los datos del formulario (POST) incluyendo la cabecera X-CSRF-Token
    const submitPayload = { webform_id, ...body };
    const submitResponse = await fetch(config.BASE_DOMAIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(submitPayload),
      cache: "no-store",
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `Error al enviar formulario: ${submitResponse.status}. Detalle: ${errorText}` 
        },
        { status: submitResponse.status }
      );
    }

    const responseData = await submitResponse.json();
    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GTM: Error en Route Handler webforms:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
