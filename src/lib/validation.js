function validateField(value, validations) {
  function checkValidations(validation) {
    switch (validation) {
      case 'required':
        if (validations[validation]) { // if required true
          const error = { error: 'required', message: 'Este campo es requerido.' };
          if (validations.type) {
            switch (validations.type) {
              case 'richText':
                if (!value) { return error; }
                break;
              case 'dateList':
              case 'temario':
                if (!value || value === '[]') {
                  return error;
                }
                break;
              default:
                if (!value) { return error; }
                break;
            }
          } else if (!value) {
            return error;
          }
        }
        break;
      case 'pattern': {
        if (!validations.required && !value) { break; }
        const regEx = RegExp(validations[validation]);
        if (!regEx.test(value)) {
          return { error: 'pattern', message: 'El valor no cumple con los requisitos.' };
        }
        break;
      }
      case 'minLength':
        if (!validations.required && !value) { break; }
        if (value.length < validations[validation]) {
          return { error: 'minLength', message: `Mínimo de caracteres ${validations[validation]}` };
        }
        break;
      case 'maxLength':
        if (!validations.required && !value) { break; }
        if (value.length > validations[validation]) {
          return { error: 'maxLength', message: `Máximo de caracteres ${validations[validation]}` };
        }
        break;
      case 'number': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if number required true
          const regEx = RegExp(/^\d+$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'El valor debe ser un número entero.' };
          }
        }
        break;
      }
      case 'email': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if email required true
          const regEx = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
          if (!regEx.test(value)) {
            return { error: 'email', message: 'El valor debe ser un correo electrónico valido.' };
          }
        }
        break;
      }
      default: break;
    }
    return null;
  }

  const errors = [];
  if (validations) {
    Object.keys(validations).forEach((validation) => {
      const error = checkValidations(validation);
      if (error) { errors.push(error); }
    });
  }

  return {
    valid: (errors.length === 0),
    errors,
  };
}

export default validateField;