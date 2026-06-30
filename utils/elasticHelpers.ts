/**
 * Tipos de valores aceptables para los términos de una búsqueda en Elasticsearch.
 */
export type QueryValue = string | number | boolean;

/**
 * Estructura de la sección 'terms' de Elasticsearch que mapea un campo dinámico
 * con sus valores de búsqueda y opcionalmente añade relevancia (boost).
 */
export interface TermsQueryDetail {
  readonly [field: string]: ReadonlyArray<QueryValue> | number;
}

/**
 * Representa la consulta interna de términos.
 */
export interface TermsQueryBlock {
  readonly terms: TermsQueryDetail & {
    readonly boost: number;
  };
}

/**
 * Contrato inmutable que define la estructura de una consulta de Elasticsearch (ElasticQuery).
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface ElasticQuery {
  readonly query: TermsQueryBlock;
  readonly _source: boolean;
  readonly fields?: ReadonlyArray<string>;
}

/**
 * Helper para generar consultas de términos en Elasticsearch.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Su única función es construir la estructura base de una consulta 'terms'.
 * 2. **DIP (Inversión de Dependencias)**: Depende del contrato e interfaces definidos (`ElasticQuery`, `QueryValue`).
 * 
 * Inmutabilidad:
 * - El array de valores de entrada y el objeto retornado son de solo lectura (`ReadonlyArray`, `readonly`).
 * 
 * @param field - Campo sobre el que realizar la consulta.
 * @param values - Valor o valores para el término.
 * @param boost - Peso de relevancia opcional para los términos (por defecto 1.0).
 * @returns Un objeto inmutable `ElasticQuery` con la consulta estructurada.
 * @throws Error si el nombre del campo es inválido o está vacío.
 */
export const buildTermsQuery = (
  field: string,
  values: QueryValue | ReadonlyArray<QueryValue>,
  boost: number = 1.0
): ElasticQuery => {
  if (!field || field.trim() === '') {
    throw new Error('El nombre del campo (field) no puede estar vacío.');
  }

  const valuesArray: ReadonlyArray<QueryValue> = Array.isArray(values)
    ? Object.freeze([...values])
    : Object.freeze([values]);

  const termsDetail: TermsQueryDetail = {
    [field]: valuesArray,
  };

  return {
    query: {
      terms: {
        ...termsDetail,
        boost,
      },
    },
    _source: true,
  };
};

/**
 * Agrega campos específicos a recuperar en la consulta base de Elasticsearch y desactiva el `_source`.
 * 
 * Cumple con inmutabilidad al crear un nuevo objeto y clonar el array de campos,
 * evitando cualquier mutación sobre el objeto de consulta original.
 * 
 * @param query - La consulta base inmutable.
 * @param fields - Lista inmutable de campos específicos a recuperar.
 * @returns Una nueva consulta estructurada con los campos añadidos y `_source` desactivado.
 */
export const addFieldsToQuery = (
  query: ElasticQuery,
  fields: ReadonlyArray<string>
): ElasticQuery => {
  return {
    ...query,
    fields: Object.freeze([...fields]),
    _source: false,
  };
};
