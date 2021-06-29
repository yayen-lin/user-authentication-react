import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

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

class LoginAndRegView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // login
      usernameLogin: "",
      passwordLogin: "",
      toHomeView: false, // used for redirection on login/signup success
      // signup
      usernameSignup: "",
      passwordSignup: "",
      privilegeSignup: "",
    };
  }

  setUsernameLogin(un) {
    this.setState({
      usernameLogin: un,
    });
  }

  setPasswordLogin(pw) {
    this.setState({
      passwordLogin: pw,
    });
  }

  setToHomeView(go) {
    this.setState({ toHomeView: go });
  }

  setUsernameSignup(un) {
    this.setState({
      usernameSignup: un,
    });
  }

  setPasswordSignup(pw) {
    this.setState({
      passwordSignup: pw,
    });
  }

  setPrivilegeSignup(priv) {
    this.setState({
      privilegeSignup: priv,
    });
  }

  clearSignupFields() {
    this.setState({
      usernameSignup: "",
      passwordSignup: "",
    });
  }

  async onHandleLogin(e) {
    e.preventDefault();

    const user = {
      username: this.state.usernameLogin,
      password: this.state.passwordLogin,
    };

    if (
      this.state.usernameLogin.length === 0 ||
      this.state.passwordLogin.length === 0
    ) {
      toast.error("Username or password field is empty.");
      return;
    }

    let loginResult = await this.props.login(user);
    // login succeeded
    if (loginResult === 0) this.setToHomeView(true);
    // login failed
    else {
      toast.error("Something went wrong during login");
      return;
    }
  }

  async onHandleSignup(e) {
    e.preventDefault();

    const user = {
      username: this.state.usernameSignup,
      password: this.state.passwordSignup,
      privilege: "0", // on signup, privilege set to 0 (can be changed by admin)
    };

    let errors = [];

    if (!this.state.usernameSignup || this.state.usernameSignup.length === 0) {
      errors.push("Username field is empty");
    }

    if (!this.state.passwordSignup || this.state.passwordSignup.length === 0) {
      errors.push("Password field is empty");
    }

    if (errors.length !== 0) {
      toast.error(
        <ul>
          {errors.map((er) => {
            return <li key={er}>{er}</li>;
          })}
        </ul>
      );
    } else {
      let signupResult = await this.props.signup(user);
      // clear fields upon successful signup
      this.clearSignupFields();
    }

    // clear form after signup btn is clicked
    // setUsernameReg("");
    // setPasswordReg("");
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
                type={"text"}
                value={this.state.usernameLogin}
                placeholder="Username"
                onChange={(e) => this.setUsernameLogin(e.target.value)}
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
                type={"password"}
                value={this.state.passwordLogin}
                placeholder="Password"
                onChange={(e) => this.setPasswordLogin(e.target.value)}
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
                value={this.state.usernameSignup}
                placeholder="Username"
                onChange={(e) => this.setUsernameSignup(e.target.value)}
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
                value={this.state.passwordSignup}
                placeholder="Password"
                onChange={(e) => this.setPasswordSignup(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3 mb-3"
          onClick={(e) => this.onHandleSignup(e)}
        >
          <FiUserPlus /> Sign Me Up!
        </Button>
      </Form>
    );
  }

  render() {
    // redirect to home view upon login successful
    if (this.props.isLoggedIn()) return <Redirect to="/" />;
    // redirect to home view if already logged in
    // if (AuthService.currentUserValue) return <Redirect to="/" />;

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

export default LoginAndRegView;
