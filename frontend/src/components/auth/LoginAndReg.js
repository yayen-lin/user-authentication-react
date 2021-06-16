import React, { useEffect, useState } from "react";

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

function LoginAndReg(props) {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     dummy_data: "abc",
  //     usernameLogin: "",
  //     passwordLogin: "",
  //     usernameReg: "",
  //     passwordReg: "",
  //     loginStatus: false,
  //   };
  // }

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginStatus(response.data.user[0].username);
      }
    });
  }, []);

  const onHandleLogin = (e) => {
    e.preventDefault();

    Axios.post("http://localhost:3001/login", {
      username: usernameLogin,
      password: passwordLogin,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data);
      } else {
        console.log(response.data);
        setLoginStatus(true);
        // clear form after submit upon success
        setUsernameLogin("");
        setPasswordLogin("");
      }
    });
  };

  const onHandleRegister = (e) => {
    e.preventDefault();

    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
      privilege: 0, // by default, user privilege is set to one
    }).then((response) => {
      console.log(response);
    });

    // clear form after signup btn is clicked
    setUsernameReg("");
    setPasswordReg("");
  };

  const getLoginForm = () => {
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
                value={usernameLogin}
                placeholder="Username"
                onChange={(e) => setUsernameLogin(e.target.value)}
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
                value={passwordLogin}
                placeholder="Password"
                onChange={(e) => setPasswordLogin(e.target.value)}
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
          onClick={(e) => onHandleLogin(e)}
        >
          <BiLogIn /> Login!
        </Button>
      </Form>
    );
  };

  const getRegisterForm = () => {
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
                value={usernameReg}
                placeholder="Username"
                onChange={(e) => this.setUsernameReg(e.target.value)}
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
                value={passwordReg}
                placeholder="Password"
                onChange={(e) => setPasswordReg(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* login btn */}
        <Button
          variant="dark"
          size="lg"
          className="mt-3 mb-3"
          onClick={(e) => onHandleRegister(e)}
        >
          <FiUserPlus /> Sign Me Up!
        </Button>
      </Form>
    );
  };

  return (
    <Container>
      <h2 className="mt-3">Login</h2>
      {getLoginForm()}
      <hr />
      <h2 className="mt-3">Register</h2>
      {getRegisterForm()}
    </Container>
  );
}

export default LoginAndReg;
