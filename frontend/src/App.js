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

import Home from "./components/Home";
import Help from "./components/Help";
import About from "./components/About";
import Contact from "./components/Contact";
import Navigation from "./components/Navigation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy_data: "abc",
    };
  }

  // note:
  // https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home
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
              <Route exact path="/about">
                <About />
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
