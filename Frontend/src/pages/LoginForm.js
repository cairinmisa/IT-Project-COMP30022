import React, { Component } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "../stores/UserStore";
import { Link } from "react-router-dom";
import axios from "axios";
import {host} from "../stores/Settings"

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

  async handleResponse(response) {
    //handle success
    if(!response.data.hasErrors) {
      UserStore.isLoggedIn = true;
      UserStore.token = response.data.token;

      // Get username from token
      await axios({
        method: 'get',
        url: host+'/profile/findUser',
        params: {
          emailAddress: this.state.email
        }
        })
        .then(response => {
          UserStore.user = response.data;
        })
        .catch(response => {
          console.log(response);
        });
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
      
      this.resetForm();
    }
  }

  handleResponseError(response) {
    //handle error
    console.log(response);
    this.resetForm();
  }

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
          Log in
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
