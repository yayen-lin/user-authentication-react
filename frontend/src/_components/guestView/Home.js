import React, { Component } from "react";

// imports for Bootstrap
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy_data: "abc",
      greeting: "Hello nick!",
      count: 0,
      tab: "a",
    };
  }

  setTab(t) {
    this.setState({ tab: t });
  }

  /**
   * return the header of the home page
   *
   * @returns the header of the home page
   */
  getHeader() {
    return (
      <>
        <h1>Hello from the home page!</h1>
        <h2>Hello from the home page!</h2>
        <h3>Hello from the home page!</h3>
        <h4>Hello from the home page!</h4>
        <h5>Hello from the home page!</h5>
        <h6>Hello from the home page!</h6>
      </>
    );
  }

  getTabs() {
    return (
      <Tabs
        variant="pills"
        activeKey={this.tab}
        onSelect={(t) => this.setTab(t)}
        className="mb-4 justify-content-center nav-justified"
      >
        <Tab eventKey="a" title="nick"></Tab>
        <Tab eventKey="b" title="andy"></Tab>
      </Tabs>
    );
  }

  getButton() {
    return (
      <Button
        variant="dark"
        onClick={() => {
          if (this.state.count % 2 === 0) {
            alert(this.state.greeting); // hello nick
          } else {
            alert("hello andy");
          }
          this.setState({ count: this.state.count + 1 });

          console.log("count: " + this.state.count);
        }}
      >
        Nick What up
      </Button>
    );
  }

  btnTest() {
    return (
      <Button
        variant="dark"
        onClick={() => {
          alert(this.props.token);
        }}
      >
        print token
      </Button>
    );
  }

  render() {
    return (
      <Container>
        {this.getHeader()}
        <hr />
        {this.getTabs()}
        {this.getButton()}
        {this.btnTest()}
      </Container>
    );
  }
}

export default Home;
