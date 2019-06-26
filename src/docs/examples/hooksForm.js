import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';

const SimpleForm = () => {
  const [required, setRequired] = React.useState(false);

  const onSubmit = (form, values) => {
    console.log(form);
    console.log(values);
  };

  return (
    <div className="hooks-form">
      <WafoFormHooks buttonText="Submit" onSubmit={onSubmit} locale="es" ignoreEmpty>
        <WafoFormInput
          type="text"
          name="name"
          customClass="mycustomclass"
          placeholder="Nombre"
          label="Nombre"
          labelClass="ayy"
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
          validations={{
            required,
            regex: {
              value: /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
              message: 'RFC inválido.',
            }
          }}
          onChangeCallback={event => console.log(event)}
          onBlurCallback={event => console.log(event)}
        />
      </WafoFormHooks>

      <button type="button" onClick={() => setRequired(prevState => !prevState)}>Change required</button>
    </div>
  );
};

export default SimpleForm;
