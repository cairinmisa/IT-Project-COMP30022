import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "../stores/UserStore";
import { Link } from "react-router-dom";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      buttonDisabled: false
    };
  }

  setInputValue(property, val) {
    val = val.trim();
    this.setState({
      [property]: val
    });
  }

  setLimitedInputValue(property, val) {
    val = val.trim();
    if (val.length > 16) {
      return;
    }
    this.setState({
      [property]: val
    });
  }

  resetForm() {
    this.setState({
      email: "",
      password: "",
      buttonDisabled: false
    });
  }

  async doLogin() {
    if (!this.state.email) {
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
          email: this.state.email,
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
          <h1>✨ Log in ✨</h1>
          <InputField
            type="text"
            placeholder="Email"
            value={this.state.email ? this.state.email : ""}
            onChange={(val) => this.setInputValue("email", val)}
          ></InputField>
          <InputField
            type="password"
            placeholder="Password"
            value={this.state.password ? this.state.password : ""}
            onChange={(val) => this.setLimitedInputValue("password", val)}
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
