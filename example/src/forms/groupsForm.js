import React from "react";
import { WafoForm, WafoFormInput } from "forms";

const styles = {
  full_width: { width: "100%", padding: "0 1rem" }
};

const GroupsForm = () => {
  const [hide, setHide] = React.useState(false);

  const handleForm = (form, values) => {
    console.log(form);
  };

  return (
    <div>
      <h3>Groups Form Example</h3>
      <WafoForm values={{}} locale="en" onSubmit={handleForm}>
        <WafoFormInput
          name="title"
          placeholder="Title"
          validations={{ required: true }}
        />
        <div>
          {!hide && (
            <WafoFormInput
              name="desc"
              placeholder="Description"
              validations={{ required: true }}
            />
          )}
        </div>
        <div style={styles.full_width}>
          <h5>User info:</h5>
        </div>
        <div style={styles.full_width} groupname="user">
          <div className="row">
            <WafoFormInput
              name="name"
              placeholder="Name"
              customClass="col-md-4"
              validations={{ required: true }}
            />
            <WafoFormInput
              name="last_name"
              placeholder="Last name"
              customClass="col-md-4"
              validations={{ required: true }}
            />
            {!hide && (
              <WafoFormInput
                name="color"
                placeholder="Favorite color"
                customClass="col-md-4"
              />
            )}
            <div style={styles.full_width} groupname="address">
              <div className="row">
                <WafoFormInput
                  name="street"
                  placeholder="Street"
                  customClass="col-md-4"
                  validations={{ required: true }}
                />
                <WafoFormInput
                  name="ZipCode"
                  placeholder="Zip Code"
                  customClass="col-md-4"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.full_width}>
          <button type="submit">Submit form</button>
        </div>
      </WafoForm>

      <button onClick={() => setHide(prev => !prev)}>Toggle description</button>
    </div>
  );
};

export default GroupsForm;
