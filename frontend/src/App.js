import React, { Component } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
// import Axios from "axios";
// import logo from "./logo.svg";
import "./App.css";

import Container from "react-bootstrap/Container";

// auth
import Login from "./components/auth/Login";

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
      dummy_data: "abc",
    };
  }

  // note:
  // 1. [Router, Switch, Route, Redirect]
  //    https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home
  render() {
    return (
      <div>
        <Router>
          <div>
            <Navigation />
            <Switch id="body">
              <Route
                exact
                path="/"
                render={() => {
                  <Redirect to="/home" />;
                }}
              />
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
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/contact">
                <Contact />
              </Route>
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
