import React from "react";
import PropTypes from "prop-types";
import useClickOutside from "../../hooks/useClickOutside";
import styles from "../../styles.module.css";

const WafoFormAutocomplete = ({
  name,
  customClass,
  label,
  placeholder,
  extraProps,
  value,
  handleInputChange,
  valid,
  touched,
  errors,
  children,
  locale,
  // Autocomplete
  items,
  renderItem,
  renderInput,
  filterItems,
  onSelectCallback,
  onQueryChange
}) => {
  const [cursor, setCursor] = React.useState(-1);
  const [dropdown, setDropdown] = React.useState(false);
  // const toggleDropdown = () => setDropdown(dd => !dd);

  const clickRef = useClickOutside(dropdown, () => {
    setDropdown(false);
    setCursor(-1);
  });

  const listRef = React.useRef();

  React.useEffect(() => {
    if (!dropdown && value && typeof value === "string") {
      handleInputChange({
        name,
        value: ""
      });
    }
  }, [dropdown, handleInputChange, name, value]);

  React.useEffect(() => {
    if (listRef.current && listRef.current.children[cursor]) {
      listRef.current.children[cursor].focus();
    }
  }, [cursor]);

  const onInputFocus = event => {
    event.target.select();
    setDropdown(true);
    if (typeof value !== "object") {
      onQueryChange("");
    }
  };

  const onItemSelect = item => {
    setDropdown(false);
    handleInputChange({
      name,
      value: item
    });
    onSelectCallback(item);
  };

  const handleKeys = event => {
    if (suggestions.length > 0) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (cursor === -1) {
            setCursor(0);
          } else if (cursor + 1 < suggestions.length) {
            setCursor(prev => prev + 1);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (cursor > 0 && cursor - 1 >= 0) {
            setCursor(prev => prev - 1);
          }
          break;
        case "Enter":
          if (cursor !== -1) {
            onItemSelect(suggestions[cursor]);
          }
          break;
        case "Escape":
          setDropdown(false);
          setCursor(-1);
          if (typeof value === "string") {
            handleInputChange({
              name,
              value: ""
            });
          }
          break;
        default:
          break;
      }
    }
  };

  const handleBlur = () => {
    // Se removió por problemas con las sugerencias y click. Se reemplazo por el useEffect.
    /* if (typeof value === 'string') {
      handleInputChange({
        name,
        value: '',
      });
    } */
  };

  const handleOnChange = change => {
    onQueryChange(change.target.value);
    handleInputChange(change);
  };

  const queryValue = React.useMemo(() => {
    if (typeof value === "object") {
      return renderInput(value);
    }
    return value;
  }, [value, renderInput]);

  const suggestions = React.useMemo(() => {
    if (typeof value === "string") {
      return filterItems(items, value);
    }
    return items;
  }, [items, value, filterItems]);

  return (
    <div ref={clickRef} className={`wafo-wrapper ${customClass}`}>
      <div className={`wafo-input form-group ${styles.autocomplete}`}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type="text"
          className="form-control"
          name={name}
          placeholder={placeholder}
          value={queryValue}
          onChange={handleOnChange}
          onClick={onInputFocus}
          onKeyDown={handleKeys}
          onBlur={handleBlur}
          autoComplete="off"
          {...extraProps}
        />
        {dropdown && (
          <div className={`wafoformautocomplete-list-wrapper ${styles["autocomplete-wrapper"]}`}>
            {/** TODO: Cambiar este id por clase, no se deben repetir ids... */}
            {suggestions.length > 0 && (
              <ul ref={listRef} className="wafoformautocomplete-list">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    tabIndex="-1"
                    onKeyDown={handleKeys}
                    onClick={() => onItemSelect(item, i)}
                  >
                    {renderItem(item)}
                  </li>
                ))}
              </ul>
            )}
            <div
              className={`wafoformautocomplete-footer ${styles["autocomplete-footer"]}`}
            >
              {/** TODO: Hotfix super cochino. */}
              <span>
                {locale === "es" && (
                  <React.Fragment>
                    Mostrando {suggestions.length} de {items.length} elementos
                  </React.Fragment>
                )}
                {(locale === "en" || locale !== "es") && (
                  <React.Fragment>
                    Showing {suggestions.length} of {items.length} items
                  </React.Fragment>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
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

WafoFormAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  extraProps: PropTypes.any,
  value: PropTypes.any,
  handleInputChange: PropTypes.func,
  validations: PropTypes.object,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element).isRequired,
    PropTypes.element.isRequired,
    () => null
  ]),
  locale: PropTypes.string,
  // Autocomplete
  items: PropTypes.array,
  renderItem: PropTypes.func,
  renderInput: PropTypes.func,
  filterItems: PropTypes.func,
  onSelectCallback: PropTypes.func,
  onQueryChange: PropTypes.func
};

WafoFormAutocomplete.defaultProps = {
  handleInputChange: f => f,
  valid: false,
  touched: false,
  errors: [],
  children: null,
  validations: {},
  locale: "",
  items: [],
  renderItem: item => (typeof item === "string" ? item : "Item option"),
  renderInput: item => (typeof item === "string" ? item : "Item selected"),
  filterItems: f => f,
  onSelectCallback: f => f,
  onQueryChange: f => f
  // filterItems: (items, query) => items.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1),
};

export default WafoFormAutocomplete;
