import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";

// imports for
import { MDBInput, MDBBtn, MDBCheckbox } from "mdb-react-ui-kit";

import "./login.scss";

function LoginView() {
  const [formValue, setFormValue] = useState({
    fname: "Mark",
    lname: "Otto",
    username: "",
    email: "",
  });
  // States for the form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  /**
   * handle validation on form submit
   *
   * @param {*} e - event
   */
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    let allErrors = null;
    // validation for number
    if (
      quantity < 0 || // must be positive
      quantity === null || // not bu null
      !Number.isInteger(parseInt(quantity)) // is a number
    ) {
      allErrors = {};
      allErrors.quantity = "Please provide a valid quantity number.";
    }
    // validation for name
    if (name.length < 1 || name === null) {
      allErrors = {};
      allErrors.name = "Please provide a name for the item.";
    }

    if (allErrors) {
      setErrors(allErrors);
      return;
    }
    // addItem();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Row className="mt-4">
          <Form.Group className="floating-label-group" as={Col}>
            <Form.Control
              required
              id="item-name"
              type="text"
              value={name}
              isInvalid={!!errors.name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Label className="floating-label">Name</Form.Label>
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              required
              id="item-quantity"
              type="number"
              placeholder="quantity (i.e. a number)"
              value={quantity}
              isInvalid={!!errors.quantity} // used for form control feedback to validate
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.quantity}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  );
}

export default LoginView;
