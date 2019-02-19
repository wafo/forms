import React from 'react';

/**
 * @typedef Props
 * @type {object}
 * @property {string} customClass html class
 * @property {string} name name for the input and key to the state of the form
 * @property {string} label text for the label
 * @property {string} placeholder text that shows on the input
 * @property {string} value the value of wafo form for this autocomplete
 * @property {function} handleInputChange runs when the value changes
 * @property {boolean} valid based on validations
 * @property {boolean} touched true if the value has changed
 * @property {array} errors array of errors. Check validation.js
 * @property {func} filterItemsFN this function filters the items array
 * @property {func} customInputFN this function returns whats going to show inside input on selection
 * @property {func} customItemFN this functions returns whats going to show for each item in the list
 * @property {boolean} onBlurClear if everything should be cleared on blur or not.
 */

const defaultState = {
  query: '',
  suggestions: [],
  cursor: -1,
  selected: '',
};

export default class WafoFormAutocomplete extends React.Component {
  state = {
    ...defaultState,
  };

  handleQueryChange = (event) => {
    const { items, filterItemsFN = this.filterItems } = this.props;
    const { target: { value } } = event;

    if (value.length === 0) {
      return this.setState({
        ...defaultState,
      }, this.sendToWafoForm);
    }

    const suggestions = filterItemsFN(items, value.toLowerCase());

    return this.setState({
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

  handleQueryBlur = (event) => {
    const { relatedTarget } = event;
    const { selected } = this.state;
    const { onBlurClear } = this.props;

    if (
      (!relatedTarget || (relatedTarget && relatedTarget.tagName !== 'LI'))
      && onBlurClear
      && !selected
    ) {
      this.setState({ ...defaultState });
    }
  }

  itemSelected = (item) => {
    const { customInputFN = this.customInput } = this.props;
    this.setState({
      ...defaultState,
      query: customInputFN(item),
      selected: item,
    }, this.sendToWafoForm);
  }

  sendToWafoForm = () => {
    const { name, handleInputChange } = this.props;
    const { selected } = this.state;

    handleInputChange({
      target: {
        name,
        value: selected,
      },
    });
  }

  /**
   * Default function to filter the items.
   * @param {array} items string or any.
   * @param {string} query string from the input.
   */
  filterItems = (items, query) => items.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1);

  /**
   * Returns whats going to show as the input value, once an item is selected.
   * @param {any} item the item selected
   */
  customInput = item => (typeof item === 'string' ? item : 'Item selected');

  /**
   * Returns whats going to show for each item in the list.
   * @param {any} item the item to display.
   */
  customItem = item => (typeof item === 'string' ? item : 'Item option');

  render() {
    const { query, suggestions } = this.state;
    const {
      customClass = '', name, label = undefined, placeholder = '',
      valid = false, touched = false, errors = [], customItemFN = this.customItem,
    } = this.props;

    return (
      <div className="wafoformautocomplete">
        <div className={`form-group wafo-input ${customClass}`}>
          {label && <label htmlFor={name}>{label}</label>}
          <input
            type="text"
            className="form-control"
            name={name}
            placeholder={placeholder}
            value={query}
            onChange={this.handleQueryChange}
            onKeyDown={this.handleKeys}
            onBlur={this.handleQueryBlur}
            onClick={(e) => { e.target.select(); }}
            autoComplete="off"
          />
        </div>
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
              handleBlur={this.handleQueryBlur}
              onSelected={this.itemSelected}
              customItem={customItemFN}
            />
          )
        }
      </div>
    );
  }
}

/** Lista de sugerencias */

const Suggestions = ({
  suggestions, handleKeys, handleBlur, onSelected, customItem,
}) => {
  const list = suggestions.map((item, index) => (
    <li key={index} tabIndex="-1" onKeyDown={handleKeys} onBlur={handleBlur} onClick={() => { onSelected(item); }}>
      {customItem(item)}
    </li>
  ));

  return (
    <div className="results">
      <ul id="wafoformautocomplete-list">
        {list}
      </ul>
    </div>
  );
};
