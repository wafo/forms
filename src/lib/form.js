import React from 'react';
import PropTypes from 'prop-types';
import validateField from './validation';

/**
 * @typedef initialInputState
 * @type {Object}
 * @property {string} value The value of the input
 * @property {boolean} touched Indicates that the input value has changed
 * @property {boolean} valid Indicates if the input is valid (based on validations)
 * @property {array} errors array of errors. Check validation.js
 * @property {object} validations list of validation rules. Check validation.js
 */
const initialInputState = {
  value: '',
  touched: false,
  valid: false,
  errors: [],
  validations: {},
};

/**
 * @typedef initialState
 * @type {Object}
 * @property {initialInputState} form One for every props.children (input) in the form. The "name" of the input is the key.
 */
const initialState = {
  form: {},
};

class WafoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // values = initial values to preload children
    const { children, values } = props;
    React.Children.forEach(children, (child) => {
      const { form } = this.state;
      if (child && child.props && child.props.name) {
        this.state = {
          form: {
            ...form,
            [child.props.name]: {
              ...initialInputState,
              // cheking if initial values exist
              value: (values && values[child.props.name]) ? values[child.props.name] : initialInputState.value,
              validations: child.props.validations,
            },
          },
        };
      }
    });

    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmit(event) {
    if (event) { event.preventDefault(); } // event can be undefined if the function is not called normally

    const { onSubmit } = this.props;
    const { form: formState } = this.state;

    // checking every input validation
    const form = { valid: true };
    const formValues = {};
    const newState = {};
    Object.keys(formState).forEach((field) => {
      const { form: { [field]: inputState } } = this.state;
      const validation = validateField(inputState.value, inputState.validations);
      if (!validation.valid) { form.valid = false; }

      form[field] = {
        value: inputState.value,
        valid: validation.valid,
        errors: validation.errors,
      };

      formValues[field] = inputState.value;

      newState[field] = {
        ...inputState,
        touched: true,
        valid: validation.valid,
        errors: validation.errors,
      };
    });

    // updating state and sending values through callback
    this.setState({ form: newState }, () => {
      onSubmit(form, formValues);
    });
  }

  handleInputChange(input) {
    // the name of the input is the key
    const { target: { name, value } } = input;
    const { form: { [name]: inputState } } = this.state;

    const validation = validateField(value, inputState.validations);

    this.setState((prevState) => {
      const { form } = prevState;
      return {
        form: {
          ...form,
          [name]: {
            ...inputState,
            value,
            touched: true,
            valid: validation.valid,
            errors: validation.errors,
          },
        },
      };
    });
  }

  render() {
    const { formId, buttonText } = this.props;
    let { children } = this.props;

    /** Modifying children props */
    children = React.Children.map(children, (child) => {
      // If !child || child !== WafoFormElement
      if (!child || !Object.prototype.hasOwnProperty.call(child.props, 'name')) {
        return child;
      }
      const { form: { [child.props.name]: { value, valid, touched, errors } } } = this.state;
      // Check if custom errors are provided (not from wafo-forms validation).
      const hasCustomErrors = Object.prototype.hasOwnProperty.call(child.props, 'customErrors');

      return React.cloneElement(child, {
        handleInputChange: this.handleInputChange,
        value,
        valid: hasCustomErrors ? false : valid,
        touched: hasCustomErrors ? true : touched,
        errors: hasCustomErrors ? [...errors, ...child.props.customErrors] : errors,
      });
    });

    return (
      <form id={formId} onSubmit={this.onSubmit}>
        <div className="row">
          {children}
        </div>
        {/** Only show the button if text is provided */}
        {buttonText && <button type="submit" className="btn btn-primary btn-submit">{buttonText}</button>}
      </form>
    );
  }
}

WafoForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element).isRequired,
    PropTypes.element.isRequired,
    () => null,
  ]).isRequired,
  formId: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  values: PropTypes.any,
};

WafoForm.defaultProps = {
  formId: 'wafoform',
  buttonText: '',
  onSubmit: f => f,
  values: undefined,
};

export default WafoForm;
