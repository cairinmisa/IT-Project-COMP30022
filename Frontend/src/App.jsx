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
  state = {
    onWorkshop : false
  }

  constructor(props){
    super(props)
  }

  updateWorkshop(value){
    this.setState({onWorkshop : value})
    console.log(this.state.onWorkshop)
  }

  render() {
    if(this.state.onWorkshop === true){
      return(<Router><Route path="/editor" render = {(props) => (<TextEditor updateWorkshop = {this.updateWorkshop.bind(this)}/>)}></Route></Router>)
    } 
    else{
    return (
          <Router>
            <Nav updateWorkshop = {this.updateWorkshop.bind(this)}/>
            <Switch>
              <Route path="/login" exact component={LoginPage}></Route>
              <Route path="/editor" render = {(props) => (<TextEditor updateWorkshop = {this.updateWorkshop.bind(this)}/>)}></Route>
              <Route path="/" exact component={Home}></Route>
              <Route path="/signup" exact component={SignUpForm}></Route>
              <Route path="/template" exact component={Template}></Route>
            </Switch>
            <Footer />
          </Router>
      );
    }
  }
}

export default App;
