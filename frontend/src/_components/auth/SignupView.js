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

  const [error, setError] = useState(true);

  // setting validation message
  const [validateLN, setValidateLN] = useState("請輸入您的姓氏"); // lastname
  const [validateFN, setValidateFN] = useState("請輸入您的名字"); // firstname
  const [validateUN, setValidateUN] = useState("請輸入您的用戶名"); // username
  const [validateEmail, setValidateEmail] = useState("請輸入您的電子郵件"); // email
  const [validatePW, setValidatePW] = useState("請輸入您想要設定的密碼"); // password
  const [validateCPW, setValidateCPW] = useState("請再次輸入您的密碼"); // confirmed password
  const [validateCB, setValidateCB] = useState("請點選接受然後註冊"); // checkbox

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
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

    if (
      !formValue.lname ||
      !formValue.fname ||
      !formValue.username ||
      !formValue.email ||
      !formValue.password ||
      !formValue.confirmedPassword
    ) {
      setError(true);
    }
    if (!error) {
      setError(false);
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
      <MDBValidation
        className="row g-3"
        noValidate // calls off browser's default validation and use our customized one
      >
        {/* lastname */}
        <MDBRow>
          <MDBCol lg="4" className="position-relative mt-4">
            {/* <MDBInput
              validation={validateLN}
              validationTooltip
              label="姓"
              id="validationTooltip-lname"
              name="lname"
              value={formValue.lname}
              onChange={onChange}
              required
              invalid
            /> */}
            <div class="floating-label-group has-validation">
              <input
                type="text"
                id="validate-lname"
                class="form-control"
                name="lname"
                value={formValue.lname}
                onChange={onChange}
                required
              />
              <label class="floating-label">姓</label>
              <div class="invalid-tooltip">{validateLN}</div>
            </div>
          </MDBCol>

          {/* firstname */}
          <MDBCol lg="4" className="position-relative mt-4">
            <MDBInput
              validation={validateFN}
              validationTooltip
              label="名"
              id="validationTooltip-fname"
              name="fname"
              value={formValue.fname}
              onChange={onChange}
              required
              invalid
            />
          </MDBCol>
        </MDBRow>

        {/* username */}
        <MDBRow className="position-relative">
          <MDBCol lg="4" className="position-relative mt-4">
            <div className="input-group has-validation form-outline">
              <span
                className="input-group-text"
                id="validationTooltipUsernamePrepend"
              >
                <MDBIcon className="ms-1" icon="at" size="1.5x" />
              </span>
              <input
                type="text"
                class="form-control"
                id="validationTooltip-username"
                aria-describedby="validationTooltipUsernamePrepend"
                name="username"
                value={formValue.username}
                onChange={onChange}
                required
              />
              <label
                htmlFor="validationTooltip-username"
                class="form-label"
                style={{ marginLeft: "3em" }}
              >
                用戶名
              </label>
              <div className="invalid-tooltip">{validateUN}</div>
              <div class="form-notch">
                <div class="form-notch-leading" style={{ width: "70px" }}></div>
                <div class="form-notch-middle" style={{ width: "60px" }}></div>
                <div class="form-notch-trailing"></div>
              </div>
            </div>
            {/* </div> */}
          </MDBCol>
          <MDBCol lg="4" className="position-relative mt-4">
            {/* email */}
            {/* TODO: border overlapped for some reasons */}
            {/* <div className="col-12 col-md-6 position-relative"> */}
            <div className="input-group has-validation form-outline">
              {/* prepend element */}
              <span className="input-group-text" id="inputGroupPrepend">
                <MDBIcon className="ms-1" icon="envelope-square" size="lg" />
              </span>
              <input
                type="text"
                className="form-control"
                id="validationTooltip-email"
                name="email"
                value={formValue.email}
                onChange={onChange}
                required
              />
              <label
                for="validationTooltipUsername"
                class="form-label"
                style={{ marginLeft: "3em" }}
              >
                電子郵件
              </label>

              {/* append element */}
              <span className="input-group-text" id="inputGroupAppend">
                <strong style={{ fontSize: "0.8rem" }}>@carmax168.com</strong>
              </span>
              {/* error message */}
              <div className="invalid-tooltip">{validateEmail}</div>

              <div class="form-notch">
                <div class="form-notch-leading" style={{ width: "70px" }}></div>
                <div class="form-notch-middle" style={{ width: "80px" }}></div>
                <div class="form-notch-trailing"></div>
              </div>
            </div>
            {/* </div> */}
          </MDBCol>
        </MDBRow>

        <MDBRow>
          {/* password */}
          <MDBCol lg="4" className="position-relative mt-4">
            <MDBInput
              validation={validatePW}
              validationTooltip
              label="密碼"
              id="validationTooltip-password"
              name="password"
              value={formValue.password}
              onChange={onChange}
              type="password"
              required
              invalid
            />
          </MDBCol>

          {/* confirmed password */}
          <MDBCol lg="4" className="position-relative mt-4">
            <MDBInput
              validation={validateCPW}
              validationTooltip
              label="確認密碼"
              id="validationTooltip-confirmedPassword"
              name="confirmedPassword"
              value={formValue.confirmedPassword}
              onChange={onChange}
              type="password"
              required
              invalid
            />
          </MDBCol>
        </MDBRow>

        {/* <input
              type="text"
              className="form-control"
              id="validationTooltip-username"
              placeholder="用戶名"
              name="username"
              value={formValue.username}
              onChange={onChange}
              required
            />
            <div className="invalid-tooltip">{validateUN}</div> */}

        <div className="col-12 position-relative">
          {/* TODO: Add a modal that shows terms and conditions */}
          <MDBCheckbox
            validation={validateCB}
            validationTooltip
            label={"我接受 camrax168 的服務約定條款"}
            id="validationTooltip-checkbox"
            required
            invalid
          />
        </div>

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
      </MDBValidation>
    </MDBContainer>
  );
}

export default SignupView;
