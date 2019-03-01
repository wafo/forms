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
      case 'text-spanish': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if number required true
          const regEx = RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü 0-9-.,:;¿?¡!]*$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'Solo texto, números y (-.,:;¿?¡!).' };
          }
        }
        break;
      }
      case 'email': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if email required true
          const regEx = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
          if (!regEx.test(value)) {
            return { error: 'email', message: 'Correo electrónico inválido.' };
          }
        }
        break;
      }
      case 'phone': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if phone required true
          const regEx = RegExp(/^\d{7,10}$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'Número de teléfono inválido.' };
          }
        }
        break;
      }
      case 'curp': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if curp required true
          const regEx = RegExp(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'CURP inválida.' };
          }
        }
        break;
      }
      case 'rfc': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if rfc required true
          const regEx = RegExp(/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'RFC inválido.' };
          }
        }
        break;
      }
      case 'nss': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if nss required true
          const regEx = RegExp(/^(\d{2})(\d{2})(\d{2})\d{5}$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'Número de Seguridad Social inválido.' };
          }
        }
        break;
      }
      case 'ife': {
        if (!validations.required && !value) { break; }
        if (validations[validation]) { // if ife required true
          const regEx = RegExp(/^\d{12,13}$/);
          if (!regEx.test(value)) {
            return { error: 'number', message: 'Número de identificación inválido.' };
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