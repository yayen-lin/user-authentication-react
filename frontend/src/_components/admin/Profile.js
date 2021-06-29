import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // redirect to login page if user is not logged in
    // console.log(this.props.isLoggedIn());
    if (!this.props.isLoggedIn()) return <Redirect to="/login-and-reg" />;
    return (
      <Container>
        <h1>Hello {this.props.currentUser.username}</h1>
        <Button
          className="mt-2"
          variant="dark"
          onClick={() => {
            this.props.isAuth(
              this.props.currentUser.profile,
              this.props.currentUser.token
            );
          }}
        >
          isAuth
        </Button>
      </Container>
    );
  }
}

export default Profile;
