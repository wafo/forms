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
| type | String | No | "text" |  |
| customClass | String | No | "" |  |
| name | String | Yes |  |  |
| label | String | No | "" |  |
| placeholder | String | No | "" |  |
| value | String | No | "" |  |
| handleInputChange | Function | No | f => f |  |
| valid | Bool | No | false |  |
| touched | Bool | No | false |  |
| errors | Array | No | [] |  |
| validations | Object | No | {} |  |


## TODO

 - Soporte para imágenes.
 - Soporte para fechas.
 - Soporte para Rich Text  (WYSIWYG).
 
### Limitaciones
Las validaciones disponibles son muy especificas y no cubren todos los casos. Como solución momentánea y para permitir mayor flexibilidad se permite validar mediante expresiones regulares.