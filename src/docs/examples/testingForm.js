import React from 'react';
import { WafoFormHooks, WafoFormInput, WafoFormMultiSelect } from '../../../lib';

const TestForm = () => {
  const [initialValues, setInitialValues] = React.useState({
    eluno: '',
    elanidado: 'Y el anidado',
    maximoanidados: 'ojala',
  });

  const [show, setShow] = React.useState(true);
  const [test, setTest] = React.useState(true);
  const [hide, setHide] = React.useState(false);

  const changeValues = () =>
    setInitialValues(prevValues => ({
      ...prevValues,
      eluno: 'A ver pues',
      maximoanidados: 'Ayylmao, este no debería cambiar',
    }));

  return (
    <div>
      <WafoFormHooks values={initialValues}>
        {show && <WafoFormInput name="eluno" placeholder="Uno" validations={{ required: test }} />}
        <input type="text" name="eldos" placeholder="Dos" ignoreinput="true" />
        <div>
          <WafoFormInput name="elanidado" placeholder="Anidado" />
        </div>
        <div>
          <div className="Ayy">
            <div>
              <WafoFormInput
                name="maximoanidado"
                placeholder="Anidado"
                validations={{ minLength: 2, maxLength: 255 }}
              />
              <WafoFormInput
                name="maximoanidados"
                placeholder="Anidados"
                validations={{ minLength: 2, maxLength: 255 }}
              />
            </div>
          </div>
        </div>
        <div style={{ ...(hide && { display: 'none' }) }}>
          <WafoFormInput type="number" name="elhidden" placeholder="El hidden" />
        </div>

        <WafoFormMultiSelect
          name="city"
          customClass="col-md-4"
          label="Ciudad"
          placeholder="Seleccione ciudad"
          itemKey="id_city"
          items={[{ name: 'lmao', id_city: '1' }]}
          renderItem={item => item.name}
          renderInput={item => item.name}
          handleChange
          validations={{ required: true }}
        />
      </WafoFormHooks>

      <button type="button" onClick={() => setShow(prevState => !prevState)}>
        Toggle input
      </button>
      <button type="button" onClick={() => setHide(prevState => !prevState)}>
        Toggle validation
      </button>
      <button type="button" onClick={changeValues}>
        Change values
      </button>
    </div>
  );
};

export default TestForm;
