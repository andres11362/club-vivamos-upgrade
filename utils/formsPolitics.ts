/**
 * Interfaz que define las políticas del club.
 * Todas las propiedades son de solo lectura (`readonly`) para garantizar la inmutabilidad de los datos.
 */
export interface ClubPolitics {
  readonly terminos: string;
  readonly politicas: string | null;
}

/**
 * Políticas del club inmutables.
 * 
 * Cumple con SOLID e inmutabilidad:
 * - **Inmutabilidad**: Usa la aserción `as const` de TypeScript, lo que bloquea cualquier modificación
 *   de las propiedades del objeto tanto en compilación como en ejecución.
 * - **SRP (Single Responsibility Principle)**: Mantiene la definición y valor inalterable de los textos
 *   legales y políticas aislados de la lógica de renderizado o manipulación de formularios.
 */
export const KnowClubPolitics: ClubPolitics = {
  terminos: 'Autorizo el tratamiento de mis datos personales conforme con las políticas de privacidad (<a href="https://www.eltiempo.com/legal/POLITICA_DE_TRATAMIENTO_Y_PROCEDIMIENTOS_EN_MATERIA_DE_PROTECCION_DE_DATOS_PERSONALES.pdf" target="_blank">link</a>) y datos de Navegación/cookies (<a href="https://www.eltiempo.com/politica-de-cookies" target="_blank">link</a>) de EL TIEMPO, las cuales he leído y entendido.',
  politicas: null,
} as const;
