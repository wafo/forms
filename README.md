# Wafo-form
UI Component hecho en React 16.7, hecho con la intención de agilizar y facilitar el trabajo mio y de mis compañeritos de RO a la hora de hacer paneles o interfaces web.

## Demo
Prueba el componente en vivo aquí.
to-do: Imagen de ejemplo

## Primeros pasos

    $ npm install --save wafo-forms

`WafoForm` es el componente principal, es el equivalente a la etiqueta `<form>` de HTML. Es quien se encarga de manejar el *state*, *validaciones* y entregar los *valores* al momento de hacer el submit.

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
Además del componente principal `WafoForm`, existen otros componentes que son los que permiten al usuario final introducir valores a la forma. La forma más común de utilizar estos componentes es dentro del componente principal, sin embargo, es posible utilizarlos de manera individual y cada uno es capaz de ofrecer todas las funcionalidades en ambos casos.

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
| Prop | Type | Required | Default value | Description |
|--|--|--|--|--|
| type | String | No | "text" | Se especifica el tipo de `<input>` que va manejar el componente. Más sobre [Input Types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) |
| customClass | String | No | "" | Clase que sera agregada al componente. |
| name | String | Yes |  | Esta propiedad es utilizada como la llave que identifica al componente dentro de la forma y debe ser único. |
| label | String | No | "" | Texto que se muestra junto con el `<input>`. De omitirse no se mostrara nada.|
| placeholder | String | No | "" | Texto que se muestra cuando `<input>` esta vacío. De omitirse no se mostrara nada. |
| value | String | No | "" | *Debe omitirse si el componente es utilizado como hijo de `WafoForm`.* Representa el valor que contiene el componente. |
| handleInputChange | Function | No | f => f | *Debe omitirse si el componente es utilizado como hijo de `WafoForm`.* Callback que se dispara cada vez que hay un cambio en *value* (Puede utilizarse para actualizar el *state*). |
| valid | Bool | No | false | Representa el estado de la validación. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| touched | Bool | No | false | Indica si el *value* de la forma ha sido modificado. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| errors | Array | No | [] | Array que lista los errores retornados de la validación. Estos son devueltos durante el *onSubmit* de `WafoForm`. *Solo es relevante si se utiliza dentro de `WafoForm`.* |
| validations | Object | No | {} | Objeto con las validaciones a las que se sometera el *value*. La validación se realiza cada vez que este cambia o al momento de dispararse *onSubmit* de `WafoForm`. *Funciona de manera automática si se utiliza dentro de `WafoForm`.* |


## TODO

 - Soporte para imágenes.
 - Soporte para fechas.
 - Soporte para Rich Text  (WYSIWYG).
 
### Limitaciones
Las validaciones disponibles son muy especificas y no cubren todos los casos. Como solución momentánea y para permitir mayor flexibilidad se permite validar mediante expresiones regulares.