// Object with the error messages in different languages.
const locales = {
  es: {
    required: 'Este campo es requerido.',
    regex: 'El valor no cumple los requisitos.',
    email: 'El correo electrónico es invalido.',
    number: 'El valor debe ser un número entero.',
    'decimal-number': 'El valor debe ser un número decimal.',
    minLength: 'Mínimo de caracteres',
    maxLength: 'Máximo de caracteres',
    'text-spanish': 'Solo texto, números y (-.,:;¿?¡!).',
    validationFunction: 'El valor no cumple con los requisitos.',
  },
  en: {
    required: 'This field is required.',
    regex: 'Value does not match the requirements.',
    email: 'Invalid email.',
    number: 'Value must be an Integer.',
    'decimal-number': 'Value must be a decimal number.',
    minLength: 'Minimum of characters',
    maxLength: 'Maximum of characters',
    'text-spanish': 'Only text, numbers and (-.,:;¿?¡!).',
    validationFunction: 'Value does not match the requirements.',
  },
};
// setting default locale.
let locale = locales.en;

/**
 * Changes the locale.
 * @param {string} newLocale key of the locales object.
 */
export const setLocale = (newLocale) => {
  locale = locales[newLocale];
};

/**
 * Checks for specific types of validations and returns (custom) error objects.
 * @param {string} type key from the object validation. Ex: required.
 * @param {any} validation the value for this key. Ex: required: true, maxLength: 5, required: { value: true, message: '' },
 * @param {any} value value from the input field, value to be tested.
 */
function checkValidations(type, validation, value) {
  const validationType = type;
  let validationValue = validation;
  let customErrorMessage;
  if (typeof validation === 'object') {
    validationValue = validation.value;
    customErrorMessage = validation.message;
  }

  switch (validationType) {
    case 'required': {
      // if required === true && value empty
      if (validationValue && !value) {
        const error = {
          error: 'required',
          message: customErrorMessage || locale[validationType],
        };
        return error;
      }
      break;
    }
    case 'regex': {
      const regEx = RegExp(validationValue);
      if (!regEx.test(value)) {
        return {
          error: 'regex',
          message: customErrorMessage || locale[validationType],
        };
      }
      break;
    }
    case 'email': {
      if (validationValue) {
        const regEx = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!regEx.test(value)) {
          return {
            error: 'email',
            message: customErrorMessage || locale[validationType],
          };
        }
      }
      break;
    }
    case 'number': {
      if (validationValue) {
        const regEx = RegExp(/^\d+$/);
        if (!regEx.test(value)) {
          return {
            error: 'number',
            message: customErrorMessage || locale[validationType],
          };
        }
      }
      break;
    }
    case 'decimal-number': {
      if (validationValue) { // if decimal required true
        const regEx = RegExp(/^\d{1,6}(\.\d{1,2})?$/g);
        if (!regEx.test(value)) {
          return {
            error: 'decimal-number',
            message: customErrorMessage || locale[validationType],
          };
        }
      }
      break;
    }
    case 'minLength': {
      if (value.length < validationValue) {
        return {
          error: 'minLength',
          message: customErrorMessage || `${locale[validationType]} ${validationValue}.`,
        };
      }
      break;
    }
    case 'maxLength': {
      if (value.length > validationValue) {
        return {
          error: 'maxLength',
          message: customErrorMessage || `${locale[validationType]} ${validationValue}.`,
        };
      }
      break;
    }
    case 'text-spanish': {
      if (validationValue) {
        const regEx = RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü 0-9-.,:;¿?¡!]*$/);
        if (!regEx.test(value)) {
          return {
            error: 'text-spanish',
            message: customErrorMessage || locale[validationType],
          };
        }
      }
      break;
    }
    case 'validationFunction': {
      // validationValue should be a function that returns false if the validations fails and true if it passes.
      const result = validationValue(value);
      if (!result) {
        return {
          error: 'function',
          message: customErrorMessage || locale[validationType],
        };
      }
      break;
    }
    // Rule not found.
    default: break;
  }
  return null;
}

/**
 * Loops through the validation object checking validations.
 * @param {any} value
 * @param {object} validationObj
 */
function validateField(value, validationObj) {
  const errors = [];
  if (Object.keys(validationObj).length) {
    // Checking if the field is required.
    let { required } = validationObj;
    if (required && typeof required === 'object') {
      required = required.value;
    }
    // Going through validations in the object.
    Object.keys(validationObj).forEach((key) => {
      if (!required && !value) { return; }
      const error = checkValidations(key, validationObj[key], value);
      if (error) { errors.push(error); }
    });
  }
  // Returning validation results object.
  return {
    valid: (errors.length === 0),
    errors,
  };
}

export default validateField;
