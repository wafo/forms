import React from 'react';
import PropTypes from 'prop-types';

const WafoFormTextArea = ({
  customClass, name, label, placeholder,
  value, handleInputChange, valid, touched, errors,
}) => (
  <div className={`form-group wafo-input ${customClass}`}>
    {label && <label htmlFor={name}>{label}</label>}
    <textarea
      className="form-control"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
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

WafoFormTextArea.propTypes = {
  customClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
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

WafoFormTextArea.defaultProps = {
  customClass: '',
  label: undefined,
  placeholder: '',
  value: '',
  handleInputChange: f => f,
  valid: false,
  touched: false,
  errors: [],
  validations: {},
};

export default WafoFormTextArea;
