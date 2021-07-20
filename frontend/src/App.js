import "./App.css";
import React, { Component } from "react";

// react router
import {
  BrowserRouter as Router,
  // Router,
  Switch,
  Route,
  // Link,
  Redirect,
} from "react-router-dom";
// import { history } from "./_helpers/history";
// import { PrivateRoute } from "./_components/PrivateRoute";

// service and helpers
import AuthService from "./_services/auth.service";

// imports for action notification
// reference: https://fkhadra.github.io/react-toastify/introduction
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// auth
import LoginAndRegView from "./_components/auth/LoginAndRegView";

// admin
import Dashboard from "./_components/admin/Dashboard";

// guest views
import Home from "./_components/guestView/Home";
import Navigation from "./_components/guestView/Navigation";
import cookieParser from "cookie-parser";
import { Cookie } from "express-session";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      token: "",
      refresh: "",
      isLoggedIn: false,
      timeToRefresh: null,
    };
  }

  componentDidMount() {
    // Call this function so that it fetch first time right after mounting the component
    this.getInfo();

    console.log(this.state);

    // set Interval
    this.interval = setInterval(() => this.getInfo(), 35 * 1000); // TODO: change to actual token expiry
  }

  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.interval);
  }

  /**
   * Get the user info and set isLoggedIn to true if a cookie with token is found in the cookies storage;
   * otherwise set isLoggedIn to false.
   *
   * refresh user's access token if the token is about to expire.
   */
  getInfo() {
    // console.log("GET INFO, this state", this.state);
    // console.log("GET INFO, token", this.state.token); // FIXME: this.state.token is undefined ...
    AuthService.getUserInfo()
      .then((response) => {
        console.log(response);
        // this.setState({
        //   currentUser: response.data,
        //   token: response.data.token,
        //   refresh: response.data.refresh,
        //   isLoggedIn: true,
        // });
        this.setToLoggedIn(response.data);
        console.log(response.data);

        // if response.toRefresh is true, then it's time to refresh our access token.
        if (response.data.toRefresh) {
          console.log("Token about to get refreshed!");
          AuthService.refreshToken(this.state.currentUser).then((response) => {
            console.log(response);
            console.log("Token has refreshed!");
          });
        }
      })
      .catch((error) => {
        console.log(error);
        // const err = error.data || null;
        // if (err !== null && err.message.startsWith("TokenExpiredError")) {
        //   // TODO: call refresh token
        //   console.log(err);
        //   AuthService.refreshToken(this.state.currentUser, this.state.refresh);
        // } else {
        // remove all cookies if token expired
        this.setState({
          currentUser: "",
          token: "",
          refresh: "",
          isLoggedIn: false,
        });
        // }
      });
    console.log("GET INFO, this state", this.state);
    console.log("GET INFO, token", this.state.token);
  }

  /**
   * Set logged in user info to state
   *
   * @param {*} response: 'response.data' from the server
   */
  setToLoggedIn(response) {
    if (response)
      this.setState({
        currentUser: response.user,
        token: response.token,
        refresh: response.refresh,
        isLoggedIn: true,
      });
    console.log("SET TO LOGIN, ", this.state);
  }

  /**
   * Clear our logged out user info to the state
   */
  setToLoggedOut() {
    this.setState({
      currentUser: "",
      token: "",
      refresh: "",
      isLoggedIn: false,
    });
  }

  // visitor (if not logged in)
  // If the state is logged in, the profile is not empty and will have the logged in user info
  // else this user is a visitor
  isLoggedIn() {
    if (this.state.currentUser) return true;
    return false;
  }

  // Admin (loggedIn = true)
  // - the person that has higher authority
  // - privilege is set to 1
  // - has access to manage site managers and admins
  // - can do simple edition to the site (e.g. update site info)
  isAdmin() {
    if (this.isLoggedIn())
      return this.state.currentUser.privilege.toString() === "1";
    return false;
  }

  // Vice Admin (loggedIn = true)
  // - the person that has higher authority
  // - privilege is set to 2
  // - has access to manage site managers and admins
  // - can do simple edition to the site (e.g. update site info)
  isAdmin() {
    if (this.isLoggedIn())
      return this.state.currentUser.privilege.toString() === "2";
    return false;
  }

  // Manager (loggedIn = true)
  // - a person that manage the site
  // - privilege is set to 3
  // - has no access to manage site managers and admins
  // - can do simple edition to the site (e.g. update site info)
  isManager() {
    if (this.isLoggedIn())
      return this.state.currentUser.privilege.toString() === "3";
    return false;
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
        // this.setUsername(response.username);
        // this.setToken(response.token);
        // this.setProfile(response.profile);

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
    // console.log("App.js - login - store.getState() = ", store.getState());
    return AuthService.login(user).then((response) => {
      if (!response.status) {
        // When the API returns `message`, that means the login has failed
        toast.error(response.message);
        return -1;
      } else {
        console.log(response);
        this.setToLoggedIn(response.data);

        // We only need to import toast in other components
        // if we want to make a notification there.
        toast.success("🚀 Successfully logged in!");

        return 0;
      }
    });
  }

  async logout() {
    console.log("LOGGING OUT");
    return AuthService.logout(this.state.token).then((response) => {
      if (response.error) {
        toast.error(response.message);
      } else {
        console.log(response);
        this.setToLoggedOut();
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
        <Router /*history={history}*/>
          <ToastContainer
            position="top-right"
            autoClose={1000} // set to 1 sec
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
              isLoggedIn={this.state.isLoggedIn}
              logout={() => this.logout()}
              isAdmin={() => this.isAdmin()}
              isManager={() => this.isManager()}
            />
            <Switch id="body-switch">
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/login-and-reg">
                <LoginAndRegView
                  login={(user) => this.login(user)}
                  signup={(user) => this.signup(user)}
                  isLoggedIn={() => this.isLoggedIn()}
                />
              </Route>
              <Route exact path="/dashboard">
                <Dashboard currentUser={this.state.currentUser} />
              </Route>

              {/* Redirect to home page */}
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              {/* Redirect logout to home page */}
              <Route exact path="/adminLogout">
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
