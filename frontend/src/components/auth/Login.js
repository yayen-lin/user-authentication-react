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
      usernameLogin: "",
      passwordLogin: "",
      usernameReg: "",
      passwordReg: "",
      loginStatus: false,
    };
  }

  onChangeSetUsernameLogin(un) {
    this.setState({ usernameLogin: un });
  }

  onChangeSetPasswordLogin(pw) {
    this.setState({ passwordLogin: pw });
  }

  onChangeSetUsernameReg(un) {
    this.setState({ usernameReg: un });
  }

  onChangeSetPasswordReg(pw) {
    this.setState({ passwordReg: pw });
  }

  setLoginStatus(isLoggedIn) {
    this.setState({ loginStatus: isLoggedIn });
  }

  onHandleLogin(e) {
    e.preventDefault();

    Axios.post("http://localhost:3001/login", {
      username: this.state.usernameLogin,
      password: this.state.passwordLogin,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data);
      } else {
        console.log(response.data);
        this.setLoginStatus(true);
        // clear form after submit upon success
        this.setState({
          usernameLogin: "",
          passwordLogin: "",
        });
      }
    });
  }

  onHandleRegister(e) {
    e.preventDefault();

    Axios.post("http://localhost:3001/register", {
      username: this.state.usernameReg,
      password: this.state.passwordReg,
      privilege: 0, // by default, user privilege is set to one
    }).then((response) => {
      console.log(response);
    });

    // clear form after signup btn is clicked
    this.setState({
      usernameReg: "",
      passwordReg: "",
    });
  }

  getLoginForm() {
    return (
      <Form className="mb-5">
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
                id="username-login-form"
                type="text"
                value={this.state.usernameLogin}
                placeholder="Username"
                onChange={(e) => this.onChangeSetUsernameLogin(e.target.value)}
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
                id="password-login-form"
                type="password"
                value={this.state.passwordLogin}
                placeholder="Password"
                onChange={(e) => this.onChangeSetPasswordLogin(e.target.value)}
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
          onClick={(e) => this.onHandleLogin(e)}
        >
          <BiLogIn /> Login!
        </Button>
      </Form>
    );
  }

  getRegisterForm() {
    return (
      <Form>
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
                id="username-reg-form"
                type="text"
                value={this.state.usernameReg}
                placeholder="Username"
                onChange={(e) => this.onChangeSetUsernameReg(e.target.value)}
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
                id="form-reg-password"
                type="password"
                value={this.state.passwordReg}
                placeholder="Password"
                onChange={(e) => this.onChangeSetPasswordReg(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3 mb-3"
          onClick={(e) => this.onHandleRegister(e)}
        >
          <FiUserPlus /> Sign Me Up!
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <Container>
        <h2 className="mt-3">Login</h2>
        {this.getLoginForm()}
        <hr />
        <h2 className="mt-3">Register</h2>
        {this.getRegisterForm()}
      </Container>
    );
  }
}

export default Login;
