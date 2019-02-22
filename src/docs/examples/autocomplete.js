import React from 'react';
import { WafoForm, WafoFormAutocomplete } from '../../../lib';

const items = [
  {
    id: 1,
    name: 'Lalo',
    email: 'lalo@gmail.com',
  },
  {
    id: 2,
    name: 'Lalocion',
    email: 'lalocion@gmail.com',
  },
  {
    id: 3,
    name: 'Lalocomotora',
    email: 'lalocomotora@gmail.com',
  },
  {
    id: 4,
    name: 'Lalocura',
    email: 'lalocura@gmail.com',
  },
  {
    id: 5,
    name: 'Laloteria',
    email: 'laloteria@gmail.com',
  },
  {
    id: 6,
    name: 'Laloma',
    email: 'laloma@gmail.com',
  },
  {
    id: 7,
    name: 'Wafo',
    email: 'wafo@gmail.com',
  },
  {
    id: 8,
    name: 'Gaytan',
    email: 'gaytan@gmail.com',
  },
  {
    id: 9,
    name: 'Saul',
    email: 'saul@gmail.com',
  },
  {
    id: 10,
    name: 'Jorge',
    email: 'jorge@gmail.com',
  },
];

export default class AutocompleteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        exampleautocomplete: '',
      },
    };

    this.autocomplete = React.createRef();
  }

  filterItems = (itemsToFilter, query) => itemsToFilter.filter(item => item.name.toLowerCase().indexOf(query) !== -1);

  customInput = item => item.name;

  customItem = item => (
    <p style={{ margin: '0' }}>
      <span>{item.name}</span>
      <br />
      <span>{item.email}</span>
    </p>
  );

  handleChange = ({ target: { value } }) => this.setState({ form: { exampleautocomplete: value } });

  clear = () => {
    this.autocomplete.current.clearForm();
  }

  render() {
    const { form } = this.state;

    return (
      <div className="autocomplete-form">

        <WafoFormAutocomplete
          ref={this.autocomplete}
          name="exampleautocomplete"
          customClass="mycustomclass"
          label="Autocomplete"
          placeholder="Escribele compa..."
          items={items}
          filterItemsFN={this.filterItems}
          customInputFN={this.customInput}
          customItemFN={this.customItem}
          onBlurClear={false}
          value={form.exampleautocomplete}
          handleInputChange={this.handleChange}
        />

        <button type="button" onClick={this.clear}>Clear</button>
      </div>
    );
  }
}
