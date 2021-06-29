import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// services
import AuthService from "../../_services/auth.service";
import UserService from "../../_services/user.service";

// imports for bootstrap
import Container from "react-bootstrap/Container";

// imports for icons
import { FFiUserMinus, FiUserPlus, FiUserX } from "react-icons/fi";

class StaffManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentUser: AuthService.currentUserValue,
      // users: null,
    };
  }

  // getUsers() {
  //   // TODO: get a lsit of all the staffs for admin to manage them
  //   UserService.getAll().then((users) => this.setState({ users }));
  // }

  render() {
    // redirect to login page if user is not logged in
    // console.log(this.props.isLoggedIn());
    console.log(this.props.isAdmin());
    if (!this.props.isLoggedIn()) return <Redirect to="/login-and-reg" />;

    // const { currentUser, users } = this.state;
    return (
      <Container>
        <h1>WELCOME TO MY STAFF MANAGER!</h1>
        {this.props.isAdmin() ? (
          // only admin is allowed to manage staffs
          <h3>Hi {this.props.currentUser.username}!!</h3>
        ) : (
          <p>You are not allowed to use staff manager.</p>
        )}
        {/* <div>
          <h1>Hi {currentUser}!</h1>
          <p>You're logged in with React & JWT!!</p>
          <h3>Users from secure api end point:</h3>
          {users && (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.firstName} {user.lastName}
                </li>
              ))}
            </ul>
          )}
        </div> */}
      </Container>
    );
  }
}

export default StaffManager;
