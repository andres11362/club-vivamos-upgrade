/**
 * Estructura para textos que combinan partes destacadas (en negrita) y texto regular.
 * Todas las propiedades son de solo lectura (`readonly`).
 */
export interface HighlightedText {
  readonly strong: string;
  readonly rest: string;
}

/**
 * Mensajes informativos de beneficios.
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface MessagesBen {
  readonly invitation: HighlightedText;
  readonly enroll: HighlightedText;
}

/**
 * Mensajes de advertencia o aclaración para los formularios de registro/invitación.
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface MessagesForm {
  readonly invitation: ReadonlyArray<string>;
  readonly enroll: ReadonlyArray<string>;
}

/**
 * Mensajes de beneficios configurados de forma inmutable.
 * Utiliza `as const` para garantizar la inmutabilidad en tiempo de compilación y de ejecución.
 */
export const messagesBen: MessagesBen = {
  invitation: {
    strong: 'Invita a familiares o amigos',
    rest: ' para que sean tus beneficiarios y comiencen a ahorrar en grande.',
  },
  enroll: {
    strong: 'Diligencia el siguiente formulario',
    rest: ' para finalizar tu proceso de inscripción y activar descuentos de hasta el 50% en aproximadamente más de 120 marcas aliadas',
  },
} as const;

/**
 * Mensajes y aclaraciones legales para los formularios configurados de forma inmutable.
 * Utiliza `as const` para asegurar que el array y sus contenidos no puedan ser mutados.
 */
export const messagesForm: MessagesForm = {
  invitation: [
    '*Solamente se podrán vincular como beneficiarios personas naturales mayores de 18 años de edad.',
    '*Declaro que cuento con la autorización previa y expresa de mi Beneficiario para ingresar sus datos en el presente formulario para ser contactado por el Club Vivamos EL TIEMPO.',
  ],
  enroll: [
    '*La edad mínima para registrarte en este formulario es de 18 años, si eres menor de edad, NO te puedes registrar.',
  ],
} as const;
