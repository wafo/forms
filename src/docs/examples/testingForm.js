import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';

const initialValues = {
  eluno: 'A ver pues',
  elanidado: 'Y el anidado',
  maximoanidados: 'ojala',
};

const TestForm = () => {
  const [show, setShow] = React.useState(true);
  const [test, setTest] = React.useState(true);
  const [hide, setHide] = React.useState(false);

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
      </WafoFormHooks>

      <button type="button" onClick={() => setShow(prevState => !prevState)}>
        Toggle input
      </button>
      <button type="button" onClick={() => setHide(prevState => !prevState)}>
        Toggle validation
      </button>
    </div>
  );
};

export default TestForm;
