/**
 * Colección inmutable de expresiones regulares utilizadas para validación de campos.
 * Sigue el principio de inmutabilidad al congelar el objeto y sus propiedades.
 */
export const REGEX_PATTERNS = {
  /** Valida si un DNI contiene únicamente dígitos numéricos. */
  numericalDNI: /^[0-9]*$/,
  /** Valida si un DNI comienza con caracteres alfanuméricos. */
  alphanumericDNI: /^[a-zA-Z0-9]/,
  /** Valida si la cadena contiene solo letras (incluyendo acentos latinos) y espacios. */
  alphabet: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
  /** Valida el formato estándar de una dirección de correo electrónico. */
  emailAddress: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
  /** Valida contraseñas con mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número. */
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  /** Valida teléfonos celulares colombianos que comiencen por 3 y tengan 10 dígitos. */
  telephone: /^3\d{9}$/,
} as const;

/**
 * Firma común para las funciones validadoras de texto.
 * Sigue el principio de segregación de interfaces (ISP).
 */
export interface StringValidator {
  (value: string): boolean;
}

/**
 * Valida si un valor contiene únicamente dígitos numéricos.
 */
export const isNumericalDNI: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.numericalDNI.test(value);

/**
 * Valida si un valor comienza con caracteres alfanuméricos.
 */
export const isAlphanumericDNI: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.alphanumericDNI.test(value);

/**
 * Valida si un valor contiene únicamente letras y espacios (soporta acentos y eñes).
 */
export const isValidAlphabet: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.alphabet.test(value);

/**
 * Valida si un valor corresponde a un formato de correo electrónico estándar.
 */
export const isValidEmail: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.emailAddress.test(value);

/**
 * Valida si un valor cumple con los requisitos de seguridad de contraseña.
 */
export const isValidPassword: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.password.test(value);

/**
 * Valida si un valor corresponde a un número telefónico de celular colombiano válido (10 dígitos comenzando por 3).
 */
export const isValidTelephone: StringValidator = (value: string): boolean => 
  REGEX_PATTERNS.telephone.test(value);

// --- Getters originales para mantener compatibilidad hacia atrás ---

export const numericalDNI = (): RegExp => REGEX_PATTERNS.numericalDNI;
export const alphanumericDNI = (): RegExp => REGEX_PATTERNS.alphanumericDNI;
export const alphabetRegex = (): RegExp => REGEX_PATTERNS.alphabet;
export const emailAddress = (): RegExp => REGEX_PATTERNS.emailAddress;
export const password = (): RegExp => REGEX_PATTERNS.password;
export const telephone = (): RegExp => REGEX_PATTERNS.telephone;
