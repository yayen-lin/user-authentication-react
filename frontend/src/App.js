import "./App.css";
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  Redirect,
} from "react-router-dom";

// imports for action notification
// reference: https://fkhadra.github.io/react-toastify/introduction
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// auth
import AuthService from "./services/auth.service";
import LoginAndRegView from "./components/auth/LoginAndRegView";

// admin
import Profile from "./components/admin/Profile";

// guest views
import Home from "./components/guestView/Home";
import Help from "./components/guestView/Help";
import About from "./components/guestView/About";
import Contact from "./components/guestView/Contact";
import GuestForm from "./components/guestView/GuestForm";
import Navigation from "./components/guestView/Navigation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      profile: "",
    };
  }

  setUsername(un) {
    this.setState({
      username: un,
    });
    console.log("setUsername: ", this.state.username);
  }

  setToken(token) {
    this.setState({
      token: token,
    });
    // console.log("setUsername: ", this.state.username);
  }

  setProfile(userInfo) {
    this.setState({
      profile: userInfo,
    });
    console.log("setProfile: ", this.state.profile);
  }

  // Admin (loggedIn = true)
  // - the person that has higher authority
  // - privilege is set to 1
  // - has access to manage site managers and admins
  // - can do simple edition to the site (e.g. update site info)
  isAdmin() {
    return this.state.profile.privilege === 1;
  }

  // Manager (loggedIn = true)
  // - a person that manage the site
  // - privilege is set to 0
  // - has no access to manage site managers and admins
  // - can do simple edition to the site (e.g. update site info)
  isManager() {
    return this.state.profile.privilege === 0;
  }

  // visitor (if not logged in)
  // If the state is logged in, the profile is not empty and will have the logged in user info
  // else this user is a visitor
  isLoggedIn() {
    return this.state.profile !== "";
  }

  /**
   * Sign up
   * -
   *
   * @param {Object} user Object with `username` and `password` as keys
   * @returns 0 if sign up successful, -1 if sign up failure
   */
  async signup(user) {
    return AuthService.signup(user).then((response) => {
      console.log("res", response);
      if (response.message) {
        // When the API returns `message`, that means the signup has failed
        if (response.message.failureMsg) {
          // Duplicate username
          toast.error(response.message.failureMsg);
          return -1;
        }

        toast.error(response.message);
        return -1;
      } else {
        console.log(response);
        console.log(user);
        this.setUsername(response.username);
        this.setToken(response.token);
        this.setProfile(response.profile);

        // We only need to import toast in other components
        // if we want to make a notification there.
        toast.success("🚀 Successfully signed up!");

        return 0;
      }
    });
  }

  /**
   * Log in
   * - fetch profile of the user, and store user info in the state.
   *
   * @param {Object} user Object with `username` and `password` as keys
   * @returns 0 if login successful, -1 if login failure
   */
  async login(user) {
    return AuthService.login(user).then((response) => {
      if (response.message) {
        // When the API returns `message`, that means the login has failed
        toast.error(response.message);
        return -1;
      } else {
        console.log(response);
        console.log(user);
        this.setUsername(response.username);
        this.setToken(response.token);
        this.setProfile(response.profile);

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", user.username);

        // We only need to import toast in other components
        // if we want to make a notification there.
        toast.success("🚀 Successfully logged in!");

        return 0;
      }
    });
  }

  async logout() {
    return AuthService.logout().then((response) => {
      if (response.error) {
        toast.error(response.message);
      } else {
        console.log(response);
        this.setUsername("");
        this.setToken("");
        this.setProfile("");

        // remove user from local storage to log user out
        localStorage.removeItem("user");

        toast.info("👋 You are logged out. See you again!");
      }
    });
  }

  // note:
  // 1. [Router, Switch, Route, Redirect]
  //    https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home
  render() {
    return (
      <div id="body-div">
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={3000} // set to 3 sec
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div>
            <Navigation
              profile={this.state.profile}
              isLoggedIn={() => this.isLoggedIn()}
              logout={() => this.logout()}
              isAdmin={this.isAdmin.bind(this)}
              isManager={this.isAdmin.bind(this)}
            />
            <Switch id="body-switch">
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/help">
                <Help />
              </Route>
              <Route exact path="/form">
                <GuestForm />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/login-and-reg">
                <LoginAndRegView
                  login={(user) => this.login(user)}
                  signup={(user) => this.signup(user)}
                />
              </Route>
              <Route exact path="/contact">
                <Contact />
              </Route>
              <Route exact path="/profile">
                <Profile
                  isLoggedIn={() => this.isLoggedIn()}
                  profile={this.state.profile}
                />
              </Route>

              {/* Redirect to home page */}
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              {/* Redirect logout to home page */}
              <Route path="/logout">
                <Redirect push to="/home" />
              </Route>
              {/* 404 Not Found */}
              <Route path="*">
                <div>404 Not Found</div>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
