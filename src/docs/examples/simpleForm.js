import React from 'react';
import { WafoForm, WafoFormInput } from '../../../lib';

const initialState = {};

class SimpleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleFormSubmit(form) {
    console.log(form);
  }

  render() {
    return (
      <div className="simple-form">
        <WafoForm buttonText="Submit" onSubmit={this.handleFormSubmit}>

          <WafoFormInput
            type="text"
            name="example"
            placeholder="A placeholder"
            label="An input field"
            validations={{ required: true, minLength: 2, maxLength: 255 }}
          />

          <WafoFormInput
            type="text"
            name="exampledos"
            placeholder="A placeholder"
            label="Another input field"
            validations={{ minLength: 2, maxLength: 255 }}
          />

        </WafoForm>
      </div>
    );
  }
}

export default SimpleForm;
