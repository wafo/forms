import React from "react";

import "forms/dist/index.css";
import TestForm from "./forms/testingForm";
import ArrayForm from "./forms/arrayForm";
import GroupsForm from "./forms/groupsForm";

const styles = {
  list: {
    listStyle: "none"
  },
  item: {
    display: "inline",
    marginRight: "0.75rem"
  }
};

const App = () => {
  const [form, setForm] = React.useState("test");

  return (
    <div>
      <ul style={styles.list}>
        <li style={styles.item}>
          <button onClick={() => setForm("test")}>Test Form</button>
        </li>
        <li style={styles.item}>
          <button onClick={() => setForm("group")}>Group Form</button>
        </li>
        <li style={styles.item}>
          <button onClick={() => setForm("array")}>Array Form</button>
        </li>
      </ul>
      <React.Fragment>
        {form === "test" && <TestForm />}
        {form === "group" && <GroupsForm />}
        {form === "array" && <ArrayForm />}
      </React.Fragment>
    </div>
  );
};

export default App;
