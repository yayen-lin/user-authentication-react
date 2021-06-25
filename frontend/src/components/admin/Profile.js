import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Profile extends Component {
  render() {
    // redirect to login page if user is not logged in
    if (!this.props.isLoggedIn()) return <Redirect to="/login-and-reg" />;
    return <h1>Hello {this.props.profile.username}</h1>;
  }
}

export default Profile;
