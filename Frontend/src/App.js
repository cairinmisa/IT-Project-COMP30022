import React from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import TextEditor from "./TextEditor";
import Template from "./pages/Template";
import SignUp from "./pages/SignUpPage";
import Footer from "./Footer";
import SignUpForm from "./pages/SignUpForm";
import LoginPage from "./pages/LoginPage";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Nav />
        <Switch>
          <Route path="/login" exact component={LoginPage}></Route>
          <Route path="/editor" exact component={TextEditor}></Route>
          <Route path="/" exact component={Home}></Route>
          <Route path="/signup" exact component={SignUpForm}></Route>
        </Switch>
        <Footer />
      </Router>
    );
  }
}

export default App;
