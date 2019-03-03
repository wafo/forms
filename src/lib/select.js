import React from 'react';
import PropTypes from 'prop-types';

const WafoFormSelect = ({
  customClass, name, label, defaultValue, options, extraProps,
  value, handleInputChange, valid, touched, errors,
}) => (
  <div className={`form-group wafo-input ${customClass}`}>
    {label && <label htmlFor={name}>{label}</label>}
    <select
      className="form-control"
      name={name}
      value={value}
      onChange={handleInputChange}
      {...extraProps}
    >
      <option value="" disabled>{defaultValue}</option>
      {
        options.map(option => (
          <option key={option.value} value={option.value}>{option.display}</option>
        ))
      }
    </select>
    {!valid && touched
      && (
        <ul className="errors">
          {errors.map(error => (<li key={error.error}>{error.message}</li>))}
        </ul>
      )
    }
  </div>
);

WafoFormSelect.propTypes = {
  customClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    display: PropTypes.node,
  })),
  extraProps: PropTypes.any,
  value: PropTypes.string,
  handleInputChange: PropTypes.func,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any),
  validations: PropTypes.shape({
    required: PropTypes.bool,
    pattern: PropTypes.object,
  }),
};

WafoFormSelect.defaultProps = {
  customClass: '',
  label: undefined,
  defaultValue: 'Select an option',
  options: [],
  extraProps: {},
  value: '',
  handleInputChange: f => f,
  valid: false,
  touched: false,
  errors: [],
  validations: {},
};

export default WafoFormSelect;
