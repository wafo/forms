import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';

const SimpleForm = () => {
  const onSubmit = (form, values) => {
    console.log(form);
    console.log(values);
  };

  const checkPassword = value => value.value === value.tracking;

  return (
    <div className="hooks-form">
      <WafoFormHooks buttonText="Submit" onSubmit={onSubmit} locale="es" ignoreEmpty>
        <WafoFormInput
          type="password"
          name="password"
          customClass="mycustomclass"
          placeholder="Contraseña"
          label="Contraseña"
          labelClass="ayy"
          validations={{
            required: true,
          }}
        />

        <WafoFormInput
          type="password"
          name="password2"
          customClass="mycustomclass"
          placeholder="Confirmar contraseña"
          label="Confirmar cotnraseña"
          validations={{
            track: 'password',
            validationFunction: {
              value: checkPassword,
              message: 'La contraseña no coincide.',
            },
          }}
        />
      </WafoFormHooks>
    </div>
  );
};

export default SimpleForm;
