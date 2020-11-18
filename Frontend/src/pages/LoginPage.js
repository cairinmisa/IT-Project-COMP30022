import React, { Component } from "react";
import { observer } from "mobx-react";
import "../App.css";
import LoginForm from "./LoginForm";
import UserStore from "../stores/UserStore";

class LoginPage extends Component {
  render() {
    // If user has already logged in then redirect
    // them to the homepage
    if (UserStore.isLoggedIn) {
      this.props.history.push('/');
      window.location.reload(false);
    } 
    
    // Otherwise render the login form
    else {
      return (
        <div className="app">
          <div className="container">
            <LoginForm />
          </div>
        </div>
      );
    }
  }
}

export default observer(LoginPage);
