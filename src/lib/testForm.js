import React from 'react';
import PropTypes from 'prop-types';

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
  React.Children.forEach(children, (child) => {
    if (child && child.props) {
      if (child.props.name && !child.props.ignoreinput) {
        keys = [...keys, child.props.name];
      }
      // if child is not already on state
      if ((child.props.name && !child.props.ignoreinput)) {
        if (!newState[child.props.name]) {
          newState = {
            ...newState,
            [child.props.name]: {
              ...initialInputState,
              // Checking if initial value exists
              value: (initialValues && initialValues[child.props.name]) ? initialValues[child.props.name] : initialInputState.value,
            },
          };
        }
        validations = {
          ...validations,
          [child.props.name]: child.props.validations || {},
        }
      }
      // if child has childrens
      if (child.props.children) {
        const { newState: stateFragment, keys: keysFragment, validations: validationsFragment } = setUpState({
          children: child.props.children,
          state: {},
          initialValues,
          childrenKeys: [],
        });
        newState = { ...newState, ...stateFragment };
        keys = [...keys, ...keysFragment];
        validations = { ...validations, ...validationsFragment};
      }
    }
  });
  // removing elements that no longer are in children.
  Object.keys(newState).forEach((key) => {
    if (keys.findIndex(x => x === key) === -1) {
      delete newState[key];
    }
  });
  // Returning state object and valid keys.
  return { newState, keys, validations };
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset': {
      const { newState, validations } = setUpState({
        state: state.form,
        ...action.payload,
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

function TestForm({ children, initialValues }) {
  const [state, dispatch] = React.useReducer(reducer, {form: {}, validations: {}});

  React.useEffect(() => {
    // Setup or rebuilding form state on form changes.
    dispatch({
      type: 'reset',
      payload: {
        children,
        initialValues,
      },
    });
  }, [children, initialValues]);

  const handleOnChange = (event) => {
    const { target: { name, value, attributes }, type } = event;
    if (!attributes.ignoreinput) {
      console.log(type, name, value);
    }
  };

  function prepareRender(children) {
    return React.Children.map(children, (child) => {
      if (!child || !state.form[child.props.name] || !Object.prototype.hasOwnProperty.call(child.props, "name") || Object.prototype.hasOwnProperty.call(child.props, 'ignoreinput')) {
        if (child && child.props && child.props.children) {
          return prepareRender(child.props.children);
        }
        return child;
      }
      
      const { [child.props.name]: { value, valid, touched, errors } } = state.form;
      const hasCustomErrors = Object.prototype.hasOwnProperty.call(child.props, 'customErrors');
  
      return React.cloneElement(child, {
        value,
        valid: hasCustomErrors ? false : valid,
        touched: hasCustomErrors ? true : touched,
        errors: hasCustomErrors ? [...errors, ...child.props.customErrors] : errors,
      });
    });
  }
  const renderChildren = prepareRender(children);

  return (
    <form onChange={handleOnChange}>
      {renderChildren}
    </form>
  );
}

TestForm.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]),
  initialValues: PropTypes.any,
};

TestForm.defaultProps = {
  children: null,
  initialValues: {},
};

export default TestForm;
