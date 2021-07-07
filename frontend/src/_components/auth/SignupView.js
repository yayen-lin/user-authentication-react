import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// imports for mdb
import {
  MDBRow,
  MDBCol,
  MDBValidation,
  MDBInput,
  MDBBtn,
  MDBCheckbox,
  MDBContainer,
  MDBInputGroup,
  MDBInputGroupText,
  MDBInputGroupElement,
  MDBIcon,
} from "mdb-react-ui-kit";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import "./auth.scss";

function SignupView(props) {
  const [formValue, setFormValue] = useState({
    lname: "",
    fname: "",
    username: "",
    email: "", // in company email
    password: "",
    confirmedPassword: "",
  });

  const [errors, setErrors] = useState({});

  // setting validation message
  const [validateLN, setValidateLN] = useState("請輸入您的姓氏"); // lastname
  const [validateFN, setValidateFN] = useState("請輸入您的名字"); // firstname
  const [validateUN, setValidateUN] = useState("請輸入您的用戶名"); // username
  const [validateEmail, setValidateEmail] = useState("請輸入您的電子郵件"); // email
  const [validatePW, setValidatePW] = useState("請輸入您想要設定的密碼"); // password
  const [validateCPW, setValidateCPW] = useState("請再次輸入您的密碼"); // confirmed password

  const onChange = (e) => {
    // trim extra whitespace
    setFormValue({ ...formValue, [e.target.name]: e.target.value.trim() });
  };

  // in company email
  // validate username

  const clearSignupFields = () => {
    setFormValue({
      ...formValue,
      lname: "",
      fname: "",
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let allErrors = {};

    if (!formValue.lname) {
      allErrors.lname_error = "請輸入您的姓氏";
    }

    if (!formValue.fname) {
      allErrors.fname_error = "請輸入您的名字";
    }

    if (!formValue.username) {
      allErrors.username_error = "請輸入您的用戶名";
    }

    if (!formValue.email) {
      allErrors.email_error = "請輸入您的電子郵件";
    }

    if (!formValue.password) {
      allErrors.password_error = "請輸入您想要設定的密碼";
    }

    if (!formValue.confirmedPassword) {
      allErrors.confirmedPassword_error = "請再次輸入您的密碼";
    }

    const user = {
      lname: formValue.lname,
      fname: formValue.fname,
      username: formValue.username,
      email: formValue.email, // in company email
      password: formValue.password,
      confirmedPassword: formValue.confirmedPassword,
      privilege: "0", // on signup, privilege set to 0 (can be changed by admin)
    };

    console.log(user);

    if (allErrors) {
      setErrors(allErrors);
      console.log(allErrors);
      return;
    } else {
      // call signup
      // let signupResult = await this.props.signup(user);
      // clear fields upon successful signup
      // clearSignupFields();
      // <Redirect to="/login" />;
    }
  };

  return (
    <MDBContainer className="my-4 justify-content-center">
      <h1>註冊</h1>
      <hr />
      <Form
        onSubmit={(e) => handleSubmit(e)}
        className="row g-3"
        noValidate // calls off browser's default validation and use our customized one>
      >
        <Form.Row>
          {/* lastname */}
          <Form.Group
            as={Col}
            xl="4"
            className="floating-label-group has-validation form-outline mt-4"
          >
            <Form.Control
              type="text"
              id="validate-lname"
              name="lname"
              value={formValue.lname}
              onChange={onChange}
              autoComplete="off"
              isInvalid={!!errors.lname}
              required
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.lname}
            </Form.Control.Feedback>
            <Form.Label class="floating-label">姓</Form.Label>
          </Form.Group>

          {/* firstname */}
          <Form.Group
            as={Col}
            xl="4"
            className="floating-label-group has-validation form-outline mt-4"
          >
            <Form.Control
              type="text"
              id="validate-fname"
              name="fname"
              value={formValue.fname}
              onChange={onChange}
              autoComplete="off"
              isInvalid={!!errors.fname}
              required
            />
            <Form.Label class="floating-label">名</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.fname}
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        {/* username */}
        <MDBRow className="position-relative">
          <MDBCol xl="4" className="position-relative mt-4">
            <div className="floating-label-group has-validation form-outline input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="username-prepend-icon">
                  <MDBIcon className="ms-1" icon="at" size="1.5x" />
                </span>
              </div>
              <input
                type="text"
                id="validation-username"
                class="form-control"
                name="username"
                value={formValue.username}
                onChange={onChange}
                autoComplete="off"
                required
              />

              <label class="floating-label-w-icon">用戶名</label>
              <div className="invalid-tooltip">{validateUN}</div>
            </div>

            {/* email */}
            {/* TODO: border overlapped for some reasons */}
          </MDBCol>
          <MDBCol xl="4" className="position-relative mt-4">
            <div className="floating-label-group has-validation form-outline input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="email-prepend-icon">
                  <MDBIcon
                    className="ms-1"
                    icon="envelope-square"
                    size="1.5x"
                  />
                </span>
              </div>
              <input
                type="text"
                id="validation-email"
                className="form-control"
                name="email"
                value={formValue.email}
                onChange={onChange}
                autoComplete="off"
                required
              />
              <label class="floating-label-w-icon">電子郵件</label>
              <div class="input-group-append">
                <span
                  class="input-group-text"
                  id="email-append"
                  style={{ paddingLeft: "0px" }}
                >
                  <strong style={{ fontSize: "0.8rem" }}>@carmax168.com</strong>
                </span>
              </div>

              {/* error message */}
              <div className="invalid-tooltip">{validateEmail}</div>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          {/* password */}
          <MDBCol xl="4" className="position-relative mt-4">
            <div className="floating-label-group has-validation form-outline">
              <input
                type="password"
                id="validation-password"
                className="form-control"
                name="password"
                value={formValue.password}
                onChange={onChange}
                autoComplete="off"
                required
              />
              <label class="floating-label">密碼</label>

              {/* error message */}
              <div className="invalid-tooltip">{validatePW}</div>
            </div>
          </MDBCol>

          {/* confirmed password */}
          <MDBCol xl="4" className="position-relative mt-4">
            <div className="floating-label-group has-validation form-outline">
              <input
                type="password"
                id="validation-confirmedPassword"
                className="form-control"
                name="confirmedPassword"
                value={formValue.confirmedPassword}
                onChange={onChange}
                autoComplete="off"
                required
              />
              <label class="floating-label">確認密碼</label>
              {/* error message */}
              <div className="invalid-tooltip">{validatePW}</div>
            </div>
          </MDBCol>
        </MDBRow>

        {/* <div className="col-12 position-relative">
          <MDBCheckbox
            validation={validateCB}
            validationTooltip
            label={"我接受 camrax168 的服務約定條款"}
            id="validationTooltip-checkbox"
            required
            invalid
          />
        </div> */}

        {/* submit btn */}
        <div className="col-12 pt-2 position-relative">
          <MDBBtn
            outline
            rounded
            className="mx-2"
            color="dark"
            type="submit"
            // onClick={(e) => handleSubmit(e)}
          >
            註冊！
          </MDBBtn>
        </div>
      </Form>
    </MDBContainer>
  );
}

export default SignupView;
