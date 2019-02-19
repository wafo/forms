import React from 'react';
import { WafoForm, WafoFormAutocomplete } from '../../../lib';

const items = [
  {
    id_overseer: 0,
    name: 'Lalocion',
    last_name: 'string',
    email: 'string',
    disabled: true,
    createdAt: 'string',
    updatedAt: 'string',
  },
  {
    id_overseer: 0,
    name: 'Lalocomotora',
    last_name: 'string',
    email: 'string',
    disabled: true,
    createdAt: 'string',
    updatedAt: 'string',
  },
  {
    id_overseer: 0,
    name: 'Lalobuki',
    last_name: 'string',
    email: 'wafo@gmail.com',
    disabled: true,
    createdAt: 'string',
    updatedAt: 'string',
  },
];

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
            onBlurClear={false}
            validations={{ required: true }}
          />

        </WafoForm>
      </div>
    );
  }
}
