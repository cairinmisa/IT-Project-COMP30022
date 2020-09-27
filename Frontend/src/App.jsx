import React from "react";
import "./App.css";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import TextEditor from "./TextEditor";
import Template from "./pages/Template";
import Footer from "./Footer";
import SignUpForm from "./pages/SignUpForm";
import LoginPage from "./pages/LoginPage";
import UserStore from "./stores/UserStore";

class App extends React.Component {
  render() {
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
          </Switch>
          <Footer />
          </div>
      );
    };

    // Render components with no Nav Bar first 
    return (
        <Router>
          <Switch>
            <Route path="/editor" exact component={TextEditor} ></Route>
            <Route component={NavRoutes}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
