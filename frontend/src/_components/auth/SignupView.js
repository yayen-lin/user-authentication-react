import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// imports for mdb
import {
  MDBValidation,
  MDBInput,
  MDBBtn,
  MDBCheckbox,
  MDBContainer,
  MDBInputGroup,
  MDBInputGroupText,
  MDBInputGroupElement,
} from "mdb-react-ui-kit";

function SignupView(props) {
  const [formValue, setFormValue] = useState({
    lname: "",
    fname: "",
    username: "",
    email: "", // in company email
    password: "",
    confirmedPassword: "",
  });

  // setting validation message
  const [validateLN, setValidateLN] = useState("請輸入您的姓氏");
  const [validateFN, setValidateFN] = useState("請輸入您的名字");
  const [validateUN, setValidateUN] = useState("請輸入您的用戶名");
  const [validateEmail, setValidateEmail] = useState("請輸入您的電子郵件");
  const [validatePW, setValidatePW] = useState("請輸入您想要設定的密碼");
  const [validateCPW, setValidateCPW] = useState("請再次輸入您的密碼");

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  // in company email
  // validate username

  const clearSignupFields = () => {
    setFormValue({
      lname: "",
      fname: "",
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
    });
  };

  const onHandleSignup = async (e) => {
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

    let errors = false;

    if (
      !formValue.lname ||
      !formValue.fname ||
      !formValue.username ||
      !formValue.email ||
      !formValue.password ||
      !formValue.confirmedPassword
    ) {
      errors = true;
    }
    if (!errors) {
      // let signupResult = await this.props.signup(user);
      // clear fields upon successful signup
      clearSignupFields();
    }
  };

  return (
    <MDBContainer className="my-4">
      <MDBValidation className="row g-3" noValidate>
        {/* lastname */}
        <div className="col-md-6 position-relative">
          <MDBInput
            validation={validateLN}
            validationTooltip
            label="姓"
            id="validationTooltip-lname"
            name="lname"
            value={formValue.lname}
            onChange={onChange}
            required
            invalid
          />
        </div>

        {/* firstname */}
        <div className="col-md-6 position-relative">
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
        </div>

        {/* username */}
        <div className="col-md-6 position-relative">
          <div className="input-group has-validation">
            <span className="input-group-text" id="inputGroupPrepend">
              @
            </span>
            <input
              type="text"
              className="form-control"
              id="validationTooltip-username"
              placeholder="用戶名"
              name="username"
              value={formValue.username}
              onChange={onChange}
              required
            />
            <div className="invalid-tooltip">{validateUN}</div>
          </div>
        </div>

        {/* email */}
        <div className="col-md-6 position-relative">
          <MDBInput
            validation={validateEmail}
            validationTooltip
            label="電子郵件"
            id="validationTooltip-email"
            name="email"
            value={formValue.email}
            onChange={onChange}
            required
            invalid
          />
        </div>

        {/* password */}
        <div className="col-md-6 position-relative">
          <MDBInput
            validation={validatePW}
            validationTooltip
            label="密碼"
            id="validationTooltip-password"
            name="password"
            value={formValue.zip}
            onChange={onChange}
            required
            invalid
          />
        </div>

        {/* confirmed password */}
        <div className="col-md-6 position-relative">
          <MDBInput
            validation={validateCPW}
            validationTooltip
            label="確認密碼"
            id="validationTooltip-confirmedPassword"
            name="confirmedPassword"
            value={formValue.zip}
            onChange={onChange}
            required
            invalid
          />
        </div>

        {/* submit btn */}
        <div className="col-12 pt-2">
          <MDBBtn
            outline
            rounded
            className="mx-2"
            color="dark"
            type="submit"
            onClick={(e) => onHandleSignup(e)}
          >
            註冊！
          </MDBBtn>
        </div>
      </MDBValidation>
    </MDBContainer>
  );
}

export default SignupView;
