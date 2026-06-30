"use client";

/**
 * @file useContextLogger.ts
 * @description Hook de utilidad para el registro estructurado y diagnóstico de cambios
 * de estado en Contextos React de desarrollo.
 */

interface ActionPayload {
  readonly type: string;
  readonly payload?: any;
}

/**
 * Registra de forma agrupada en consola la transición de estado de un Contexto React.
 * Ignora la ejecución si el entorno es de producción (NODE_ENV === 'production').
 * 
 * @param contextName - Nombre del contexto que ejecuta la mutación.
 * @param prevState - Estado previo antes del cambio.
 * @param action - Objeto con el tipo de acción y opcionalmente el payload.
 * @param newState - Estado final resultante de la mutación.
 * @param startTime - Marca de tiempo performance.now() previa a la transición de estado.
 */
export function useContextLogger(
  contextName: string,
  prevState: any,
  action: ActionPayload,
  newState: any,
  startTime: number
): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const duration = performance.now() - startTime;

  const title = `%cContext: ${contextName} %caction: ${action.type}`;
  console.groupCollapsed(
    title,
    "color: #888; font-weight: normal;",
    "color: #0070f3; font-weight: bold;"
  );

  console.debug("%cprevState", "color: #9E9E9E; font-weight: bold;", prevState);
  console.debug("%caction", "color: #03A9F4; font-weight: bold;", action);
  console.debug("%cduration", "color: #4CAF50; font-weight: bold;", `${duration.toFixed(2)} ms`);
  console.debug("%cnewState", "color: #4CAF50; font-weight: bold;", newState);

  console.groupEnd();
}
