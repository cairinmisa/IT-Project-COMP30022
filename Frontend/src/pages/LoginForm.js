import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "../components/SubmitButton";
import UserStore from "../stores/UserStore";
import { Link } from "react-router-dom";
import axios from "axios";
import {host} from "../stores/Settings"
import GoogleLoginButton from "../components/GoogleLoginButton"

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      buttonDisabled: false
    };
  }

  // Called when user changes input
  setInputValue(property, val) {
    val = val.trim();
    this.setState({
      [property]: val
    });
  }

  // Limits the length of user input
  setLimitedInputValue(property, val) {
    val = val.trim();
    if (val.length > 16) {
      return;
    }
    this.setState({
      [property]: val
    });
  }

  // Resets user input
  resetForm() {
    this.setState({
      email: "",
      password: "",
      buttonDisabled: false
    });
  }

  // Handle login response
  async handleResponse(response) {
    if(!response.data.hasErrors) {
      // Store the received token (take the actual token and not the "Bearer" )
      UserStore.token = response.data.token.split(" ")[1];

      // Set the local storage of user
      localStorage.setItem("token", UserStore.token);
      localStorage.setItem("emailAddress", this.state.email);

      // Update login status to force reload
      UserStore.isLoggedIn = true;
    }
    else if (response.data.hasErrors){
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
      if(response.data.emailGiven === "False"){
        alert("Email not given.");
      }
      
      // Reset input
      this.resetForm();
    }
  }

  // Handle login error response
  handleResponseError(response) {
    console.log(response);
    this.resetForm();
  }

  // Logs in user when they click login
  async doLogin() {
    // If user hasn't specified an email then return
    if (!this.state.email) {
      return;
    }

    // If user hasn't specified a password then return
    if (!this.state.password) {
      return;
    }

    this.setState({
      buttonDisabled: true
    });

    // Fetch user from database
    axios({
      method: 'post',
      url:  host+'/profile/login',
      data: {
        emailAddress: this.state.email,
        password: this.state.password
      }
      })
      .then(response => this.handleResponse(response))
      .catch(response => this.handleResponseError(response));
  }

  state = {};
  render() {
    return (
      <div className="loginForm">
        <div className="loginForm-content">

          <h1><span role = "img" aria-label="star">✨ Log in ✨</span></h1>
          <GoogleLoginButton/>
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
            text="Continue" derivedClass="redBG"
            disabled={this.state.buttonDisabled}
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
