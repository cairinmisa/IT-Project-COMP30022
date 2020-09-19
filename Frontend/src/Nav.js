import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    return (
      <div className="navBar">
        <ul>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/editor">
            <li>Create</li>
          </Link>
          <li>|</li>
          <Link to="/login">
            <li>Log in</li>
          </Link>
          <Link to="/signup">
            <li>Sign up</li>
          </Link>
        </ul>
      </div>
    );
  }
}

export default Nav;
