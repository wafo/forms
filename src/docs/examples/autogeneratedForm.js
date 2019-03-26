import React from 'react';
import { WafoFormHooks, WafoFormInput } from '../../../lib';
import '../styles.css';

const testValues = {
  experimento: 'A ver',
  name0: 'A ver 0',
};

function AutogeneratedForm() {
  const [count, setCount] = React.useState(0);
  const [form, setForm] = React.useState(() => {
    const row = createRow(count);
    setCount(count + 1);
    return { 0: row };
  });

  function createRow(index) {
    const row = [];

    const name = (
      <WafoFormInput
        key={`name${index}`}
        type="text"
        name={`name${index}`}
        placeholder="Nombre del equipo"
        label="Nombre del equipo"
        customClass="col-12 col-md-8"
        validations={{ required: true, 'text-spanish': true }}
      />
    );
    const options = (
      <div className="col-12 col-md-1 text-right" style={{ paddingTop: '1.25rem' }}>
        <button type="button" className="btn btn-danger" onClick={() => { removeRow(index); }}>
          Eliminar
        </button>
      </div>
    );

    row.push(name);
    row.push(options);

    return row;
  }

  function addRow() {
    const row = createRow(count);
    setForm(prevState => ({
      ...prevState,
      [count]: row,
    }));
    setCount(count + 1);
  }

  function removeRow(removeIndex) {
    setForm((prevState) => {
      const newState = { ...prevState };
      delete newState[removeIndex];
      return newState;
    });
  }

  function onSubmit(formValues) {
    console.log(formValues);
  }

  // Transformando objeto en array.
  const formArray = Object.keys(form).map(key => ([...form[key]]));

  return (
    <div className="simple-form">

      <button type="button" onClick={addRow}>Add form</button>

      <WafoFormHooks formId="hooksForm" buttonText="Ayy" onSubmit={onSubmit} values={testValues}>

        <div style={{ width: '100%' }}>
          <p>A ver al cine dijo el gaytis</p>
        </div>

        {formArray}

      </WafoFormHooks>

      <button type="submit" form="hooksForm">Ayy2</button>
    </div>
  );
}

export default AutogeneratedForm;
