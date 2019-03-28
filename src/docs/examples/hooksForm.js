import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';

const SimpleForm = () => {
  const onSubmit = (form, values) => {
    console.log(form);
    console.log(values);
  };

  return (
    <div className="hooks-form">
      <WafoFormHooks buttonText="Submit" onSubmit={onSubmit} locale="es">
        <WafoFormInput
          type="text"
          name="name"
          customClass="mycustomclass"
          placeholder="Nombre"
          label="Nombre"
          validations={{
            required: true,
            email: true,
            validationFunction: value => value === 'lmao',
          }}
          extraProps={{
            autoComplete: 'off',
          }}
        >
          <small>Esta forma esta bien fea</small>
        </WafoFormInput>

        <WafoFormInput
          type="text"
          name="last_name"
          customClass="mycustomclass"
          placeholder="Apellidos"
          label="Apellidos"
          validations={{ required: true, minLength: 5, maxLength: 255 }}
          onChangeCallback={event => console.log(event)}
          onBlurCallback={event => console.log(event)}
        />
      </WafoFormHooks>
    </div>
  );
};

export default SimpleForm;
