# Wafo-forms
UI Component made in React 16.8 and with one purpose in mind: To make my and my co-workers life easier.

## Demo
Click [Here](https://forms.wafo.dev/) to see the live demo page. It showcases the basic functionalities of the component and the example code for it.

## First steps

    $ npm install --save wafo-forms

**To-do:** Small description

### Dependencies
This component has 0 dependencies! (You need react and react-dom ^16.8).

> **Note:** The component is designed to be used with *[Bootstrap](https://getbootstrap.com/)* and although it is not required, it can benefit from it being included.

### Use example
This example shows one of the easiest way this component can be used. For more specific use cases, keep scrolling.

```javascript
import React from 'react';
import { WafoForm, WafoFormInput } from 'wafo-forms';

const ExampleComponent = () => {
	const handleSubmit = (form, values) => {
		// form returns values, validation info and more.
		// values is a simple object key: value.
	};
	
	return (
		<WafoForm buttonText="Submit" onSubmit={handleSubmit}>
			<WafoFormInput
				type="text"
				name="example"
				customClass="custom-class"
				placeholder="A placeholder"
				label="An input field"
			/>
		</WafoForm>
	);
};
```

## Components
Besides the main component [`WafoForm`](#wafoform), there are other components, the input components. The recomended way to use this components it is inside of the main component, however, it is posible to use them individually.

> **Note:** Using components outside of `WafoForm` is not recommended as most of the functionality is lost. In these cases it is recommended to use the default components. More information on forms in React [here](https://reactjs.org/docs/forms.html).

### WafoForm Element
For the sake of explaining how the components work we will refer to any `Component` that can be a child of [`WafoForm`](#wafoform) as a `WafoForm Element`. Most of the components included share a large part of their properties.

Besides the included components, you can create your own custom `Components` that work within [`WafoForm`](#wafoform), having a couple of considerations in mind. More information on this in [`Custom components`](#custom-components).

### WafoForm
The main component, is the equivalent to the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) tag of *HTML*. This component handles the *state*, *validations* and returning the *values* when we *submit* the form.

Example:
```javascript
import React from 'react';
import { WafoForm } from 'wafo-forms';

const Example = ({ handleFormSubmit }) => (
	<WafoForm
		buttonText="Submit"
		onSubmit={handleFormSubmit}
	>
		{/* Componentes hijos aqui... */}
	</WafoForm>
);
```

#### Props
| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| values | [Object](#object-values-and-editing-in-wafoform) | No | *undefined* | Object that allows to enter initial values for the [`WafoForm Elements`](#wafoform-element) inside the form. Useful for editing. |
| onSubmit | Function | No | f => f | Callback function fired on submit. It gets two props: a [`formValue`](#object-formvalue) object and a *{key: value}* object. |
| formId | String | No | "wafoform" | id attribute to be passed onto the HTML *form* tag. |
| buttonText | String | No | "" | Text to be displayed on the submit button. If omitted, the button will not be rendered. |
| locale | String | No | "en" | Language of the validation error messages. Only 2 languages available at the moment: English and Spanish. (This may change in the future). |
| ignoreEmpty | Boolean | No | false | If true, the second prop of *onSubmit* only returns fields that have a value. |

> **Note:** It exist another way of firing the *onSubmit* if needed.

#### Object formValue
This is one of the props returned on the submit event (it doesn't matter how it's fired). It shows the validity of the form (as a whole) aswell as the validity and value of each of the [`WafoForm Element`](#wafoform-element); each one it's represented by it's key (the *name* prop of the component).

> **Note:** Each value it's represented by its key, which comes from the *name* prop of the [`WafoForm Element`](#wafoform-element).

Example:
```javascript
{
	valid: false, // validation status of the entire form
	name: {
		errors: [
			// error objects from validation...
			{
				error: "required",
				message: "This field is required.",
			},
		],
		valid: false, // validation status of this field.
		value: "", // current value of the field.
	},
	age: {
		errors: [],
		valid: true,
		value: "25",
	},
}
```

#### Object key:value
This is the second prop returned on the submit event (it doesn't matter how it's fired). It returns a key:value object of each of the [`WafoForm Element`](#wafoform-element).

> **Note:** Each value it's represented by its key, which comes from the *name* prop of the [`WafoForm Element`](#wafoform-element).

Example:
```javascript
{
	name: value,
	otherName: value,
}
```

#### Object values and editing in WafoForm
It's fairly common that when we have a form we need it for more than just input new values, we also use them for editing. For this and other use cases, `WafoForm` allows the input of initial values for one or more of its children with the *values* prop.

The *values* object it's basically the same as the [`Object key:value`](#object-key:value) from earlier, where each key (*name*) represents one of the [`WafoForm Element`](#wafoform-element).

Example:
```javascript
{
	name: "Benito camela",
	email: "benito@gmail.com",
}
```

Usage example:
```javascript
import React from 'react';
import { WafoForm, WafoFormInput } = 'wafo-forms';

const Example = () => {
	const user = {
		email: 'ayy@lmao.com',
	};

	return (
		<WafoForm
			key={user.id}
			buttonText="Save changes"
			values={user}
		>

			<WafoFormInput
				type="email"
				name="email"
				label="User email"
			/>

			{/* Other WafoForm Elements... */}

		</WafoForm>
	);
};
```

> **Note:** It's important to mention that `WafoForm` only considers this values on the first render. If this initial values are obtained for example by an async method, adding a `key` to the component, that changes when the values arrive, could be useful.

#### Firing onSubmit manually

At its core [`WafoForm`](#wafoform) it's just an HTML form, which can be submitted as any other form can. For example a type submit button pointing to the form id (remember the *formId* prop?).

Example:
```javascript
import React from 'react';
import { WafoForm } from 'wafo-forms';

const Example = ({ handleSubmit }) => (
	<div>
		<WafoForm
			formId="exampleForm"
			onSubmit={handleSubmit}
		>
		{/* WafoForm Elements... */}
		</WafoForm>

		{/* Button outside of WafoForm */}
		<button type="submit" form="exampleForm">onSubmit</button>
	</div>
)
```

### WafoFormInput
Probably the component that will be used the most; it can be used to input any type of character. It offers similar functionality to the [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) tag of HTML.

Example:
```javascript
import React from 'react';
import { WafoFormInput } from 'wafo-forms';

const Example = () => (
	<WafoFormInput
		type="text"
		name="example"
		customClass="custom-class"
		placeholder="A placeholder"
		label="An input field"
	/>
);
```
#### Props
This component shares props with other components of this library. Unique props to this component will be marked in bold.

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| name | String | **Yes** |  | This will be used as the key to identify the component on the form. Must be unique to the current form. |
| **type** | String | No | "text" | Specifies the type of `<input>` the component will generate. More about [Input Types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) |
| customClass | String | No | "" | Class to be added to the component |
| label | String | No | "" | Label that shows with the `<input>` tag. If omitted the label won't be rendered. |
| labelClass | String | No | "" | Class to be added to the label |
| placeholder | String | No | "" | Text to be shown when no values have been introduced. |
| extraProps | Object | No | {} | Extra props to be passed onto the `<input>` tag; which can be the tag attributes or any other. Example: *autoComplete: 'off'*. |
| onChangeCallback | Function | No | f => f | Callback function to be executed when the onChange event is fired. It receives the raw event as a prop. |
| onBlurCallback | Function | No | f => f | Callback function to be executed when the onBlur event is fired. It receives the raw event as a prop. |
| validations | Object | No | {} | Validation object to be tested against the current value. Validation it's done in the onChange event and onSubmit. Check the Validation Object for more info. |


### WafoFormSelect
This component allows you to show a list of options from where the user can choose. Basically the [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) tag of HTML.

Example:
```javascript
import React from 'react';
import { WafoFormSelect } from 'wafo-forms';

const Example = () => {
	const options = [
		{
			value: "1",
			display: "Option with id 1",
		},
		{
			value: "2",
			display: "Option with id 2",
		},
	];

	return (
		<WafoFormSelect
			name="example"
			customClass="custom-class"
			label="A select field"
			defaultValue="Select one"
			options={options}
		/>
	);
};
```

#### Props
This component shares props with other components of this library. Unique props to this component will be marked in bold.

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| name | String | **Yes** | | This will be used as the key to identify the component on the form. Must be unique to the current form. |
| **defaultValue** | String | No | "Select an option" | Disabled option to be shown when no other option has been selected (similar to placeholder). |
| **options** | [Array](#array-options) | No | [] | Array with the options from which the user can choose. This array can me modified even after the initial render (useful if the options come from an async function). |
| customClass | String | No | "" | Class to be added to the component |
| label | String | No | "" | Label that shows with the `<select>` tag. If omitted the label won't be rendered. |
| labelClass | String | No | "" | Class to be added to the label |
| extraProps | Object | No | {} | Extra props to be passed onto the `<select>` tag; which can be the tag attributes or any other |
| onChangeCallback | Function | No | f => f | Callback function to be executed when the onChange event is fired. It receives the raw event as a prop. |
| onBlurCallback | Function | No | f => f | Callback function to be executed when the onBlur event is fired. It receives the raw event as a prop. |
| validations | Object | No | {} | Validation object to be tested against the current value. Validation it's done in the onChange event and onSubmit. Check the Validation Object for more info. |

#### Array options
This array is made of simple object with two prop; the value to be returned when selected and a text to show on the UI. If the array it's empty the component will show only the *defaultValue* and it will return an empty string when the form is submited.

Example:
```javascript
[
	{
		value: "1",
		display: "Option with id 1",
	},
	{
		value: "2",
		display: "Option with id 2",
	},
];
```


### WafoFormTextArea
This component allows the user to input big texts with support for multiple lines. Basically the [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) tag from HTML.

Example:
```javascript
import React from 'react';
import { WafoFormTextArea } from 'wafo-forms';

const Example = () => (
	<WafoFormTextArea
		name="example"
		customClass="custom-class"
		placeholder="Insert your text here..."
		label="A text area field"
	/>
);
```

#### Props
This component shares props with other components of this library. Unique props to this component will be marked in bold.

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| name | String | **Yes** |  | This will be used as the key to identify the component on the form. Must be unique to the current form. |
| customClass | String | No | "" | Class to be added to the component |
| label | String | No | "" | Label that shows with the `<textarea>` tag. If omitted the label won't be rendered. |
| labelClass | String | No | "" | Class to be added to the label |
| placeholder | String | No | "" | Text to be shown when no values have been introduced. |
| extraProps | Object | No | {} | Extra props to be passed onto the `<textarea>` tag; which can be the tag attributes or any other. Example: *autoComplete: 'off'*. |
| onChangeCallback | Function | No | f => f | Callback function to be executed when the onChange event is fired. It receives the raw event as a prop. |
| onBlurCallback | Function | No | f => f | Callback function to be executed when the onBlur event is fired. It receives the raw event as a prop. |
| validations | Object | No | {} | Validation object to be tested against the current value. Validation it's done in the onChange event and onSubmit. Check the Validation Object for more info. |


### Custom components
The `WafoForm Elements` included can help you in a great number of cases, but maybe you need something more specific (like a datepicker or filepicker, to mention some). This is when custom components come in handy.

For a component to be able to work inside [`WafoForm`](#wafoform) it needs to accept some specific props; this will allows the main component handle the state and comunicate with it.

#### Needed Props
The props that are 100% required ar marked in bold. The rest can be omitted, but they're recommended so that you get the full functionality of the component.

| Prop | Type | Description |
|--|--|--|
| **name** | String | This will be used as the key to identify the component on the form. Must be unique to the current form. |
| **handleInputChange** | Function | This callback function it's how the component talks to the [`WafoForm`](#wafoform) component. It should be called somewhere in your component (for example when the value of your component it's updated) and accept a [HandleInputChange Object](#handeinputchange-object). |
| value | `any` | It's the current value for this component in the *State* of `WafoForm`. Could be useful to load the initial value or just to keep track of the current value in a Functional Component. |
| valid | Boolean | Current validation status. |
| touched | Boolean | `False` if the *input* value has never been modified, `True` if it has. |
| errors | Array | Error array from the validation process.  Check the Validation Error Array for more info. |
| validations | Object | Validation object to be tested against the current value. Validation it's done in the onChange event and onSubmit. Check the Validation Object for more info. |

#### handeInputChange Object
This is the Object to be received as a prop on the `handleInputChange` function:
```
{
	name,
	value: "Something."
}
```
 - **name:** Must be the name prop.
 - **value:** The value that should be in the state of the main component. (The expected value to be returned when submitted).

#### Example: Hooks component
Component that allows us to select an image and see a preview. The image will be submitted alongside the rest of the form and we can reuse this component anywhere.

```javascript
import React from 'react';

function ImageSelector({ name, handleInputChange, valid, touched, errors }) {
	const [value, setValue] = React.useState('');
	const [filename, setFilename] = React.useState('');
	const [fileUrl, setFileUrl] = React.useState('');

	function handleOnChange(event) {
		const { target: { files, value } } = event;

		setValue(value);
		setFilename(files[0].name);
		setFileUrl(URL.createObjectURL(files[0]));

		handleInputChange({
			name,
			value: files[0],
		});
	}

	return (
			<div>
				<div className="preview">
					<img src={fileUrl} alt="Preview" />
					<p>{filename}</p>
				</div>

				<div className="input">
					<label htmlFor={name}>Selecciona una imagen</label>
					<input
						type="file"
						id={name}
						name={name}
						onChange={handleOnChange}
						value={value}
						accept=".png, .jpg, .jpeg"
					/>
				</div>

				{!valid && touched
					&& (
						<ul className="errors">
							{errors.map(error => (<li key={error.error}>{error.message}</li>))}
						</ul>
					)
				}
			</div>
		);
}
```

#### Example: Functional Component
Component that allows the input of hours and minutes on different fields but returns both toghether on submit.

```javascript
import React from 'react';

const TimeSelector = ({ name, handleInputChange, value }) => {
	const handleOnChange = (event) => {
		const { target: { name: targetName, value: targetValue } } = event;
		handleInputChange({
			name,
			value: {
				...value,
				[targetName]: targetValue,
			},
		});
	};

	return (
		<div>
			<label>Introduce hora y minutos</label>
			<div>
					<input
						type="number"
						name="hours"
						value={value.hours}
						onChange={handleOnChange}
						min="1"
						max="12"
					/>
					<span>:</span>
					<input
						type="number"
						name="minutes"
						value={value.minutes}
						onChange={handleOnChange}
						min="0"
						max="59"
					/>
			</div>
		</div>
	);
};
```

#### How to use a custom component
Just like any other `WafoForm Element`.

```javascript
import React from 'react';
import { WafoForm } from 'wafo-forms';
import { TimeSelector, ImageSelector } from './example';

const Example = () => {
	const handleSubmit = (values) => {
		// Do something with the values...
	};
	
	return (
		<WafoForm buttonText="Submit" onSubmit={handleSubmit}>
			<TimeSelector
				name="time"
			/>

			<ImageSelector
				name="image"
			/>
		</WafoForm>
	);
};
```

## Validation

**To-do:** Write this.

## Styles

**To-do:** Write this.

## TODO

 - [ ] Image picker.
 - [ ] File picker.
 - [ ] Datepicker.
 - [ ] Rich Text (WYSIWYG).
 
### Limitations
The validation library it's very simple, but it allows ways to create custom and more robust validations. The included components are very basic and don't cover more complex use cases and thats why it's possible to create custom components.
