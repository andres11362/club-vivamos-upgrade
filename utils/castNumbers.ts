/**
 * Opciones para la función de validación y conversión de números.
 * Todas las propiedades son inmutables (`readonly`).
 */
export interface CastNumberOptions {
  /** Valor por defecto a retornar en caso de que la conversión o validación falle. */
  readonly fallback?: number;
  /** Base matemática para el parseo numérico (por defecto 10). */
  readonly radix?: number;
}

/**
 * Interfaz para la función de validación de número.
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface NumberValidator {
  (value: unknown): boolean;
}

/**
 * Valida si un valor desconocido puede ser interpretado como un número válido.
 * 
 * SRP: Enfocado únicamente en validar la viabilidad numérica del valor recibido.
 * 
 * @param value - Valor a evaluar.
 * @returns boolean indicando si se puede convertir a un número.
 */
export const isValidNumber: NumberValidator = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  // Si ya es un número, verificar que no sea NaN
  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  // Si es un booleano, símbolo o objeto, no los convertimos directamente
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (trimmed === '') {
    return false;
  }

  // Verificar si parseInt produce un número válido
  const parsed = parseInt(trimmed, 10);
  return !Number.isNaN(parsed);
};

/**
 * Convierte un valor desconocido a un número entero de manera segura y pura.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Delega la comprobación lógica de validez en `isValidNumber`.
 * 2. **OCP (Abierto/Cerrado)**: Permite ajustar la base (`radix`) y el valor de retorno por defecto (`fallback`)
 *    mediante opciones configurables e inmutables sin alterar la función base.
 * 3. **DIP (Inversión de Dependencias)**: Depende de abstracciones en forma de interfaces (`CastNumberOptions`, `NumberValidator`).
 * 
 * Inmutabilidad:
 * - No muta ningún argumento recibido.
 * - Retorna un valor primitivo nuevo (number) de forma pura.
 * 
 * @param value - El valor a convertir.
 * @param options - Configuración de fallback y radix opcional.
 * @returns El número entero parseado o el valor de fallback si no es convertible.
 */
export const validateNumber = (
  value: unknown,
  options: CastNumberOptions = {}
): number => {
  const { fallback = 0, radix = 10 } = options;

  if (!isValidNumber(value)) {
    return fallback;
  }

  const parsed = typeof value === 'number'
    ? Math.trunc(value)
    : parseInt(String(value), radix);

  return Number.isNaN(parsed) ? fallback : parsed;
};
