import React from 'react';

function ImageSelector({ name, handleInputChange, valid, touched, errors }) {
  const [value, setValue] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');

  function handleOnChange(event) {
    const { target: { files, v } } = event;

    setValue(v);
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

export default ImageSelector;
