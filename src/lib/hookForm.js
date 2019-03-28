import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import validateField, { setLocale } from './validation';

const initialInputState = {
  value: '',
  touched: false,
  valid: false,
  errors: [],
  validations: {},
};

function setUpState(payload) {
  const { state, children, values } = payload;
  let newState = state;
  // Setting up state object.
  React.Children.forEach(children, (child) => {
    if (child && child.props && child.props.name && !newState[child.props.name]) {
      newState = {
        ...newState,
        [child.props.name]: {
          ...initialInputState,
          // cheking if initial values exist
          value: (values && values[child.props.name]) ? values[child.props.name] : initialInputState.value,
          validations: child.props.validations,
        },
      };
    }
  });
  // Removing elements that no longer are in children.
  const childrenKeys = React.Children.map(children, child => child.props.name);
  Object.keys(newState).forEach((key) => {
    // Elemento ya no es un hijo.
    if (childrenKeys.findIndex(x => x === key) === -1) {
      delete newState[key];
    }
  });
  // Returning new state object.
  return newState;
}

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
    case 'reset':
      return setUpState(action.payload);
    default:
      throw new Error();
  }
}

function WafoForm({ children, formId, buttonText, onSubmit, values, locale }) {
  const [state, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    dispatch({
      type: 'reset',
      payload: {
        state,
        children,
        values,
      },
    });
  }, [children]);

  useEffect(() => {
    setLocale(locale);
  }, []);

  function handleSubmit(event) {
    if (event) { event.preventDefault(); }

    const form = { valid: true };
    const formValues = {};
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

      formValues[field] = inputState.value;

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
    onSubmit(form, formValues);
  }

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

  const renderChildren = React.Children.map(children, (child) => {
    // If !child || child not in state || child !== WafoFormElement
    if (!child || !state[child.props.name] || !Object.prototype.hasOwnProperty.call(child.props, 'name')) {
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
    <form id={formId} onSubmit={handleSubmit}>
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
    () => null,
  ]).isRequired,
  formId: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
  values: PropTypes.any,
  locale: PropTypes.string,
};

WafoForm.defaultProps = {
  formId: 'wafoform',
  buttonText: '',
  onSubmit: f => f,
  values: undefined,
  locale: 'en',
};

export default WafoForm;
