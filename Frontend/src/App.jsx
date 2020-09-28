import React from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import TextEditor from "./TextEditor";
import Template from "./pages/Template";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./Footer";
import SignUpForm from "./pages/SignUpForm";
import LoginPage from "./pages/LoginPage";
import UserStore from "./stores/UserStore";
import {Helmet} from "react-helmet";

class App extends React.Component {
  // When app is first loaded we want to get user information from local storage
  // and setup user store accordingly
  setupUserInfo() {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if(user != null){
      UserStore.user = JSON.parse(user);
      UserStore.isLoggedIn = true;
      UserStore.token = token;
    }
  }


  render() {
    this.setupUserInfo();
    // Specifies all the pages that the Nav Bar will be rendered on
    const NavRoutes = () => {
      return (
        <div>
          <Nav isLoggedIn = {UserStore.isLoggedIn}/>
          <Switch>
            <Route path="/login" exact component={LoginPage}></Route>
            <Route path="/" exact component={Home}></Route>
            <Route path="/signup" exact component={SignUpForm}></Route>
            <Route path="/template" exact component={Template}></Route>
            <Route path="/profile" exact component={ProfilePage}></Route>
          </Switch>
          <Footer />
          </div>
      );
    };

    // Route components with no Nav Bar first 
    return (
        <Router>
          <Helmet>
            <title>ePortfolio Editor</title>
          </Helmet>
          <Switch>
            <Route path="/editor" exact component={TextEditor} ></Route>
            <Route component={NavRoutes}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
