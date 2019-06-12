import React, { useReducer, useEffect, useState } from 'react';
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
          validations: child.props.validations || {},
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

function WafoForm({ children, values, onSubmit, formId, buttonText, locale, ignoreEmpty }) {
  const [validations, setValidations] = useState({});
  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    // setting form on start or if a children changes
    dispatch({
      type: 'reset',
      payload: {
        state,
        children,
        values,
      },
    });
    // creating validation object
    const newValidations = {};
    React.Children.forEach(children, (child) => {
      newValidations[child.props.name] = child.props.validations || {};
    });
    setValidations(newValidations);
  }, [children]);

  useEffect(() => {
    setLocale(locale);
  }, [locale]);

  const handleInputChange = React.useCallback((event) => {
    const { target } = event;
    const { name, value } = target || event;

    const validation = validateField(value, validations[name]);

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
  }, [validations]);

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

      if (!ignoreEmpty || (ignoreEmpty && inputState.value)) {
        formValues[field] = inputState.value;
      }

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
  values: PropTypes.any,
  onSubmit: PropTypes.func,
  formId: PropTypes.string,
  buttonText: PropTypes.string,
  locale: PropTypes.string,
  ignoreEmpty: PropTypes.bool,
};

WafoForm.defaultProps = {
  values: undefined,
  onSubmit: f => f,
  formId: 'wafoform',
  buttonText: '',
  locale: 'en',
  ignoreEmpty: false,
};

export default WafoForm;
