import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserStore from "./stores/UserStore";

class Nav extends Component {
  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    if(UserStore.isLoggedIn === false){
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
            <li>{this.capitaliseName(UserStore.user ? UserStore.user.firstName : "")}</li>
          </Link>
        </ul>
      </div>
      )
    }
  }
}

export default Nav;
