# Wafo-form
UI Component hecho en React 16.7, hecho con la intención de agilizar y facilitar el trabajo mio y de mis compañeritos de RO a la hora de hacer paneles o interfaces web.

## Demo
Prueba el componente en vivo aquí.
to-do: Imagen de ejemplo

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
		</WafoForm>
	);
};
```

## Componentes
Además del componente principal [`WafoForm`](#wafoform), existen otros componentes que son los que permiten al usuario final introducir valores a la forma. La forma más común de utilizar estos componentes es dentro del componente principal, sin embargo, es posible utilizarlos de manera individual y cada uno es capaz de ofrecer todas las funcionalidades en ambos casos.

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
| values | [Object](#objeto-values-y-edición-en-wafoform) | No | *undefined* | Objeto que permite introducir valores iniciales para uno o todos los [`WafoFormElement`](#wafoformelement) que se encuentren en la forma. Útil para edición. |

> **Nota:** Existe otra forma de disparar el evento *onSubmit* en caso de no querer utilizar el botón default.

#### Objeto formValue
Este objeto es la respuesta que entrega el componente al momento de realizar un submit, sin importar como este se realice. Indica la validez general de la forma y el valor actual de todos los [`WafoFormElement`](#wafoformelement); cada uno representado por su llave (*name*), especificando además su estado de validez y errores en caso de existir.

> **Nota:** Cada valor viene representado por su llave, la cual proviene de la propiedad *name* de los `WafoFormElement`.

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

El objeto *values* similar al objeto *formValue* representa cada uno de los `WafoFormElement` mediante su llave (*name*). Cada una de estas llaves debe ser un `String` que será utilizado como el valor inicial.

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

				{/* Other WafoFormElements... */}

			</WafoForm>
		);
	}
}
```

Es importante mencionar que `WafoForm` solo considera estos valores durante su creación por lo que si la obtención de los valores es asíncrona puede ser útil asignarle un `key` que este relacionado (como el id, o algún otro identificador único) para que se actualice el componente una vez que llegan estos valores.

Esto podría no ser necesario si hay un componente padre que se encarge de obtener esta información o provenga de algún otro lugar del sistema como [Redux](https://redux.js.org/).

 
### WafoFormInput
El componente más básico de todos, puede ser utilizado para introducir casi cualquier tipo de carácter y ofrece todas las funciones de la etiqueta `<input>` de HTML.

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

Este componente comparte propiedades con otros componentes de la librería. Ir a [`WafoFormElement`](#wafoformelement)

| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| type | String | No | "text" | Se especifica el tipo de `<input>` que va manejar el componente. Más sobre [Input Types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) |
| customClass | String | No | "" | Clase que será agregada al componente. |
| name | String | Yes |  | Esta propiedad es utilizada como la llave que identifica al componente dentro de la forma y debe ser único. |
| label | String | No | "" | Texto que se muestra junto con el `<input>`. De omitirse no se mostrara nada.|
| placeholder | String | No | "" | Texto que se muestra cuando `<input>` esta vacío. De omitirse no se mostrara nada. |
| value | String | No | "" | *Debe omitirse si el componente es utilizado como hijo de `WafoForm`.* Representa el valor que contiene el componente. |
| handleInputChange | Function | No | f => f | *Debe omitirse si el componente es utilizado como hijo de `WafoForm`.* Callback que se dispara cada vez que hay un cambio en *value* (Puede utilizarse para actualizar el *state*). |
| valid | Bool | No | false | Representa el estado de la validación. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| touched | Bool | No | false | Indica si el *value* de la forma ha sido modificado. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| errors | Array | No | [] | Array que lista los errores retornados de la validación. Estos son devueltos durante el *onSubmit* de `WafoForm`. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| validations | Object | No | {} | Objeto con las validaciones a las que se sometera el *value*. La validación se realiza cada vez que este cambia o al momento de dispararse *onSubmit* de `WafoForm`. *Funciona de manera automática si se utiliza dentro de `WafoForm`.* |

### WafoFormElement
Ayylmao dijo el Gaytis.

## TODO

 - Soporte para imágenes.
 - Soporte para fechas.
 - Soporte para Rich Text  (WYSIWYG).
 
### Limitaciones
Las validaciones disponibles son muy especificas y no cubren todos los casos. Como solución momentánea y para permitir mayor flexibilidad se permite validar mediante expresiones regulares.
