import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserStore from "./stores/UserStore";
import InputField from "./pages/InputField";

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
  
  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleChange(event){
    this.setState({value : event.target.value})
  }
  
  handleSubmit(){ 
    this.props.submitSearch(this.state.value)
  }


  render() {
    if(UserStore.isLoggedIn === false){
      return (
        <div className="navBar">
          <ul>
            <li>
              <form className="searchUserField">
                <input type = 'text' value = {this.state.value} onChange={this.handleChange} placeholder="Search user by full name"></input>
                <Link to = "/search"><button type = "submit" onClick = {this.handleSubmit}>🔍</button></Link>
              </form>
            </li>
            <Link to="/">
              <li>Home</li>
            </Link>
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
        <ul>
          <li>
            <form className="searchUserField">
              <input type = 'text' value = {this.state.value} onChange={this.handleChange} placeholder="Search user by full name"></input>
              <Link to = "/search"><button type = "submit" onClick = {this.handleSubmit}>🔍</button></Link>
            </form>
          </li>
          <Link to="/">
            <li>Home</li>
          </Link>
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
