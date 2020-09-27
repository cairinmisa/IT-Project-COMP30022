import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { Link } from "react-router-dom";
import axios from "axios";

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      fullname: "",
      dob: "",
      password: "",
      buttonDisabled: false
    };
  }

  setInputValue(property, val) {
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

  resetSignUp() {
    this.setState({
      email: "",
      username: "",
      fullname: "",
      dob: "",
      password: "",
      buttonDisabled: false
    });
  }

  handleResponse(response) {
    //handle success
    console.log(this);
    console.log(response.data);
    if(response.data.result == "Success") {
      return;
    }
    else {
      alert("An error has occurred.");
      this.resetForm();
    }
  }

  handleResponseError(response) {
    //handle error
    console.log(response);
    this.resetSignUp();
  }

  async doSignUp() {
    if (!this.state.email) {
      return;
    }
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    this.setState({
      buttonDisabled: true
    });

    axios({
      method: 'post',
      url: 'http://localhost:8000/profile',
      data: {
        email: this.state.email,
        username: this.state.username,
        fullname: this.state.fullname,
        dob: this.state.dob,
        password: this.state.password,
      }
      })
      .then(res => this.handleResponse(res))
      .catch(res => this.handleResponseError(res));    
    
  }

  state = {};
  render() {
    return (
      <div className="signupForm">
        <div className="signupForm-content">
          <h1>✏️ Sign up ✏️</h1>
          <InputField
            type="email"
            placeholder="Email"
            value={this.state.email ? this.state.email : ""}
            onChange={(val) => this.setInputValue("email", val)}
          ></InputField>
          <InputField
            type="text"
            placeholder="Display Username"
            value={this.state.username ? this.state.username : ""}
            onChange={(val) => this.setLimitedInputValue("username", val)}
          ></InputField>
          <InputField
            type="text"
            placeholder="Full name"
            value={this.state.fullname ? this.state.fullname : ""}
            onChange={(val) => this.setInputValue("fullname", val)}
          ></InputField>
          <InputField
            type="password"
            placeholder="Password"
            value={this.state.password ? this.state.password : ""}
            onChange={(val) => this.setLimitedInputValue("password", val)}
          ></InputField>
          <span className="inputHint">Date of birth.</span>
            <InputField
              type="date"
              placeholder="Date of birth"
              value={this.state.dob ? this.state.dob : ""}
              onChange={(val) => this.setInputValue("dob", val)}
            ></InputField>
          <SubmitButton
            text="Sign Up"
            disabled={this.state.buttonDisabled}
            onClick={() => this.doSignUp()}
          ></SubmitButton>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="red">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default SignUpForm;
