import React from 'react';
import { WafoFormHooks, WafoFormInput, WafoFormMultiSelect, WafoFormAutocomplete } from '../../../lib';

const TestForm = () => {
  const [initialValues, setInitialValues] = React.useState({
    eluno: '',
    elanidado: 'Y el anidado',
    maximoanidados: 'ojala',
    auto: { id: 2, name: 'Gaytis', last: 'Gaytán' },
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
          items={[
            { name: 'lmao', id_city: '1' },
            { name: 'lmao', id_city: '2' },
            { name: 'lmao', id_city: '3' },
            { name: 'lmao', id_city: '4' },
            { name: 'lmao', id_city: '5' },
            { name: 'lmao', id_city: '6' },
            { name: 'lmao', id_city: '7' },
            { name: 'lmao', id_city: '8' },
            { name: 'lmao', id_city: '9' },
            { name: 'lmao', id_city: '10' },
            { name: 'lmao', id_city: '11' },
            { name: 'lmao', id_city: '12' },
            { name: 'lmao', id_city: '13' },
            { name: 'lmao', id_city: '14' },
            { name: 'lmao', id_city: '15' },
            { name: 'lmao', id_city: '16' },
            { name: 'lmao', id_city: '17' },
            { name: 'lmao', id_city: '18' },
            { name: 'lmao', id_city: '19' },
            { name: 'lmao', id_city: '20' },
            { name: 'lmao', id_city: '21' },
            { name: 'lmao', id_city: '22' },
            { name: 'lmao', id_city: '23' },
            { name: 'lmao', id_city: '24' },
            { name: 'lmao', id_city: '25' },
            { name: 'lmao', id_city: '26' },
            { name: 'lmao', id_city: '27' },
            { name: 'lmao', id_city: '28' },
            { name: 'lmao', id_city: '29' },
            { name: 'lmao', id_city: '30' },
            { name: 'lmao', id_city: '31' },
            { name: 'lmao', id_city: '32' },
            { name: 'lmao', id_city: '33' },
            { name: 'lmao', id_city: '34' },
            { name: 'lmao', id_city: '35' },
            { name: 'lmao', id_city: '36' },
          ]}
          renderItem={item => item.name}
          renderInput={item => item.name}
          handleChange
          validations={{ required: true }}
        />

        <WafoFormAutocomplete
          name="auto"
          customClass="col-md-4"
          label="auto"
          placeholder="Autocomplete"
          items={[
            { id: 1, name: 'Wafo', last: 'Vega' },
            { id: 2, name: 'Gaytis', last: 'Gaytán' },
            { id: 3, name: 'Lalo', last: 'López' },
            { id: 4, name: 'Paola', last: 'Tapia' },
            { id: 5, name: 'Jorge', last: 'Valenzuela' },
            { id: 6, name: 'Arturo', last: 'Camarena' },
            { id: 7, name: 'Laura', last: 'Sabe' },
            { id: 8, name: 'Claudia', last: 'Ochoa' },
            { id: 9, name: 'Mayra', last: 'Lepro' },
            { id: 10, name: 'Ramón', last: 'Guerrero' },
          ]}
          renderInput={item => `${item.name} ${item.last}`}
          renderItem={item => (
            <p style={{ margin: 0, padding: '.25rem .5rem', borderBottom: '1px solid #ccc' }}>
              <span>
                {item.name} {item.last}
              </span>
              <br />
              <span style={{ fontSize: '0.85em' }}>ID: {item.id}</span>
            </p>
          )}
          filterItems={(items, query) =>
            items.filter(
              item =>
                item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                item.last.toLowerCase().indexOf(query.toLowerCase()) !== -1,
            )
          }
          validations={{ required: true }}
          handleChange
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
