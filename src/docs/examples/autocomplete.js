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

/* const items = ['Lalocion', 'Lalocomotora', 'Lalobuki', 'Lalocura', 'Lalobarredora']; */

export default class AutocompleteForm extends React.Component {
  handleFormSubmit = (form) => {
    console.log(form);
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

  render() {
    return (
      <div className="autocomplete-form">
        <WafoForm onSubmit={this.handleFormSubmit}>

          <WafoFormAutocomplete
            name="exampleautocomplete"
            customClass="mycustomclass"
            label="Autocomplete"
            placeholder="Escribele compa..."
            items={items}
            filterItemsFN={this.filterItems}
            customInputFN={this.customInput}
            customItemFN={this.customItem}
            validations={{ required: true }}
            onBlurClear={false}
          />

        </WafoForm>
      </div>
    );
  }
}
