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
  // Setting up state object.
  React.Children.forEach(children, (child) => {
    if (child && child.props) {
      if (child.props.name && !child.props.ignoreinput) {
        keys = [...keys, child.props.name];
      }
      // if child is not already on state
      if ((child.props.name && !child.props.ignoreinput) && !newState[child.props.name]) {
        newState = {
          ...newState,
          [child.props.name]: {
            ...initialInputState,
            // Checking if initial value exists
            value: (initialValues && initialValues[child.props.name]) ? initialValues[child.props.name] : initialInputState.value,
          },
        };
      }
      // if child has childrens
      if (child.props.children) {
        const { newState: stateFragment, keys: keysFragment } = setUpState({
          children: child.props.children,
          state: {},
          initialValues,
          childrenKeys: [],
        });
        newState = { ...newState, ...stateFragment };
        keys = [...keys, ...keysFragment];
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
  return { newState, keys };
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset': {
      const { newState } = setUpState({
        state,
        ...action.payload,
      });
      return newState;
    }
    default:
      throw new Error();
  }
}

function TestForm({ children, initialValues }) {
  const [state, dispatch] = React.useReducer(reducer, {});

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
      if (!child || !state[child.props.name] || !Object.prototype.hasOwnProperty.call(child.props, 'name') || !Object.prototype.hasOwnProperty.call(child.props, 'ignoreinput')) {
        if (child || child.props || child.props.children) {
          const test = prepareRender(child.props.children);
          // How to alter nested children ?
        }
        return child;
      }
  
      const { [child.props.name]: { value, valid, touched, errors } } = state;
  
      return React.cloneElement(child, {
        value,
        valid,
        touched,
        errors,
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
