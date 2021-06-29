import React, { Component } from "react";

import { FFiUserMinus, FiUserPlus, FiUserX } from "react-icons/fi";

import Container from "react-bootstrap/Container";

import AuthService from "../../_services/auth.service";
import UserService from "../../_services/user.service";

class StaffManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.currentUserValue,
      users: null,
    };
  }

  componentDidMount() {}

  getUsers() {
    // TODO: get a lsit of all the staffs for admin to manage them
    UserService.getAll().then((users) => this.setState({ users }));
  }

  render() {
    return (
      <Container>
        <h1>WELCOME TO MY STAFF MANAGER!</h1>

        {this.props.privilege === 0 ? (
          <p>You are not allowed to use staff manager.</p>
        ) : (
          // only admin is allowed to manage staffs
          <h3>Hi {this.props.username}!!</h3>
        )}
      </Container>
    );
  }
}

export default StaffManager;
