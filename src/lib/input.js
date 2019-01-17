import React from 'react';
import styles from './styles';

const WafoFormInput = ({
  type = 'text', customClass = '', name, label = undefined, placeholder = '',
  value = '', handleInputChange = f => f, valid = false, touched = false, errors = [],
}) => (
  <div className={`form-group wafo-input ${customClass}`} style={styles['form-group']}>
    {label && <label htmlFor={name} style={styles.label}>{label}</label>}
    <input
      type={type}
      className="form-control"
      style={styles['form-control']}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
    />
    {
      !valid && touched
      && (
        <div className="form-text error-message" style={{ ...styles['form-text'], ...styles['error-message'] }}>
          {
            errors.map(error => (
              <span key={error.error}>
                *
                {error.message}
              </span>
            ))
          }
        </div>
      )
    }
  </div>
);


export default WafoFormInput;
