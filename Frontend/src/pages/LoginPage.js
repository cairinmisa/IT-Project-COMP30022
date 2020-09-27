import React, { Component } from "react";
import { observer } from "mobx-react";
import "../App.css";
import LoginForm from "./LoginForm";
import SubmitButton from "./SubmitButton";
import UserStore from "../stores/UserStore";
import {Redirect} from 'react-router-dom';

class LoginPage extends Component {
   async doLogout() {
    try {
      let res = await fetch("/logout", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = "";
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (UserStore.isLoggedIn) {
      return  <Redirect  to="/" />
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
