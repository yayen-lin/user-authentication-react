import React, { Component } from "react";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";

// imports for icons
import { BsGift } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import {
  FiUser,
  FiEdit,
  FiLogIn,
  FiLogOut,
  FiSearch,
  FiUserPlus,
  FiClipboard,
  FiHelpCircle,
  FiShoppingCart,
} from "react-icons/fi";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarAdmin: ["Home", "About", "Contact", "Profile", "Help", "Logout"],
      navbarUser: ["Home", "About", "Contact", "Help", "Login"],
    };
  }

  /*
   * returns:
   *   the href (route) of the given content.
   */
  getIcons(content) {
    switch (content) {
      case "Logout":
        return (
          <>
            <FiLogOut size="0.9rem" />
          </>
        );
      case "Login":
        return (
          <>
            <FiLogIn size="0.9rem" />
          </>
        );
      case "Profile":
        return (
          <>
            <FiUserPlus size="0.9rem" />
          </>
        );
      case "Help":
        return (
          <>
            <FiShoppingCart size="0.9rem" />
          </>
        );
      case "Home":
        return (
          <>
            <FiUser size="0.9rem" />
          </>
        );
      case "About":
        return (
          <>
            <FiClipboard size="0.9rem" />
          </>
        );
      case "Contact":
        return (
          <>
            <BsGift size="0.9rem" />
          </>
        );
      default:
        return <></>;
    }
  }

  /*
   * returns:
   *   the href (route) of the given content.
   */
  getRoute(content) {
    switch (content) {
      case "Logout":
        return "/logout";
      case "Login":
        return "/login";
      case "Help":
        return "/help";
      case "Home":
        return "/home";
      case "About":
        return "/about";
      case "Contact":
        return "/contact";
      case "Profile":
        return "/profile";
      default:
        return "/";
    }
  }

  /*
   * returns:
   *   multiple bootstrap component by mapping
   *   each content to the corresponding href (route)
   *   and corresponding icon.
   */
  renderRoute(navbarContent) {
    return navbarContent.map((content) =>
      content === "Logout" ? (
        <LinkContainer
          key={content}
          to={this.getRoute(content)}
          // onClick={() => this.props.logout()}
        >
          <Nav.Link>
            {this.getIcons(content)}
            {"  " + content}
          </Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer key={content} to={this.getRoute(content)}>
          <Nav.Link>
            {this.getIcons(content)}
            {"  " + content}
          </Nav.Link>
        </LinkContainer>
      )
    );
  }

  render() {
    let loggedIn = false;
    let navbarContent = loggedIn
      ? this.state.navbarAdmin
      : this.state.navbarUser;

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <h3>
                <IoHomeOutline size="1.3rem" /> Carmax168
              </h3>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">{this.renderRoute(navbarContent)}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Navigation;
