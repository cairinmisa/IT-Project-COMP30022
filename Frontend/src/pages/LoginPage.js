import React, { Component } from "react";
import { observer } from "mobx-react";
import "../App.css";
import LoginForm from "./LoginForm";
import SubmitButton from "./SubmitButton";
import UserStore from "../stores/UserStore";
import {Redirect} from 'react-router-dom';

class LoginPage extends Component {
  render() {
    if (UserStore.isLoggedIn) {
      this.props.history.push('/');
      window.location.reload(false);
    } else {
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
