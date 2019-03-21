import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';

const SimpleForm = () => {
  const onSubmit = (form) => {
    console.log(form);
  };

  return (
    <div className="hooks-form">
      <WafoFormHooks buttonText="Submit" onSubmit={onSubmit}>
        <WafoFormInput
          type="text"
          name="name"
          customClass="mycustomclass"
          placeholder="Nombre"
          label="Nombre"
          validations={{ required: true, minLength: 5, maxLength: 255 }}
        />

        <WafoFormInput
          type="text"
          name="last_name"
          customClass="mycustomclass"
          placeholder="Apellidos"
          label="Apellidos"
          validations={{ required: true, minLength: 5, maxLength: 255 }}
        />
      </WafoFormHooks>
    </div>
  );
};

export default SimpleForm;
