import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { BiKey, BiLogIn } from "react-icons/bi";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy_data: "abc",
      username: "",
      password: "",
    };
  }

  onChangeSetUsername(un) {
    this.setState({ username: un });
  }

  onChangeSetPassword(pw) {
    this.setState({ password: pw });
  }

  getLoginForm() {
    return (
      <Form className="mt-5">
        {/* username */}
        <Row>
          <Col xs="auto">
            <Form.Label>Username</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>@</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                id="username-form"
                type="text"
                placeholder="Username"
                onChange={(e) => this.onChangeSetUsername(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* password */}
        <Row className="mt-2">
          <Col xs="auto">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <BiKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                id="form-password"
                type="password"
                placeholder="Password"
                onChange={(e) => this.onChangeSetPassword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* remember me */}
        <Row className="mt-2">
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="autoSizingCheck"
              className="mb-2"
              label="Remember me"
            />
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3"
          onClick={() => {
            console.log(this.state.username);
            console.log(this.state.password);
          }}
        >
          <BiLogIn /> Login
        </Button>
      </Form>
    );
  }

  render() {
    return <Container>{this.getLoginForm()}</Container>;
  }
}

export default Login;
