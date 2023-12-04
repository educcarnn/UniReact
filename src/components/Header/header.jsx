import React from "react";
import { Navbar, Container } from "react-bootstrap";
import "./header.css";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className="custom-container">
        <Navbar.Brand>
          <span style={{ marginRight: "10px" }}>Uni</span>
          <span>Social</span>
        </Navbar.Brand>

      </Container>
    </Navbar>
  );
};

export default Header;
