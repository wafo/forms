import React from 'react';
import PropTypes from 'prop-types';

const WafoFormInput = ({
  type, customClass, name, label, placeholder, extraProps,
  value, handleInputChange, valid, touched, errors,
}) => (
  <div className={`form-group wafo-input ${customClass}`}>
    {label && <label htmlFor={name}>{label}</label>}
    <input
      type={type}
      className="form-control"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      {...extraProps}
    />
    {!valid && touched
        && (
          <ul className="errors">
            {errors.map(error => (<li key={error.error}>{error.message}</li>))}
          </ul>
        )
      }
  </div>
);

WafoFormInput.propTypes = {
  wafoformelement: PropTypes.bool,
  type: PropTypes.string,
  customClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
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

WafoFormInput.defaultProps = {
  wafoformelement: true,
  type: 'text',
  customClass: '',
  label: undefined,
  placeholder: '',
  extraProps: {},
  value: '',
  handleInputChange: f => f,
  valid: false,
  touched: false,
  errors: [],
  validations: {},
};

export default WafoFormInput;
