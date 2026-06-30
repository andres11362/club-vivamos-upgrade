/**
 * Representa una opción individual para un campo de selección (dropdown/select).
 * Todas las propiedades son de solo lectura (`readonly`) para garantizar la inmutabilidad de los datos.
 */
export interface SelectOption {
  readonly value: string;
  readonly name: string;
}

/**
 * Colección inmutable de opciones de documentos.
 * Utiliza `as const` para asegurar la inmutabilidad en tiempo de compilación y de ejecución.
 */
export const DOCUMENT_OPTIONS_DATA = [
  {
    value: '1',
    name: 'CEDULA',
  },
  {
    value: '3',
    name: 'CEDULA DE EXTRANJERIA',
  },
] as const;

/**
 * Colección inmutable de opciones de género.
 * Utiliza `as const` para asegurar la inmutabilidad en tiempo de compilación y de ejecución.
 */
export const GENRE_OPTIONS_DATA = [
  {
    value: '2',
    name: 'FEMENINO',
  },
  {
    value: '1',
    name: 'MASCULINO',
  },
  {
    value: '0',
    name: 'PREFIERO NO DECIR',
  },
] as const;

/**
 * Retorna la lista inmutable de opciones de documento.
 * 
 * Cumple con inmutabilidad al retornar una colección de solo lectura (`ReadonlyArray`).
 * Mantiene la firma de función del helper original para asegurar la compatibilidad con el resto del proyecto.
 * 
 * @returns Array de solo lectura con las opciones de documento.
 */
export const DocumentOptions = (): ReadonlyArray<SelectOption> => {
  return DOCUMENT_OPTIONS_DATA;
};

/**
 * Retorna la lista inmutable de opciones de género.
 * 
 * Cumple con inmutabilidad al retornar una colección de solo lectura (`ReadonlyArray`).
 * Mantiene la firma de función del helper original para asegurar la compatibilidad con el resto del proyecto.
 * 
 * @returns Array de solo lectura con las opciones de género.
 */
export const GenreOptions = (): ReadonlyArray<SelectOption> => {
  return GENRE_OPTIONS_DATA;
};
