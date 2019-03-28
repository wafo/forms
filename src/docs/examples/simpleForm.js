import React from 'react';
import { WafoForm, WafoFormInput, WafoFormSelect } from '../../../lib';
import WafoFormTextArea from '../../lib/textarea';
import '../styles.css';

const initialState = {};

class SimpleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleFormSubmit = (form, values) => {
    console.log(form);
    console.log(values);
  }

  render() {
    const select = [
      { value: '0', display: 'Item One' },
      { value: '1', display: 'Item Two' },
      { value: '2', display: 'Item Three' },
    ];

    const ayy = null;

    return (
      <div className="simple-form">
        <WafoForm buttonText="Submit" onSubmit={this.handleFormSubmit}>

          <div style={{ width: '100%' }}>
            <p>A ver al cine dijo el gaytis</p>
          </div>

          {ayy}

          <WafoFormInput
            type="text"
            name="example"
            customClass="mycustomclass"
            placeholder="A placeholder"
            label="An input field"
            validations={{ required: true, minLength: 2, maxLength: 255 }}
            customErrors={[{ error: 'custom', message: 'Error customizado' }]}
            onChangeCallback={event => console.log(event)}
            extraProps={{ maxLength: 5 }}
          />

          <WafoFormInput
            type="text"
            name="exampledos"
            customClass="mycustomclass"
            placeholder="A placeholder"
            label="Another input field"
            validations={{ minLength: 2, maxLength: 255 }}
          />

          <WafoFormSelect
            name="exampleselect"
            customClass="mycustomclass"
            label="A select field"
            options={select}
            validations={{ required: true }}
          />

          <WafoFormTextArea
            name="textarea"
            placeholder="A textarea placeholder"
            customClass="full-width"
            label="A textarea field"
            validations={{ required: true, minLength: 5 }}
          />

        </WafoForm>
      </div>
    );
  }
}

export default SimpleForm;
