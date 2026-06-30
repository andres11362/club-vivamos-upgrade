import { 
  isValidEmail, 
  isValidTelephone, 
  isAlphanumericDNI, 
  isNumericalDNI, 
  isValidAlphabet, 
  isValidPassword 
} from "./regex";
import { parseSlashDate } from "./castDates";

/**
 * Mapeo inmutable de los límites máximos de caracteres por tipo de documento.
 */
export const DOCUMENT_MAX_LENGTHS: Record<string, number> = {
  "0": 10,
  "1": 10,
  "2": 6,
  "3": 6,
  "4": 10,
  "5": 15,
  "6": 15,
  "7": 15,
  "8": 11,
} as const;

/**
 * Obtiene la longitud máxima permitida para un tipo de documento.
 * 
 * @param id - Identificador del tipo de documento.
 */
export const getDocumentMaxLength = (id: string): number => {
  return DOCUMENT_MAX_LENGTHS[id] ?? 0;
};

/**
 * Verifica si un valor es nulo, indefinido o una cadena vacía.
 */
export const validateEmpty = (val: unknown): val is null | undefined | "" => {
  return val === undefined || val === null || val === "";
};

/**
 * Valida una dirección de correo electrónico.
 * 
 * @param email - Correo a validar.
 * @returns Mensaje de error, o cadena vacía si es válido.
 */
export const validateEmail = (email: string | undefined | null): string => {
  if (validateEmpty(email)) {
    return "El email es obligatorio";
  }
  return isValidEmail(email) ? "" : "Ingresa un email valido";
};

/**
 * Valida un número telefónico.
 * 
 * @param phone - Teléfono a validar.
 * @returns Mensaje de error, o cadena vacía si es válido.
 */
export const validateTelephone = (phone: string | undefined | null): string => {
  if (validateEmpty(phone)) {
    return "El télefono es obligatorio";
  }
  return isValidTelephone(phone) ? "" : "Ingresa un télefono valido";
};

/**
 * Valida un número de documento según su tipo.
 * 
 * @param document - Número de documento.
 * @param type - Tipo de documento.
 */
export const validateDocument = (
  document: string | undefined | null,
  type: string | number | undefined | null
): string => {
  if (validateEmpty(document)) {
    return "El documento es obligatorio";
  }

  const typeStr = type !== undefined && type !== null ? String(type) : "";
  const isValid = typeStr === "3" || typeStr === "5"
    ? isAlphanumericDNI(document)
    : isNumericalDNI(document);

  return isValid ? "" : "Ingresa un documento valido";
};

/**
 * Valida la longitud de un documento.
 * 
 * @param document - Número de documento.
 * @param id - Identificador del tipo de documento.
 */
export const validateLengthDocument = (
  document: string | undefined | null,
  id: string | number | undefined | null
): string => {
  const docStr = document ?? "";
  const typeStr = id !== undefined && id !== null ? String(id) : "";
  const maxLength = getDocumentMaxLength(typeStr);

  if (docStr.length < 3 || docStr.length > maxLength) {
    return `La longitud del documento es de 3 a ${maxLength} caracteres`;
  }
  return "";
};

/**
 * Valida que una cadena contenga solo caracteres alfabéticos válidos y tenga longitud correcta.
 */
export const validateString = (str: string | undefined | null, field: string): string => {
  if (validateEmpty(str)) {
    return `Los ${field} son obligatorios`;
  }
  if (!isValidAlphabet(str)) {
    return "Existen caracteres especiales";
  }
  if (str.length < 2) {
    return `El campo ${field} debe tener mas de 1 caracter`;
  }
  return "";
};

/**
 * Calcula si una persona es mayor de edad a partir de su fecha de nacimiento en formato DD/MM/YYYY.
 */
export const calcularEdad = (date: string | undefined | null): boolean => {
  if (!date) return false;
  try {
    const { day, month, year } = parseSlashDate(date);
    const numDay = Number(day);
    const numMonth = Number(month);
    const numYear = Number(year);

    const birthday = new Date(numYear, numMonth - 1, numDay);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    if (currentMonth < (numMonth - 1) || (currentMonth === (numMonth - 1) && currentDay < numDay)) {
      age--;
    }
    return age >= 18;
  } catch {
    return false;
  }
};

/**
 * Valida la fecha de nacimiento (debe ser mayor de edad).
 */
export const validateDate = (date: string | undefined | null): string => {
  if (validateEmpty(date)) {
    return "La fecha es obligatoria";
  }
  return calcularEdad(date) ? "" : "Debe ser mayor de edad para obtener el beneficio";
};

/**
 * Valida la selección de un dropdown.
 */
export const validateSelect = (str: unknown): string => {
  return validateEmpty(str) ? "Selecciona una opción" : "";
};

/**
 * Estructura de retorno para la validación de contraseñas.
 */
export interface PasswordValidationResult {
  readonly error: boolean;
  readonly message: string;
}

/**
 * Valida la seguridad y presencia de una contraseña.
 */
export const validatePassword = (str: string | undefined | null): PasswordValidationResult => {
  if (validateEmpty(str)) {
    return {
      error: true,
      message: "La contraseña es obligatoria",
    };
  }
  if (!isValidPassword(str)) {
    return {
      error: true,
      message: "La contraseña no cumple los requerimientos",
    };
  }
  return {
    error: false,
    message: "",
  };
};

/**
 * Estructura de los campos del formulario de invitación / enrolamiento.
 */
export interface InvitationFormFields {
  readonly nombres?: string;
  readonly apellidos?: string;
  readonly tipo_documento?: string | number;
  readonly documento?: string;
  readonly email?: string;
  readonly telefono?: string;
  readonly fecha_nacimiento?: string;
}

/**
 * Estructura de errores retornada por las validaciones de formulario.
 */
export interface FormErrors {
  nombres?: string;
  apellidos?: string;
  tipo_documento?: string;
  longitud_documento?: string;
  documento?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  celular?: string;
}

/**
 * Valida el formulario de invitación o enrolamiento.
 * 
 * Corrección de Bug: Se agregó `isAditionalFields` como parámetro en la firma
 * para evitar el ReferenceError presente en el archivo original de JS.
 */
export const validateInvitationForm = (
  fields: InvitationFormFields,
  isAditionalFields = false
): FormErrors | null => {
  const {
    nombres,
    apellidos,
    tipo_documento,
    documento,
    email,
    telefono,
    fecha_nacimiento,
  } = fields;

  let errors: FormErrors | null = isAditionalFields ? {} : null;

  const valFN = validateString(nombres, "Nombres");
  const valLN = validateString(apellidos, "Apellidos");
  const valDC = validateDocument(documento, tipo_documento);
  const valLD = valDC === "" ? validateLengthDocument(documento, tipo_documento) : "";
  const valEM = validateEmail(email);
  const valID = validateSelect(tipo_documento);

  if (valFN !== "" || valLN !== "" || valLD !== "" || valDC !== "" || valEM !== "" || valID !== "") {
    errors = {
      nombres: valFN,
      apellidos: valLN,
      tipo_documento: valID,
      longitud_documento: valLD,
      documento: valDC,
      email: valEM,
    };
  }

  if (isAditionalFields) {
    const valTP = validateTelephone(telefono);
    const valBD = validateDate(fecha_nacimiento);
    if (valTP !== "" || valBD !== "") {
      const currentErrors = errors ?? {};
      errors = {
        ...currentErrors,
        telefono: valTP,
        fecha_nacimiento: valBD,
      };
    }
  }

  return errors;
};

/**
 * Estructura de los campos del formulario "Conoce al Club" (KnowClub).
 */
export interface KnowClubFormFields {
  readonly nombres?: string;
  readonly apellidos?: string;
  readonly tipo_documento?: string | number;
  readonly documento?: string;
  readonly email?: string;
  readonly celular?: string;
}

/**
 * Valida el formulario "Conoce al Club".
 */
export const validateKnowClubForm = (
  fields: KnowClubFormFields,
  isAditionalFields = false
): FormErrors | null => {
  const { nombres, apellidos, tipo_documento, documento, email, celular } = fields;
  let errors: FormErrors | null = isAditionalFields ? {} : null;

  const valFN = validateString(nombres, "nombres");
  const valLN = validateString(apellidos, "apellidos");
  const valID = validateSelect(tipo_documento);
  const valDC = validateDocument(documento, tipo_documento);
  const valLD = valDC === "" ? validateLengthDocument(documento, tipo_documento) : "";
  const valEM = validateEmail(email);
  const valTP = validateTelephone(celular);

  if (valFN !== "" || valLN !== "" || valID !== "" || valDC !== "" || valLD !== "" || valEM !== "" || valTP !== "") {
    errors = {
      nombres: valFN,
      apellidos: valLN,
      tipo_documento: valID,
      longitud_documento: valLD,
      documento: valDC,
      email: valEM,
      celular: valTP,
    };
  }

  return errors;
};

/**
 * Punto de entrada para validar formularios según su tipo.
 * 
 * Corrección de Bug: Se agregó la sentencia `break;` faltante en el caso 'enroll'
 * para evitar el comportamiento de fallthrough hacia 'knowclub' que sobrescribía los errores.
 */
export const validateFields = (
  fields: InvitationFormFields | KnowClubFormFields,
  type: string
): FormErrors | PasswordValidationResult | null => {
  let validator: FormErrors | PasswordValidationResult | null = {};

  switch (type) {
    case "invitation":
      validator = validateInvitationForm(fields as InvitationFormFields);
      break;
    case "enroll":
      validator = validateInvitationForm(fields as InvitationFormFields, true);
      break; // BUG FIX: Faltaba break en JS original, causando fallthrough a 'knowclub'
    case "knowclub":
      validator = validateKnowClubForm(fields as KnowClubFormFields);
      break;
    default:
      break;
  }

  return validator;
};
