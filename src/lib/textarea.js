import React from 'react';
import styles from './styles';

/**
 * @param {string} customClass html class
 * @param {string} name name for the input and key to the state of the form
 * @param {string} label text for the label
 * @param {string} placeholder text that shows on the input
 * @param {string} value the value of the select
 * @param {function} handleInputChange runs when the value changes
 * @param {boolean} valid based on validations
 * @param {boolean} touched true if the value has changed
 * @param {array} errors array of errors. Check validation.js
 */
const WafoFormTextArea = ({
  customClass = '', name, label = undefined, placeholder = '',
  value = '', handleInputChange = f => f, valid = false, touched = false, errors = [],
}) => (
  <div className={`form-group wafo-input ${customClass}`} style={styles['form-group']}>
    {label && <label htmlFor={name} style={styles.label}>{label}</label>}
    <textarea
      className="form-control"
      name={name}
      style={styles['form-control']}
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

export default WafoFormTextArea;
