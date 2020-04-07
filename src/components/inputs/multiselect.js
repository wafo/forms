import React from "react";
import PropTypes from "prop-types";
import useClickOutside from "../../hooks/useClickOutside";
import CaretUp from "../../assets/caret-up-solid.svg";
import CaretDown from "../../assets/caret-down-solid.svg";
import Square from "../../assets/square-regular.svg";
import CheckSquare from "../../assets/check-square-regular.svg";
import styles from "../../styles.module.css";

const WafoFormMultiSelect = ({
  name,
  customClass,
  label,
  placeholder,
  items,
  itemKey,
  renderItem,
  renderInput,
  value,
  handleInputChange,
  valid,
  touched,
  errors,
  children
}) => {
  const [dropdown, setDropdown] = React.useState(false);
  const toggleDropdown = () => setDropdown(dd => !dd);

  const clickRef = useClickOutside(dropdown, () => {
    toggleDropdown();
  });

  const handleItemClick = item => {
    const index = Array.isArray(value)
      ? value.findIndex(x => x[itemKey] === item[itemKey])
      : -1;
    if (index !== -1) {
      const dummy = [...value.slice(0, index), ...value.slice(index + 1)];
      handleInputChange({
        name,
        value: dummy
      });
    } else {
      const dummy = [...value];
      dummy.push(item);
      handleInputChange({
        name,
        value: dummy
      });
    }
  };

  const display = React.useMemo(() => {
    let inputDisplay = "";
    const itemsDisplay = [...items];
    if (Array.isArray(value)) {
      itemsDisplay.forEach((item, i) => {
        if (value.findIndex(x => x[itemKey] === item[itemKey]) !== -1) {
          inputDisplay += `${renderInput(item)}, `;
          itemsDisplay[i].wafoSelected = true;
        } else {
          itemsDisplay[i].wafoSelected = false;
        }
      });
    }
    return {
      inputDisplay,
      itemsDisplay
    };
  }, [items, itemKey, renderInput, value]);

  return (
    <div
      ref={clickRef}
      className={`wafo-input form-group ${styles.multiselect} ${customClass}`}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <div className={`${styles['multiselect-input-wrapper']} ${dropdown && "down"}`}>
        <input
          type="text"
          id={name}
          name={name}
          placeholder={placeholder}
          className="form-control"
          value={display.inputDisplay}
          onClick={toggleDropdown}
          readOnly
        />
        <button
          type="button"
          className="btn btn-light"
          onClick={toggleDropdown}
        >
          {dropdown ? (
            <img src={CaretUp} alt="icon" className={styles.svg} />
          ) : (
            <img src={CaretDown} alt="icon" className={styles.svg} />
          )}
        </button>
      </div>
      {dropdown && (
        <div className={styles['multiselect-list-wrapper']}>
          {items.length > 0 && (
            <ul>
              {display.itemsDisplay.map((item, i) => (
                <li key={i} onClick={() => handleItemClick(item)}>
                  <span>{renderItem(item)}</span>
                  {item.wafoSelected ? (
                    <img src={CheckSquare} alt="icon" className={styles.svg} />
                  ) : (
                    <img src={Square} alt="icon" className={styles.svg} />
                  )}
                </li>
              ))}
            </ul>
          )}
          {items.length === 0 && (
            <div className={styles['multiselect-list-empty']}>
              <div>Sin elementos a elegir</div>
            </div>
          )}
        </div>
      )}
      {children}
      {!valid && touched && (
        <ul className="errors">
          {errors.map(error => (
            <li key={error.error}>{error.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

WafoFormMultiSelect.propTypes = {
  name: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  itemKey: PropTypes.string,
  renderItem: PropTypes.func,
  renderInput: PropTypes.func,
  value: PropTypes.any,
  handleInputChange: PropTypes.func,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element).isRequired,
    PropTypes.element.isRequired,
    () => null
  ])
};

WafoFormMultiSelect.defaultProps = {
  customClass: "",
  label: "",
  placeholder: "",
  items: [],
  itemsKey: "id",
  renderItem: item => (typeof item === "string" ? item : "Item option"),
  renderInput: item => (typeof item === "string" ? item : "Item option"),
  value: false,
  handleInputChange: f => f,
  valid: false,
  touched: false,
  errors: [],
  children: null
};

export default WafoFormMultiSelect;
