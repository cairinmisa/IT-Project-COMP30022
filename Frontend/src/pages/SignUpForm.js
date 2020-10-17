import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { Link } from "react-router-dom";
import axios from "axios";
import {host} from "../stores/Settings"
import GoogleLoginButton from "../components/GoogleLoginButton";
import UserStore from "../stores/UserStore";

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      dob: "",
      password: "",
      confirmPassword: "",
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
      firstName: "",
      lastName: "",
      dob: "",
      password: "",
      confirmPassword: "",
      buttonDisabled: false
    });
  }

  handleResponse(response) {
    //handle success
    console.log(response.data);
    if(response.data.hasErrors === "False") {
      this.props.history.push('/login');
    }
    else if (response.data.hasErrors === "True"){
      if(response.data.emailnotFound === "True"){
        alert("Email not found.");
      }
      if(response.data.passwordIncorrect === "True"){
        alert("Password is incorrect.");
      }
      if(response.data.emailValid === "False"){
        alert("Email not valid.");
      }
      if(response.data.passwordGiven === "False"){
        alert("Password not given.");
      }
      if(response.data.password2Given === "False"){
        alert("Confirm password not given.");
      }
      if(response.data.emailGiven === "False"){
        alert("Email not given.");
      }
      if(response.data.firstnameGiven === "False"){
        alert("First name not given.");
      }
      if(response.data.lastnameGiven === "False"){
        alert("Last name not given.");
      }
      if(response.data.usernameGiven === "False"){
        alert("Username not given.");
      }
      if(response.data.passwordLength === "False"){
        alert("Password must be 6-20 characters.");
      }
      if(response.data.passwordMatch === "False"){
        alert("Passwords do not match.");
      }
      if(response.data.emailExists === "True"){
        alert("Email already exists.");
      }
      if(response.data.usernameExists === "True"){
        alert("Username already exists.");
      }
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
      url:  host+'/profile',
      data: {
        emailAddress: this.state.email,
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dOB: this.state.dob,
        password: this.state.password,
        password2: this.state.confirmPassword
      }
      })
      .then(res => this.handleResponse(res))
      .catch(res => this.handleResponseError(res));    
    
  }

  state = {};
  render() {
    if (UserStore.isLoggedIn) {
      this.props.history.push('/');
      window.location.reload(false);
    }
    return (
      <div className="signupForm">
        <div className="signupForm-content">
          <h1>✏️ Sign up ✏️</h1>
          <GoogleLoginButton/>
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
            placeholder="First name"
            value={this.state.firstName ? this.state.firstName : ""}
            onChange={(val) => this.setInputValue("firstName", val)}
          ></InputField>
          <InputField
            type="text"
            placeholder="Last name"
            value={this.state.lastName ? this.state.lastName : ""}
            onChange={(val) => this.setInputValue("lastName", val)}
          ></InputField>
          <InputField
            type="password"
            placeholder="Password"
            value={this.state.password ? this.state.password : ""}
            onChange={(val) => this.setLimitedInputValue("password", val)}
          ></InputField>
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={this.state.confirmPassword ? this.state.confirmPassword : ""}
            onChange={(val) => this.setLimitedInputValue("confirmPassword", val)}
          ></InputField>
          <span className="inputHint">Date of birth.</span>
            <InputField
              type="date"
              placeholder="Date of birth"
              value={this.state.dob ? this.state.dob : ""}
              onChange={(val) => this.setInputValue("dob", val)}
            ></InputField>
          <SubmitButton
            text="Sign Up" derivedClass="redBG"
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