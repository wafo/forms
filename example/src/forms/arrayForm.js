import React from "react";
import { WafoForm, WafoFormInput } from "forms";

const styles = {
  full_width: { width: "100%", padding: "0 1rem" }
};

const ArrayForm = () => {
  const [items, setItems] = React.useState([]);
  const removeItem = index => {
    setItems(prev => {
      const dummy = [...prev];
      dummy.splice(index, 1);
      return dummy;
    });
  };

  const handleForm = (form, values) => {
    console.log(values);
    const products = Object.entries(values.products).map(([, value]) => value);
    console.log(products);
  };

  return (
    <div>
      <h3>Array Form Example</h3>
      <WafoForm values={{}} locale="en" onSubmit={handleForm}>
        <WafoFormInput
          name="title"
          placeholder="Title"
          validations={{ required: true }}
        />

        <button type="button" onClick={() => setItems(prev => [...prev, {}])}>
          Add product +
        </button>

        <div style={styles.full_width} groupname="products">
          {items.map((item, i) => (
            <div key={i} style={styles.full_width} groupname={i}>
              <div className="row">
                <WafoFormInput
                  name="name"
                  placeholder="Name"
                  customClass="col-md-4"
                  validations={{ required: true }}
                />
                <WafoFormInput
                  name="description"
                  placeholder="Description"
                  customClass="col-md-4"
                  validations={{ required: false }}
                />
                <WafoFormInput
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  customClass="col-md-4"
                  validations={{ required: false }}
                />
                <button type="button" onClick={() => removeItem(i)}>
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.full_width}>
          <button type="submit">Submit form</button>
        </div>
      </WafoForm>
    </div>
  );
};

export default ArrayForm;
