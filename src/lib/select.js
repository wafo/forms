import React from 'react';
import styles from './styles';

/**
 * @typedef options
 * @type {Object}
 * @property {string} value the value the select returns.
 * @property {string} display the text the option will show.
 */

/**
 * @param {string} customClass html class
 * @param {string} name name for the input and key to the state of the form
 * @param {string} label text for the label
 * @param {string} defaultValue default field
 * @param {options} options array of options for the select
 * @param {string} value the value of the select
 * @param {function} handleInputChange runs when the value changes
 * @param {boolean} valid based on validations
 * @param {boolean} touched true if the value has changed
 * @param {array} errors array of errors. Check validation.js
 */
const WafoFormSelect = ({
  customClass = '', name, label = undefined, defaultValue = 'Selecciona una opción', options = [],
  value = '', handleInputChange = f => f, valid = false, touched = false, errors = [],
}) => (
  <div className={`form-group wafo-input ${customClass}`} style={styles['form-group']}>
    {label && <label htmlFor={name} style={styles.label}>{label}</label>}
    <select
      className="form-control"
      style={styles['form-control']}
      name={name}
      value={value}
      onChange={handleInputChange}
    >
      <option value="" disabled>{defaultValue}</option>
      {
        options.map(option => (
          <option key={option.value} value={option.value}>{option.display}</option>
        ))
      }
    </select>
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

export default WafoFormSelect;
