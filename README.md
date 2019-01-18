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

## TODO

 - Soporte para imágenes.
 - Soporte para fechas.
 - Soporte para Rich Text  (WYSIWYG).
 
 ### Limitaciones
 Las validaciones disponibles son muy especificas y no cubren todos los casos. Como solución momentánea y para permitir mayor flexibilidad se permite validar mediante expresiones regulares.