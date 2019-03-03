import React from 'react';
import { render } from 'react-dom';
// import AutocompleteForm from './examples/autocomplete';
import SimpleForm from './examples/simpleForm';
import '../lib/wafo-forms.css';

function Demo() {
  return (
    <div>
      <h1>Wafo-form!</h1>
      <SimpleForm />
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
