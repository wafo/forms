import React from 'react';
import PropTypes from 'prop-types';

const defaultState = {
  query: '',
  suggestions: [],
  cursor: -1,
  selected: '',
};

export default class WafoFormAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    if (props.value) {
      this.state = {
        ...defaultState,
        query: props.customInputFN(props.value) || '',
        selected: props.value,
      };
    } else {
      this.state = {
        ...defaultState,
      };
    }
  }

  handleQueryChange = (event) => {
    const { selected } = this.state;
    const { items, filterItemsFN } = this.props;
    const { target: { value } } = event;

    if (value.length === 0 && selected) {
      this.setState({
        ...defaultState,
      }, this.sendToWafoForm);
    }

    const suggestions = filterItemsFN(items, value.toLowerCase());

    this.setState({
      query: value,
      suggestions,
      cursor: -1,
    });
  }

  handleKeys = (event) => {
    const { suggestions, cursor } = this.state;
    if (suggestions.length === 0) { return; }
    const ul = document.getElementById('wafoformautocomplete-list');
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (cursor === -1) {
          ul.childNodes[0].focus();
          this.setState({ cursor: 0 });
        } else if ((cursor + 1) < ul.childNodes.length) {
          ul.childNodes[cursor + 1].focus();
          this.setState({ cursor: cursor + 1 });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (cursor > 0) {
          if ((cursor - 1) >= 0) {
            ul.childNodes[cursor - 1].focus();
            this.setState({ cursor: cursor - 1 });
          }
        }
        break;
      case 'Enter':
        if (cursor !== -1) {
          ul.childNodes[cursor].click();
        }
        break;
      case 'Escape':
        this.setState({ ...defaultState });
        break;
      default: break;
    }
  }

  handleBlur = (event) => {
    const { relatedTarget } = event;
    const { selected } = this.state;
    const { onBlurClear, customInputFN } = this.props;

    if (
      (!relatedTarget || (relatedTarget && relatedTarget.tagName !== 'LI'))
      && !selected
      && onBlurClear
    ) {
      this.setState({ ...defaultState }, this.sendToWafoForm);
    } else if (
      selected
      && (!relatedTarget || (relatedTarget && relatedTarget.tagName !== 'LI'))
      && onBlurClear
    ) {
      this.setState(prevState => ({
        ...prevState,
        query: customInputFN(prevState.selected),
        suggestions: [],
        cursor: -1,
      }));
    }
  }

  itemSelected = (item) => {
    const { customInputFN } = this.props;
    this.setState({
      ...defaultState,
      query: customInputFN(item),
      selected: item,
    }, this.sendToWafoForm);
  }

  onInputFocus = (event) => {
    event.target.select();
    const { query } = this.state;
    this.handleQueryChange({
      target: {
        value: query,
      },
    });
  }

  sendToWafoForm = () => {
    const { name, handleInputChange, onSelectCallback } = this.props;
    const { selected } = this.state;

    handleInputChange({
      target: {
        name,
        value: selected,
      },
    });
    // callback que puede ser disparado desde fuera de wafoforms al seleccionar algo.
    onSelectCallback(selected);
  }

  clearForm = () => this.setState({
    ...defaultState,
  }, this.sendToWafoForm);

  render() {
    const { query, suggestions } = this.state;
    const {
      customClass, name, label, placeholder, extraProps,
      valid, touched, errors, customItemFN, itemsLimit, showLimit,
    } = this.props;

    return (
      <div className={`wafoformautocomplete form-group wafo-input ${customClass}`}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type="text"
          className="form-control"
          name={name}
          placeholder={placeholder}
          value={query}
          onChange={this.handleQueryChange}
          onKeyDown={this.handleKeys}
          onBlur={this.handleBlur}
          onClick={this.onInputFocus}
          autoComplete="none"
          {...extraProps}
        />
        {!valid && touched
          && (
            <ul className="errors">
              {errors.map(error => (<li key={error.error}>{error.message}</li>))}
            </ul>
          )
        }
        {
          suggestions.length > 0
          && (
            <Suggestions
              suggestions={suggestions}
              handleKeys={this.handleKeys}
              handleBlur={this.handleBlur}
              onSelected={this.itemSelected}
              customItem={customItemFN}
              itemsLimit={itemsLimit}
              showLimit={showLimit}
            />
          )
        }
      </div>
    );
  }
}

WafoFormAutocomplete.propTypes = {
  customClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  extraProps: PropTypes.any,
  value: PropTypes.any,
  handleInputChange: PropTypes.func,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.any),
  validations: PropTypes.any,
  // autocomplete
  items: PropTypes.arrayOf(PropTypes.any),
  filterItemsFN: PropTypes.func,
  customInputFN: PropTypes.func,
  customItemFN: PropTypes.func,
  onBlurClear: PropTypes.bool,
  itemsLimit: PropTypes.number,
  showLimit: PropTypes.bool,
};

WafoFormAutocomplete.defaultProps = {
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
  // autocomplete
  items: [],
  filterItemsFN: (items, query) => items.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1),
  customInputFN: item => (typeof item === 'string' ? item : 'Item selected'),
  customItemFN: item => (typeof item === 'string' ? item : 'Item option'),
  onBlurClear: true,
  itemsLimit: 5,
  showLimit: true,
};

/** Lista de sugerencias */

const Suggestions = ({
  suggestions, handleKeys, handleBlur, onSelected, customItem, itemsLimit, showLimit,
}) => {
  const list = suggestions.slice(0, itemsLimit).map((item, index) => (
    <li key={index} tabIndex="-1" onKeyDown={handleKeys} onBlur={handleBlur} onClick={() => { onSelected(item); }}>
      {customItem(item)}
    </li>
  ));

  return (
    <div className="results">
      <ul id="wafoformautocomplete-list">
        {list}
        {showLimit && (
          <li className="footer">
            <span>Showing {list.length} of {suggestions.length} matches</span>
          </li>
        )}
      </ul>
    </div>
  );
};

Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.any),
  handleKeys: PropTypes.func,
  handleBlur: PropTypes.func,
  onSelected: PropTypes.func,
  customItem: PropTypes.func,
  itemsLimit: PropTypes.number,
  showLimit: PropTypes.bool,
};

Suggestions.defaultProps = {
  suggestions: [],
  handleKeys: f => f,
  handleBlur: f => f,
  onSelected: f => f,
  customItem: f => f,
  itemsLimit: 5,
  showLimit: true,
};
