import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import validateField from './validation';

const initialInputState = {
  value: '',
  touched: false,
  valid: false,
  errors: [],
  validations: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'inputChange':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          ...action.payload,
        },
      };
    case 'formChange':
      return { ...action.payload };
    default:
      throw new Error();
  }
}

function WafoForm({ children, buttonText, onSubmit, values }) {

  // Antes era el constructor.
  function setUpState() {
    const initialState = {};

    if (children.length > 1) {
      children.forEach((child) => {
        if (child.props.wafoformelement) {
          initialState[child.props.name] = {
            ...initialInputState,
            validations: child.props.validations,
            // Custom initial value ?
            value: (values && values[child.props.name]) ? values[child.props.name] : initialInputState.value,
          };
        }
      });
    } else if (children.props.wafoformelement) {
      initialState[children.props.name] = {
        ...initialInputState,
        validations: children.props.validations,
        // Custom initial value ?
        value: (values && values[children.props.name]) ? values[children.props.name] : initialInputState.value,
      };
    }

    return initialState;
  }
  const [state, dispatch] = useReducer(reducer, {}, setUpState);

  function handleInputChange(event) {
    const { target: { name, value } } = event;
    const { [name]: inputState } = state;

    const validation = validateField(value, inputState.validations);

    dispatch({
      type: 'inputChange',
      payload: {
        name,
        value,
        touched: true,
        valid: validation.valid,
        errors: validation.errors,
      },
    });
  }

  function handleSubmit(event) {
    if (event) { event.preventDefault(); }

    const form = { valid: true };
    const newState = {};

    Object.keys(state).forEach((field) => {
      const { [field]: inputState } = state;
      const validation = validateField(inputState.value, inputState.validations);
      if (!validation.valid) { form.valid = false; }

      form[field] = {
        value: inputState.value,
        valid: validation.valid,
        errors: validation.errors,
      };

      newState[field] = {
        ...inputState,
        touched: true,
        valid: validation.valid,
        errors: validation.errors,
      };
    });

    dispatch({
      type: 'formChange',
      payload: newState,
    });
    onSubmit(form);
  }

  const renderChildren = React.Children.map(children, (child) => {
    // If child !== WafoFormElement
    if (!Object.prototype.hasOwnProperty.call(child.props, 'wafoformelement')) {
      return child;
    }

    const { [child.props.name]: { value, valid, touched, errors } } = state;
    // Check if custom errors are provided (not from wafo-forms validation).
    const hasCustomErrors = Object.prototype.hasOwnProperty.call(child.props, 'customErrors');

    return React.cloneElement(child, {
      handleInputChange,
      value,
      valid: hasCustomErrors ? false : valid,
      touched: hasCustomErrors ? true : touched,
      errors: hasCustomErrors ? [...errors, ...child.props.customErrors] : errors,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {renderChildren}
      </div>
      {/** Only show the button if text is provided */}
      {buttonText && <button type="submit" className="btn btn-primary btn-submit">{buttonText}</button>}
    </form>
  );
}

WafoForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element).isRequired,
    PropTypes.element.isRequired,
  ]).isRequired,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  values: PropTypes.any,
};

WafoForm.defaultProps = {
  buttonText: '',
  onSubmit: f => f,
  values: undefined,
};

export default WafoForm;
