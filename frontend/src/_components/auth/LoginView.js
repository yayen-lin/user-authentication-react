import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// imports for
import { MDBInput, MDBBtn, MDBCheckbox } from "mdb-react-ui-kit";

function LoginView() {
  const [formValue, setFormValue] = useState({
    fname: "Mark",
    lname: "Otto",
    username: "",
    email: "",
  });
}

export default LoginView;
