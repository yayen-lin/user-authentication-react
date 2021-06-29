import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy_data: "abc",
      greeting: "Hello nick!",
      count: 0,
      tab: "a",
    };
  }

  render() {
    return (
      <Container>
        <h1>Hello from the about page!</h1>
        <Button
          className="mt-2"
          variant="dark"
          onClick={() => {
            this.props.isAuth();
          }}
        >
          about
        </Button>
      </Container>
    );
  }
}

export default About;
