/**
 * Representa las partes individuales de una fecha.
 * Todas las propiedades son de solo lectura (`readonly`) para garantizar la inmutabilidad.
 */
export interface DateParts {
  readonly day: string;
  readonly month: string;
  readonly year: string;
}

/**
 * Interfaz/Abstracción para el parseo de un string de fecha en sus componentes.
 * Sigue el principio de segregación de interfaces (ISP) y de inversión de dependencia (DIP).
 */
export interface DateParser {
  (dateString: string): DateParts;
}

/**
 * Interfaz/Abstracción para el formateo de los componentes de fecha a un string.
 * Sigue el principio de segregación de interfaces (ISP) y de inversión de dependencia (DIP).
 */
export interface DateFormatter {
  (parts: DateParts): string;
}

/**
 * Parseador por defecto para fechas con formato "DD/MM/YYYY" (separadas por barras).
 * Sigue el Principio de Responsabilidad Única (SRP) enfocándose únicamente en validar
 * y extraer las partes de la fecha en este formato específico.
 * 
 * @param dateString - Fecha en formato "DD/MM/YYYY" (ej: "9/5/2026").
 * @returns Un objeto inmutable con el día, mes y año.
 * @throws Error si el formato de entrada no es válido o no cumple con las reglas de fecha básicas.
 */
export const parseSlashDate: DateParser = (dateString: string): DateParts => {
  if (!dateString || typeof dateString !== 'string') {
    throw new TypeError('La fecha proporcionada debe ser una cadena de texto no vacía.');
  }

  const parts = dateString.split('/');
  if (parts.length !== 3) {
    throw new Error(`El formato de la fecha '${dateString}' es inválido. Se esperaba 'DD/MM/YYYY'.`);
  }

  const [day, month, year] = parts;

  // Validación básica de contenido vacío
  if (!day.trim() || !month.trim() || !year.trim()) {
    throw new Error(`La fecha '${dateString}' contiene partes vacías o inválidas.`);
  }

  const trimmedDay = day.trim();
  const trimmedMonth = month.trim();
  const trimmedYear = year.trim();

  // Validación numérica y de rangos lógicos básicos (SRP de validación)
  const numDay = Number(trimmedDay);
  const numMonth = Number(trimmedMonth);
  const numYear = Number(trimmedYear);

  if (Number.isNaN(numDay) || Number.isNaN(numMonth) || Number.isNaN(numYear)) {
    throw new Error(`La fecha '${dateString}' contiene caracteres no numéricos.`);
  }

  if (numMonth < 1 || numMonth > 12) {
    throw new Error(`El mes '${trimmedMonth}' no es válido (debe estar entre 1 y 12).`);
  }

  if (numDay < 1 || numDay > 31) {
    throw new Error(`El día '${trimmedDay}' no es válido (debe estar entre 1 y 31).`);
  }

  return {
    day: trimmedDay,
    month: trimmedMonth,
    year: trimmedYear,
  };
};

/**
 * Formateador por defecto para convertir `DateParts` al formato estandarizado "YYYY-MM-DD" (Baco).
 * Sigue el Principio de Responsabilidad Única (SRP) enfocándose únicamente en dar formato.
 * 
 * @param parts - Componentes de la fecha a formatear.
 * @returns La fecha formateada en formato "YYYY-MM-DD".
 */
export const formatToBaco: DateFormatter = (parts: DateParts): string => {
  const paddedMonth = parts.month.padStart(2, '0');
  const paddedDay = parts.day.padStart(2, '0');
  
  return `${parts.year}-${paddedMonth}-${paddedDay}`;
};

/**
 * Cambia el formato de una fecha (por defecto de "DD/MM/YYYY" a "YYYY-MM-DD").
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Delega el parseo y formateo a funciones especializadas.
 * 2. **OCP (Abierto/Cerrado)**: Está abierto a soportar nuevos formatos de entrada o salida
 *    inyectando diferentes parseadores o formateadores, sin necesidad de modificar esta función.
 * 3. **DIP (Inversión de Dependencias)**: Depende de las abstracciones (interfaces) `DateParser`
 *    y `DateFormatter` en lugar de implementaciones rígidas concretas.
 * 
 * Inmutabilidad:
 * - Los parámetros de entrada son tratados como de solo lectura.
 * - Retorna un valor primitivo nuevo (string) sin alterar estados externos (Función Pura).
 * 
 * @param dateString - Fecha a convertir.
 * @param parser - Implementación del parseador (por defecto `parseSlashDate`).
 * @param formatter - Implementation del formateador (por defecto `formatToBaco`).
 * @returns La fecha convertida y formateada.
 */
export const changeFormatBaco = (
  dateString: string,
  parser: DateParser = parseSlashDate,
  formatter: DateFormatter = formatToBaco
): string => {
  const parts = parser(dateString);
  return formatter(parts);
};
