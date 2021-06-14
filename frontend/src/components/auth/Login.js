import React, { Component } from "react";

// connect to our backend
import Axios from "axios";

// imports for bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

// imports for icons
import { BiKey, BiLogIn } from "react-icons/bi";
import { FiTag, FiUserPlus, FiLock } from "react-icons/fi";

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

  onHandleSubmit(e) {
    e.preventDefault();
    console.log(this.state.username);
    console.log(this.state.password);
    this.setState({
      username: "",
      password: "",
    });
  }

  getLoginForm() {
    return (
      <Form className="mt-5 mb-5">
        {/* username */}
        <Row>
          <Col xs="auto">
            <Form.Label>Username</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>@</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                id="username-form"
                type="text"
                value={this.state.username}
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
                required
                id="form-password"
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={(e) => this.onChangeSetPassword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* remember me */}
        <Row className="mt-2 mb-2">
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              id="autoSizingCheck"
              label="Remember me"
            />
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3"
          onClick={(e) => this.onHandleSubmit(e)}
        >
          <BiLogIn /> Login!
        </Button>
      </Form>
    );
  }

  getRegisterForm() {
    return (
      <Form className="mt-5">
        {/* username */}
        <Row>
          <Col xs="auto">
            <Form.Label>Username</Form.Label>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FiTag />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                id="username-form"
                type="text"
                value={this.state.username}
                placeholder="Username"
                onChange={(e) => this.onChangeSetUsername(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* password */}
        <Row className="mt-2 mb-3">
          <Col xs="auto">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FiLock />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                id="form-password"
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={(e) => this.onChangeSetPassword(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3"
          onClick={(e) => this.onHandleSubmit(e)}
        >
          <FiUserPlus /> Sign Me Up!
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Container>
        {this.getLoginForm()} <hr /> {this.getRegisterForm()}
      </Container>
    );
  }
}

export default Login;
