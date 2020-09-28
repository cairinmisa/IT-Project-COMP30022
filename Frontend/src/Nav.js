import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    if(this.props.isLoggedIn === false){
      return (
        <div className="navBar">
          <ul>
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/editor" >
              <li>Create</li>
            </Link>
            <Link to = "/template">
              <li>Templates</li>
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
    else{
      return(
        <div className="navBar">
        <ul>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/editor">
            <li>Create</li>
          </Link>
          <Link to = "/template">
            <li>Templates</li>
          </Link>
          <li>|</li>
          <Link to = "/profile">
            <li>Profile</li>
          </Link>
        </ul>
      </div>
      )
    }
  }
}

export default Nav;
