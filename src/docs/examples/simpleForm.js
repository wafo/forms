import React from 'react';
import { WafoForm, WafoFormInput, WafoFormSelect, WafoFormTextArea } from '../../../lib';
import '../styles.css';

const initialState = {
  required: true,
};

class SimpleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleFormSubmit = (form, values) => {
    console.log(form);
    console.log(values);
  }

  toggleRequired = () => {
    this.setState(prevState => ({
      ...prevState,
      required: !prevState.required,
    }));
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
        <WafoForm buttonText="Submit" onSubmit={this.handleFormSubmit} locale="es" ignoreEmpty>

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
            validations={{ required: this.state.required, minLength: 2, maxLength: 255 }}
            // customErrors={[{ error: 'custom', message: 'Error customizado' }]}
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
        <button type="button" onClick={this.toggleRequired}>Toggle required</button>
        <span>Required is: {this.state.required ? 'True' : 'False'}</span>
      </div>
    );
  }
}

export default SimpleForm;
