import React from 'react';
import PropTypes from 'prop-types';
import validateField, { setLocale } from '../../utils/validation';
import styles from '../../styles.module.css'

const initialInputState = {
  errors: [],
  touched: false,
  valid: false,
  value: '',
};

function setUpState({ children, state, initialValues, childrenKeys = [] }) {
  let newState = state;
  let keys = childrenKeys;
  let validations = {};
  // Setting up state object.
  React.Children.forEach(children, child => {
    if (child && child.props) {
      if (child.props.name && !child.props.ignoreinput) {
        keys = [...keys, child.props.name];
      }
      // if child is not already on state
      if (child.props.name && !child.props.ignoreinput) {
        if (!newState[child.props.name]) {
          newState = {
            ...newState,
            [child.props.name]: {
              ...initialInputState,
              // Checking if initial value exists
              value:
                initialValues && initialValues[child.props.name]
                  ? initialValues[child.props.name]
                  : initialInputState.value,
            },
          };
        } else if (
          newState[child.props.name] &&
          !newState[child.props.name].value &&
          initialValues &&
          initialValues[child.props.name]
        ) {
          // If already on state, but initial value changes and input doesn't have a value.
          newState[child.props.name] = {
            ...newState[child.props.name],
            value: initialValues[child.props.name],
          };
        }
        validations = {
          ...validations,
          [child.props.name]: child.props.validations || {},
        };
      }
      // if child has childrens
      if (child.props.children) {
        const { newState: stateFragment, keys: keysFragment, validations: validationsFragment } = setUpState({
          children: child.props.children,
          state: newState,
          initialValues,
          childrenKeys: [],
        });
        newState = { ...newState, ...stateFragment };
        keys = [...keys, ...keysFragment];
        validations = { ...validations, ...validationsFragment };
      }
    }
  });
  // Returning state object and valid keys.
  return { newState, keys, validations };
}

function reducer(state, action) {
  switch (action.type) {
    case 'inputChange':
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: {
            ...state.form[action.payload.name],
            ...action.payload.input,
          },
        },
      };
    case 'formChange':
      return {
        ...state,
        form: action.payload,
      };
    case 'reset': {
      const { newState, keys, validations } = setUpState({
        state: state.form,
        ...action.payload,
      });
      // Removing elements from state object that are no longer in the form.
      Object.keys(newState).forEach(key => {
        if (keys.findIndex(x => x === key) === -1) {
          delete newState[key];
        }
      });
      return {
        ...state,
        form: newState,
        validations,
      };
    }
    default:
      throw new Error();
  }
}

function WafoForm({ children, values, onSubmit, formId, buttonText, locale, ignoreEmpty }) {
  const [state, dispatch] = React.useReducer(reducer, {
    form: {},
    validations: {},
  });

  React.useEffect(() => {
    // Setup or rebuilding form state on form changes.
    dispatch({
      type: 'reset',
      payload: {
        children,
        initialValues: values,
      },
    });
  }, [children, values]);

  React.useEffect(() => {
    setLocale(locale);
  }, [locale]);

  function handleOnChange(event) {
    const { target } = event;
    const { name, value, attributes } = target || event;
    if (state.form[name] && state.validations[name] && ((attributes && !attributes.ignoreinput) || !attributes)) {
      const iValidations = state.validations[name];
      const vValue = iValidations.track ? { value, tracking: state.form[iValidations.track].value } : value;
      const validation = validateField(vValue, iValidations);

      dispatch({
        type: 'inputChange',
        payload: {
          name,
          input: {
            value,
            touched: true,
            valid: validation.valid,
            errors: validation.errors,
          },
        },
      });
    }
  }

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const form = { valid: true };
    const formValues = {};
    const newState = {};

    Object.keys(state.form).forEach(field => {
      const { [field]: inputState } = state.form;

      const iValidations = state.validations[field];
      const vValue = iValidations.track
        ? {
            value: inputState.value,
            tracking: state.form[iValidations.track].value,
          }
        : inputState.value;
      const validation = validateField(vValue, iValidations);
      if (!validation.valid) {
        form.valid = false;
      }

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
        errors: validation.errors,
        touched: true,
        valid: validation.valid,
      };
    });

    dispatch({
      type: 'formChange',
      payload: newState,
    });
    onSubmit(form, formValues);
  }

  function prepareRender(children) {
    return React.Children.map(children, child => {
      if (
        !child ||
        !child.props ||
        !state.form[child.props.name] ||
        !Object.prototype.hasOwnProperty.call(child.props, 'name') ||
        Object.prototype.hasOwnProperty.call(child.props, 'ignoreinput')
      ) {
        if (child && child.props && child.props.children) {
          const nestedChildren = prepareRender(child.props.children);
          return React.cloneElement(child, [], [nestedChildren]);
        }
        return child;
      }

      const {
        [child.props.name]: { value, valid, touched, errors },
      } = state.form;
      const hasCustomErrors = Object.prototype.hasOwnProperty.call(child.props, 'customErrors');

      return React.cloneElement(child, {
        ...(child.props.handleChange && { handleInputChange: handleOnChange }),
        value,
        valid: hasCustomErrors ? false : valid,
        touched: hasCustomErrors ? true : touched,
        errors: hasCustomErrors ? [...errors, ...child.props.customErrors] : errors,
      });
    });
  }
  const renderChildren = prepareRender(children);

  return (
    <form id={formId} onChange={handleOnChange} onSubmit={handleSubmit}>
      <div className={styles.row}>{renderChildren}</div>
      {/** Only show the button if text is provided */}
      {buttonText && (
        <button type="submit" className="btn btn-primary btn-submit">
          {buttonText}
        </button>
      )}
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
