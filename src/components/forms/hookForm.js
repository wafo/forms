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

function setUpState({
  children,
  state,
  initialValues,
  childrenKeys = [],
  group = false
}) {
  let newState = state;
  let keys = childrenKeys;
  let validations = {};

  // Setting up state object.
  React.Children.forEach(children, child => {
    if (child && child.props) {
      if (child.props.groupName) {
        const {
          // keys: keysFragment,
          newState: stateFragment,
          validations: validationsFragment
        } = setUpState({
          children: child.props.children,
          state: {},
          initialValues: {},
          group: child.props.groupName
        });

        keys = [...keys, child.props.groupName];
        newState = {
          ...newState,
          [child.props.groupName]: { ...stateFragment, isGroup: true }
        };
        validations = {
          ...validations,
          [child.props.groupName]: validationsFragment
        };
      }
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
      if (child.props.children && !child.props.groupName) {
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

        keys = [...keys, ...keysFragment];
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
      const isGroup = !!action.payload.group;
      return {
        ...state,
        form: {
          ...state.form,
          ...(isGroup
            ? {
                [action.payload.group]: {
                  ...state.form[action.payload.group],
                  [action.payload.name]: {
                    ...state.form[action.payload.name],
                    ...action.payload.input
                  }
                }
              }
            : {
                [action.payload.name]: {
                  ...state.form[action.payload.name],
                  ...action.payload.input
                }
              })
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

      // TODO: How to remove elements from groups
      console.log(keys);
      // Removing elements from state object that are no longer in the form.
      // This is outside of the set up function because of recursion
      Object.keys(newState).forEach(key => {
        if (keys.findIndex(x => x === key) === -1) {
          delete newState[key];
        }
      });
      return {
        ...state,
        form: newState,
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

    const inState = group ? !!state.form[group][name] : !!state.form[name];
    const inValidations = group
      ? !!state.validations[group][name]
      : !!state.validations[name];

    if (
      inState &&
      inValidations &&
      ((attributes && !attributes.ignoreinput) || !attributes)
    ) {
      const iValidations = group
        ? state.validations[group][name]
        : state.validations[name];
      const validation = validateField(value, iValidations);

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

    const form = { valid: true };
    const formValues = {};
    const formState = {};

    function checkInput(inputState, validations) {
      const validation = validateField(inputState.value, validations);
      if (!validation.valid) {
        form.valid = false;
      }

      return {
        value: inputState.value,
        valid: validation.valid,
        errors: validation.errors,
        touched: true
      };
    }

    Object.keys(state.form).forEach(key => {
      let { [key]: inputState } = state.form;
      const isGroup = inputState.isGroup;

      let testedValue = null;
      if (isGroup) {
        Object.keys(inputState)
          .filter(x => x !== "isGroup")
          .forEach(childKey => {
            testedValue = {
              ...testedValue,
              [childKey]: checkInput(
                inputState[childKey],
                state.validations[key][childKey]
              )
            };
          });
        form[key] = { ...testedValue };
        formState[key] = { ...inputState, ...testedValue };
        
        Object.entries(testedValue).forEach(([childKey, x]) => {
          if (!ignoreEmpty || (ignoreEmpty && x.value)) {
            formValues[key] = {
              ...formValues[key],
              [childKey]: x.value
            };
          }
        });
      } else {
        testedValue = checkInput(inputState, state.validations[key]);
        form[key] = { ...testedValue };
        formState[key] = { ...testedValue };

        if (!ignoreEmpty || (ignoreEmpty && inputState.value)) {
          formValues[key] = inputState.value;
        }
      }
    });

    dispatch({
      type: "formChange",
      payload: formState
    });
    onSubmit(form, formValues);
  }

  function prepareRender(children, group) {
    return React.Children.map(children, child => {
      if (
        !child ||
        !child.props ||
        (!group && !state.form[child.props.name]) ||
        (group &&
          (!state.form[group] || !state.form[group][child.props.name])) ||
        !Object.prototype.hasOwnProperty.call(child.props, "name") ||
        Object.prototype.hasOwnProperty.call(child.props, "ignoreinput")
      ) {
        if (child && child.props && child.props.children) {
          const nestedChildren = prepareRender(
            child.props.children,
            child.props.groupName || group
          );
          return React.cloneElement(child, [], [nestedChildren]);
        }
        return child;
      }

      // If group check state inside group.
      const input = group
        ? state.form[group][child.props.name]
        : state.form[child.props.name];
      const { value, valid, touched, errors } = input;

      const hasCustomErrors = Object.prototype.hasOwnProperty.call(
        child.props,
        "customErrors"
      );

      return React.cloneElement(child, {
        ...(child.props.handleChange && {
          handleInputChange: event => {
            // Add the group key alongside the event.
            handleOnChange(event, group);
          }
        }),
        ...(!child.props.locale && { locale }),
        value,
        groupKey: group,
        valid: hasCustomErrors ? false : valid,
        touched: hasCustomErrors ? true : touched,
        errors: hasCustomErrors
          ? [...errors, ...child.props.customErrors]
          : errors
      });
    });
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
