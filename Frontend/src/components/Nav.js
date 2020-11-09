import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserStore from "../stores/UserStore";
import webLogo from "../images/PROlogo.png"

class Nav extends Component {
  
  constructor(props){
    super(props);
    this.state = {value : ""};
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = {
    value: ""
  }
  
  // Capitalises first letter of a string
  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Handles search input change
  handleChange(event){
    this.setState({value : event.target.value})
  }
  
  // Handles search submit
  handleSubmit(){ 
    this.props.submitSearch(this.state.value)
  }

  // There are two different nav bars: one for when the user is
  // logged in, and one for when the user is not logged in
  render() {
    if(UserStore.isLoggedIn === false){
      return (
        <div className="navBar">
          <Link to="/">
            <img src={webLogo} alt="HomeLogo" />
          </Link>
          <ul>
            <Link to="/editor" >
              <li>Create</li>
            </Link>
            <Link to = "/template">
              <li>Templates</li>
            </Link>
            <li>|</li>
            <Link to="/login">
              <li>Log in</li>
            </Link>
            <Link to="/signup">
              <li>Sign up</li>
            </Link>
          </ul>
        </div>
      );
    }
    else{
      return(
        <div className="navBar">
          <Link to="/">
            <img src={webLogo} alt="HomeLogo" />
          </Link>
          <ul>
            <li>
              <form className="searchUserField">
                <input type = 'text' value = {this.state.value} onChange={this.handleChange} placeholder="Search users or templates"></input>
                <Link to = "/search"><button type = "submit" onClick = {this.handleSubmit}>🔍</button></Link>
              </form>
            </li>
            <Link to="/editor">
              <li>Create</li>
            </Link>
            <Link to = "/template">
              <li>Templates</li>
            </Link>
            <li>|</li>
            <Link to = "/profile">
              <li>{this.capitaliseName(UserStore.user ? UserStore.user.firstName : "")}</li>
            </Link>
          </ul>
      </div>
      )
    }
  }
}

export default Nav;
