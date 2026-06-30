/**
 * Opciones para la sustitución de variables de entorno.
 * Todas las propiedades son de solo lectura (`readonly`).
 */
export interface EnvReplacementOptions {
  /** Variables a buscar y reemplazar (por defecto busca {CLIENT_ID} usando el valor de process.env.CLIENT_ID). */
  readonly variables?: Record<string, string | undefined>;
  /** El objeto de entorno a actualizar (por defecto `process.env`). */
  readonly envObject?: Record<string, string | undefined>;
}

/**
 * Sustituye marcadores de posición (por ejemplo, `{CLIENT_ID}`) en una cadena de texto.
 * Es una función pura e inmutable.
 * 
 * @param value - La cadena original con marcadores.
 * @param variables - Mapa de claves y valores para la sustitución.
 * @returns La cadena procesada con las sustituciones aplicadas.
 */
export const replacePlaceholders = (
  value: string,
  variables: Record<string, string | undefined>
): string => {
  let result = value;
  for (const [key, val] of Object.entries(variables)) {
    if (val === undefined) continue;
    const placeholder = `{${key}}`;
    result = result.split(placeholder).join(val);
  }
  return result;
};

/**
 * Procesa y reemplaza marcadores en el objeto de entorno de forma segura.
 * 
 * Cumple con SOLID:
 * 1. **SRP (Responsabilidad Única)**: Separa la lógica pura de reemplazo de texto (`replacePlaceholders`)
 *    del efecto secundario de modificar variables globales.
 * 2. **Seguridad frente al original**: En lugar de serializar y deserializar todo el objeto `process.env`
 *    usando `JSON.stringify` (lo cual es muy inestable en Node.js, puede romper descriptores de propiedad,
 *    borrar getters dinámicos de entorno o fallar ante valores especiales), este método recorre
 *    de manera segura llave por llave del entorno y actualiza solo las variables de tipo texto.
 * 3. **OCP (Abierto/Cerrado)**: Abierto a extenderse con nuevas variables de sustitución a través del
 *    parámetro opcional `options.variables` sin tocar el cuerpo de la función.
 * 
 * @param options - Configuración de variables y objeto de destino.
 */
export const replaceProcessEnv = (options: EnvReplacementOptions = {}): void => {
  const envObject = options.envObject ?? process.env;
  
  const variables = options.variables ?? {
    CLIENT_ID: process.env.CLIENT_ID,
  };

  for (const key of Object.keys(envObject)) {
    const value = envObject[key];
    if (typeof value === "string") {
      const replacedValue = replacePlaceholders(value, variables);
      if (replacedValue !== value) {
        envObject[key] = replacedValue;
      }
    }
  }
};

// Exportación por defecto para mantener compatibilidad total con la importación original
export default replaceProcessEnv;
