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
      // <Container>
      //   <h1>Hello from the about page!</h1>
      //   <Button
      //     className="mt-2"
      //     variant="dark"
      //     onClick={() => {
      //       this.props.isAuth();
      //     }}
      //   >
      //     about
      //   </Button>
      // </Container>
      <div class="lightbox">
        <div class="row">
          <div class="col-lg-4">
            <img
              src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/1.jpg"
              data-mdb-img="https://mdbootstrap.com/img/Photos/Slides/1.jpg"
              alt="Lightbox image 1"
              class="w-100"
            />
          </div>
          <div class="col-lg-4">
            <img
              src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/2.jpg"
              data-mdb-img="https://mdbootstrap.com/img/Photos/Slides/2.jpg"
              alt="Lightbox image 2"
              class="w-100"
            />
          </div>
          <div class="col-lg-4">
            <img
              src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/3.jpg"
              data-mdb-img="https://mdbootstrap.com/img/Photos/Slides/3.jpg"
              alt="Lightbox image 3"
              class="w-100"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default About;
