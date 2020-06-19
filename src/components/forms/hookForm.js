import React from "react";
import PropTypes from "prop-types";
import validateField, { setLocale } from "../../utils/validation";
import styles from "../../styles.module.css";

const initialInputState = {
  errors: [],
  touched: false,
  valid: false,
  value: ""
};

// For inputChange
function updateState(state, parents, name, newValue) {
  const updatedState = { ...state };
  if (parents.length) {
    updatedState[parents[0]] = updateState(
      updatedState[parents[0]],
      parents.slice(1),
      name,
      newValue
    );
  } else {
    updatedState[name] = {
      ...updatedState[name],
      ...newValue
    };
  }
  return updatedState;
}

// Removing items from state that are no longer rendered
function removeFromState(state, formKeys) {
  const trimmedState = { ...state };
  Object.keys(trimmedState).forEach(key => {
    if (!formKeys[key]) {
      delete trimmedState[key];
    } else {
      if (typeof formKeys[key] === "object") {
        trimmedState[key] = {
          ...removeFromState(trimmedState[key], formKeys[key]),
          isGroup: true // hmm...
        };
      }
    }
  });
  return trimmedState;
}

// Checking input for validation
function checkInput(inputState, validations) {
  const validation = validateField(inputState.value, validations);

  return {
    value: inputState.value,
    valid: validation.valid,
    errors: validation.errors,
    touched: true
  };
}

// Form validation on submit
function validateForm(
  { form: iForm = {}, values: iValues = {}, state: iState = {} },
  validations,
  iValid = true,
  ignoreEmpty = false
) {
  const form = { ...iForm };
  const formValues = { ...iValues };
  const formState = { ...iState };
  let valid = iValid;

  Object.entries(formState)
    .filter(([key]) => key !== "isGroup")
    .forEach(([key, value]) => {
      const isGroup = value.isGroup;
      if (isGroup) {
        const testedForm = validateForm(
          {
            form: form[key],
            values: formValues[key],
            state: formState[key]
          },
          validations[key],
          valid
        );
        form[key] = testedForm.form;
        formState[key] = testedForm.formState;
        formValues[key] = testedForm.formValues;
        valid = testedForm.valid;
      } else {
        const testedValue = checkInput(value, validations[key]);
        form[key] = testedValue;
        formState[key] = testedValue;
        if (!ignoreEmpty || (ignoreEmpty && value.value)) {
          formValues[key] = value.value;
        }
        if (!testedValue.valid) {
          valid = false;
        }
      }
    });

  return {
    form,
    formValues,
    formState,
    valid
  };
}

/** **************************************** */
/** Form Component */
/** **************************************** */

function setUpState({
  children,
  state,
  initialValues,
  childrenKeys = {},
  group = false
}) {
  let newState = state;
  let keys = childrenKeys;
  let validations = {};

  // Setting up state object.
  React.Children.forEach(children, child => {
    if (child && child.props) {
      const isGroup =
        child.props.groupname !== null && child.props.groupname !== undefined;

      if (isGroup) {
        const {
          keys: keysFragment,
          newState: stateFragment,
          validations: validationsFragment
        } = setUpState({
          children: child.props.children,
          state: newState[child.props.groupname] || {},
          initialValues: {},
          group: child.props.groupname
        });

        keys = {
          ...keys,
          [child.props.groupname]: keysFragment
        };
        newState = {
          ...newState,
          [child.props.groupname]: { ...stateFragment, isGroup: true }
        };
        validations = {
          ...validations,
          [child.props.groupname]: validationsFragment
        };
      }
      if (child.props.name && !child.props.ignoreinput) {
        keys = { ...keys, [child.props.name]: child.props.name };
      }
      // if child is not already on state
      if (child.props.name && !child.props.ignoreinput) {
        if (!newState[child.props.name]) {
          newState = {
            ...newState,
            [child.props.name]: {
              ...initialInputState,
              ...(group && { group }),
              // Checking if initial value exists
              value:
                initialValues && initialValues[child.props.name]
                  ? initialValues[child.props.name]
                  : initialInputState.value
            }
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
            value: initialValues[child.props.name]
          };
        }
        // Validations
        validations = {
          ...validations,
          [child.props.name]: child.props.validations || {}
        };
      }
      // if child has childrens
      if (child.props.children && !isGroup) {
        const {
          keys: keysFragment,
          newState: stateFragment,
          validations: validationsFragment
        } = setUpState({
          children: child.props.children,
          state: newState,
          initialValues,
          group
        });

        keys = { ...keys, ...keysFragment };
        newState = { ...newState, ...stateFragment };
        validations = { ...validations, ...validationsFragment };
      }
    }
  });
  // Returning state object and valid keys.
  return { newState, keys, validations };
}

function reducer(state, action) {
  switch (action.type) {
    case "inputChange": {
      const { group, name, input } = action.payload;
      const updatedState = updateState(state.form, group, name, input);
      return {
        ...state,
        form: {
          ...state.form,
          ...updatedState
        }
      };
    }
    case "formChange":
      return {
        ...state,
        form: action.payload
      };
    case "reset": {
      const { newState, keys, validations } = setUpState({
        state: state.form,
        ...action.payload
      });

      // Removing elements from state object that are no longer in the form.
      // This is outside of the set up function because of recursion
      const trimmedState = removeFromState(newState, keys);

      return {
        ...state,
        form: trimmedState,
        validations
      };
    }
    default:
      throw new Error();
  }
}

function WafoForm({
  children,
  values,
  onSubmit,
  formId,
  buttonText,
  locale,
  ignoreEmpty
}) {
  const [state, dispatch] = React.useReducer(reducer, {
    form: {},
    validations: {}
  });

  React.useEffect(() => {
    // Setup or rebuilding form state on form changes.
    dispatch({
      type: "reset",
      payload: {
        children,
        initialValues: values
      }
    });
  }, [children, values]);

  React.useEffect(() => {
    setLocale(locale);
  }, [locale]);

  function handleOnChange(event, group) {
    const { target } = event;
    const { name, value, attributes } = target || event;

    if ((attributes && !attributes.ignoreinput) || !attributes) {
      const { validations } = group.reduce((accumulator, key) => {
        return {
          form: accumulator.form[key],
          validations: accumulator.validations[key]
        };
      }, state);

      const validation = validateField(value, validations[name]);

      dispatch({
        type: "inputChange",
        payload: {
          group,
          name,
          input: {
            value,
            touched: true,
            valid: validation.valid,
            errors: validation.errors
          }
        }
      });
    }
  }

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const results = validateForm(
      { state: state.form },
      state.validations,
      ignoreEmpty
    );

    dispatch({
      type: "formChange",
      payload: results.formState
    });
    onSubmit({ ...results.form, valid: results.valid }, results.formValues);
  }

  function prepareRender(children, group = []) {
    try {
      if (!Object.keys(state.form).length) return children;
      return React.Children.map(children, child => {
        if (
          !child ||
          !child.props ||
          !Object.prototype.hasOwnProperty.call(child.props, "name") ||
          Object.prototype.hasOwnProperty.call(child.props, "ignoreinput")
        ) {
          if (child && child.props && child.props.children) {
            const g =
              child.props.groupname !== undefined &&
              child.props.groupname !== null
                ? [...group, child.props.groupname]
                : group;
            const nestedChildren = prepareRender(child.props.children, g);
            return React.cloneElement(child, [], [nestedChildren]);
          }
          return child;
        }

        const name = child.props.name;
        const inputState = !group.length
          ? state.form[name]
          : group.reduce((accumulator, key) => {
              return accumulator[key];
            }, state.form)[name];

        if (!inputState) return child;

        const { value, valid, touched, errors } = inputState;

        const customErrors = Object.prototype.hasOwnProperty.call(
          child.props,
          "customErrors"
        );

        return React.cloneElement(child, {
          ...(child.props.handleChange && {
            handleInputChange: event => {
              // Add the group keys alongside the event.
              handleOnChange(event, group);
            }
          }),
          ...(!child.props.locale && { locale }),
          value,
          groupKey: group,
          valid: customErrors ? false : valid,
          touched: customErrors ? true : touched,
          errors: customErrors
            ? [...errors, ...child.props.customErrors]
            : errors
        });
      });
    } catch (error) {
      console.error("WafoForm: Render error");
      console.error(error);
      return null;
    }
  }

  const renderChildren = prepareRender(children);

  return (
    <form
      id={formId}
      className={`wafo-form ${styles["wafo-form"]}`}
      onSubmit={handleSubmit}
    >
      <div className="row">{renderChildren}</div>
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
    () => null
  ]).isRequired,
  values: PropTypes.any,
  onSubmit: PropTypes.func,
  formId: PropTypes.string,
  buttonText: PropTypes.string,
  locale: PropTypes.string,
  ignoreEmpty: PropTypes.bool
};

WafoForm.defaultProps = {
  values: undefined,
  onSubmit: f => f,
  formId: "wafoform",
  buttonText: "",
  locale: "en",
  ignoreEmpty: false
};

export default WafoForm;
