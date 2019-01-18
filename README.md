# Wafo-form
UI Component hecho en React 16.7, hecho con la intención de agilizar y facilitar el trabajo mio y de mis compañeritos de RO a la hora de hacer paneles o interfaces web.

## Demo
Prueba el componente en vivo aquí.

**To-do**: Link a ejemplo. Imagen de ejemplo

## Primeros pasos

    $ npm install --save wafo-forms

**To-do:** Alguna pequeña descripción de esta librería

### Dependencias
Este componente es completamente independiente y no requiere de ningún otro paquete o librería (Además de *react* y *react-dom*).

> **Nota:** El componente esta pensado en su uso en conjunto a *[Bootstrap](https://getbootstrap.com/)* y a pesar de no ser requerido, se puede beneficiar de que este sea incluido.

### Ejemplo de uso
Este ejemplo de uso muestra una de las formas más sencillas en que se puede utilizar el componente. Para casos más específicos, continué leyendo.
```javascript
import React from 'react';
import { WafoForm, WafoFormInput } from 'wafo-forms';

const ExampleComponent = () => {
	const handleSubmit = (values) => {
		// Do something with the values...
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
		</WafoForm >
	);
};
```

## Componentes
Además del componente principal [`WafoForm`](#wafoform), existen otros componentes que son los que permiten al usuario final introducir valores a la forma. La forma recomendada de utilizar estos componentes es dentro del componente principal, sin embargo, es posible utilizarlos de manera individual.

> **Nota:** Utilizar los componentes fuera de `WafoForm` no es recomendado ya que se pierde la mayor parte de la funcionalidad. En estos casos se recomienda utilizar los componentes default. Más información sobre formas en React [aquí](https://reactjs.org/docs/forms.html).

### WafoForm Element
Este no es realmente un componente, pero con la intención de fácilitar la descripción de la librería y sus funciones nos referiremos a cualquier `Componente` que pueda ser hijo de [`WafoForm`](#wafoform) como un `WafoForm Element`. La mayoría de los componentes incluidos comparten gran parte de sus propiedades.

Existe la posibilidad de crear `Componentes` personalizados y más complejos que funcionen dentro de [`WafoForm`](#wafoform), teniendo un par de consideraciones en mente. Más información al respecto en [`Componentes personalizados`](#componentes-personalizados).

### WafoForm
El componente principal, es el equivalente a la etiqueta `<form>` de *HTML*. Es quien se encarga de manejar el *state*, *validaciones* y entregar los *valores* al momento de hacer el *submit*.

Ejemplo:
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
| buttonText | String | No | "" | Texto que se mostrara en el botón *submit* de la forma. Si se omite, el botón no será mostrado. |
| onSubmit | Function | No | f => f | Función (callback) que se dispara al hacer submit. Recibe como prop un objeto tipo [`formValue`](#objeto-formvalue). |
| values | [Object](#objeto-values-y-edición-en-wafoform) | No | *undefined* | Objeto que permite introducir valores iniciales para uno o todos los [`WafoForm Element`](#wafoform-element) que se encuentren en la forma. Útil para edición. |

> **Nota:** Existe otra forma de disparar el evento *onSubmit* en caso de no querer utilizar el botón default.

#### Objeto formValue
Este objeto es la respuesta que entrega el componente al momento de realizar un submit, sin importar como este se realice. Indica la validez general de la forma y el valor actual de todos los [`WafoForm Element`](#wafoform-element); cada uno representado por su llave (*name*), especificando además su estado de validez y errores en caso de existir.

> **Nota:** Cada valor viene representado por su llave, la cual proviene de la propiedad *name* de los [`WafoForm Element`](#wafoform-element).

Ejemplo:
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

#### Objeto values y edición en WafoForm
Es común que cuando tengamos una forma no solo la utilicemos para introducir información nueva sino también para la edición de la misma. `WafoForm` no hace distinción especifica a la edición de información, pero si permite la carga de valores iniciales para uno o todos de sus hijos mediante la propiedad *values*.

El objeto *values* similar al objeto *formValue* representa cada uno de los [`WafoForm Element`](#wafoform-element) mediante su llave (*name*). Cada una de estas llaves debe ser un `String` que será utilizado como el valor inicial.

Ejemplo:
```javascript
{
	name: "Ramón Guerrero",
	email: "ramon@gmail.com",
}
```

Ejemplo de uso:
```javascript
import React from 'react';
import { WafoForm, WafoFormInput } = 'wafo-forms';

class Example extends React.Component {
	state = {
		user: {
			id: 0
		},
	}

	componentDidMount() {
		// logic / api call to get values...
	}

	handleSubmit = (formValue) => {
		// do something with the values...
	}

	render() {
		const { user } = this.state;

		return (
			<WafoForm
				key={user.id}
				buttonText="Save changes"
				onSubmit={this.handleSubmit}
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
	}
}
```

Es importante mencionar que `WafoForm` solo considera estos valores durante su creación por lo que si la obtención de los valores es asíncrona puede ser útil asignarle un `key` que este relacionado (como el id, o algún otro identificador único) para que se actualice el componente una vez que llegan estos valores.

Esto podría no ser necesario si hay un componente padre que se encarge de obtener esta información o provenga de algún otro lugar del sistema como [Redux](https://redux.js.org/).

#### Disparar onSubmit manualmente

onSubmit es una función de [`WafoForm`](#wafoform) que se ejecuta al momento de realizar la acción de submit (presionando *Enter* en el teclado o el Botón de la forma, etc.). Esta función valida cada uno de los [`WafoForm Element`](#wafoform-element) y genera un objeto [`formValue`](#objeto-formvalue) que sera devuelto a la función que se haya especificado en la propiedad `onSubmit`.

Una posible alternativa en el caso que se desee disparar esta función desde otro componente, o desde otra función, es utilizar un [Ref](https://reactjs.org/docs/refs-and-the-dom.html) y así acceder directamente a la funcion onSubmit.

Ejemplo:
```javascript
import React from 'react';
import { WafoForm } from 'wafo-forms';

class Example extends React.Component {
	constructor(props) {
		super(props);
		this.formRef = React.createRef();
	}

	handleSubmit = (formValue) => {
		// do something with the values...
	}

	render() {
		return (
			<div>
				<WafoForm
					ref={this.formRef}
					buttonText="Save changes"
					onSubmit={this.handleSubmit}
				>

				{/* WafoForm Elements... */}
				
				</WafoForm>

				{/* Botón fuera de Wafo Forms */}
				<button
					type="button"
					onClick={() => { this.formRef.current.onSubmit(); }}
				>
					onSubmit
				</button>
			</div>
		);
	}
}
```


### WafoFormInput
El componente más básico de todos, puede ser utilizado para introducir casi cualquier tipo de carácter. Ofrece funciones similares a las de la etiqueta [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) de HTML.

Ejemplo:
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

Este componente comparte propiedades con otros componentes de la librería. Las propiedades que no se comparten con el resto estan marcadas en negrita.

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| name | String | Yes |  | Esta propiedad es utilizada como la llave que identifica al componente dentro de la forma y debe ser único. |
| **type** | String | No | "text" | Se especifica el tipo de `<input>` que va manejar el componente. Más sobre [Input Types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) |
| placeholder | String | No | "" | Texto que se muestra cuando `<input>` esta vacío. De omitirse no se mostrara nada. |
| customClass | String | No | "" | Clase que será agregada al componente. |
| label | String | No | "" | Texto que se muestra junto con el `<input>`. De omitirse no se mostrara nada.|
| validations | Object | No | {} | Objeto con las validaciones a las que se sometera el valor actual. La validación se realiza cada vez que este cambia o al momento de dispararse *onSubmit* de [`WafoForm`](#wafoform). |


### WafoFormSelect
Este componente permite mostrar una lista de opciones entre las cuales el usuario puede elegir. Ofrece funciones similares a las de la etiqueta [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) de HTML.

Ejemplo:
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
Este componente comparte propiedades con otros componentes de la librería. Las propiedades que no se comparten con el resto estan marcadas en negrita.

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| name | String | Yes |  | Esta propiedad es utilizada como la llave que identifica al componente dentro de la forma y debe ser único. |
| customClass | String | No | "" | Clase que será agregada al componente. |
| label | String | No | "" | Texto que se muestra junto con el `<input>`. De omitirse no se mostrara nada.|
| **defaultValue** | String | No | "Select an option" | Es la opción que estará seleccionada por default al iniciar (similar a placeholder) y de no seleccionar otra opción retornara un String vacio como valor. |
| **options** | [Array](#array-options) | No | [] | Array con las opciones a mostrar, entre las cuales podrá elegir el usuario. Este arreglo puede ser modificado incluso después de que el componente sea iniciado, como en el caso de provenir de una fuente asíncrona. |
| validations | Object | No | {} | Objeto con las validaciones a las que se sometera el valor actual. La validación se realiza cada vez que este cambia o al momento de dispararse *onSubmit* de [`WafoForm`](#wafoform). |

#### Array options
Este array esta conformado de objetos sencillos que contienen dos propiedades; el valor a retornar y el texto a mostrar en la interfaz. Si el array se encuentra vacio, simplemente se mostrara la opción proporcionada en *defaultValue* y siempre retornara un string vacio.

Ejemplo:
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

### Componentes personalizados

**To-do:** Escribir esto.

## TODO

 - Soporte para imágenes.
 - Soporte para fechas.
 - Soporte para Rich Text  (WYSIWYG).
 - Mejorar validaciones.
 
### Limitaciones
Las validaciones disponibles son muy especificas y no cubren todos los casos. Como solución momentánea y para permitir mayor flexibilidad se permite validar mediante expresiones regulares.
