import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { Link } from "react-router-dom";

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
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

  resetSignUp() {
    this.setState({
      name: "",
      email: "",
      password: "",
      buttonDisabled: false
    });
  }

  async doSignUp() {
    if (!this.state.name) {
      return;
    }
    if (!this.state.email) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    this.setState({
      buttonDisbaled: true
    });
  }

  state = {};
  render() {
    return (
      <div className="signupForm">
        <div className="signupForm-content">
          Sign up
          <InputField
            type="text"
            placeholder="Name"
            value={this.state.name ? this.state.name : ""}
            onChange={(val) => this.setInputValue("name", val)}
          ></InputField>
          <InputField
            type="email"
            placeholder="Email"
            value={this.state.email ? this.state.email : ""}
            onChange={(val) => this.setInputValue("email", val)}
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
            onClick={() => this.doSignUp()}
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

export default SignUpForm;
