import React, { Component } from "react";
// import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// import Axios from "axios";
// import logo from "./logo.svg";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navigation from "./components/Navigation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy_data: "abc",
    };
  }

  render() {
    return (
      <Container>
        <Router>
          <Navigation />
        </Router>
        <h1>Hello World!</h1>
      </Container>
    );
  }
}

export default App;
