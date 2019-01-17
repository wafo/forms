import React from 'react';
import { render } from 'react-dom';
import SimpleForm from './examples/simpleForm';
import './styles.css';

function Demo() {
  return (
    <div>
      <h1>Wafo-form!</h1>
      <SimpleForm />
    </div>
  );
}

render(<Demo />, document.getElementById('app'));
