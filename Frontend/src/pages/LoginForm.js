import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "../stores/UserStore";
import { Link } from "react-router-dom";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      buttonDisabled: false
    };
  }

  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 12) {
      return;
    }
    this.setState({
      [property]: val
    });
  }

  resetForm() {
    this.setState({
      username: "",
      password: "",
      buttonDisabled: false
    });
  }

  async doLogin() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    this.setState({
      buttonDisbaled: true
    });
    try {
      let res = await fetch("/login", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      let result = await res.json();
      if (res && result.success) {
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else if (res && result.success === false) {
        this.resetForm();
        alert(result.msg);
      }
    } catch (e) {
      console.log(e);
      this.resetForm();
    }
  }

  state = {};
  render() {
    return (
      <div className="loginForm">
        <div className="loginForm-content">
          Log in
          <InputField
            type="text"
            placeholder="Username"
            value={this.state.username ? this.state.username : ""}
            onChange={(val) => this.setInputValue("username", val)}
          ></InputField>
          <InputField
            type="password"
            placeholder="Password"
            value={this.state.password ? this.state.password : ""}
            onChange={(val) => this.setInputValue("password", val)}
          ></InputField>
          <SubmitButton
            text="Continue"
            disbaled={this.state.buttonDisabled}
            onClick={() => this.doLogin()}
          ></SubmitButton>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="red">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default LoginForm;
