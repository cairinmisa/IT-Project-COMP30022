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
import {Helmet} from "react-helmet";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage"
import UserStore from "./stores/UserStore";

class App extends React.Component {

  state = {
    search : "",
    searchEmail : "",
    searchUserID : ""
  }

  constructor(props){
    super(props)
    this.submitSearch = this.submitSearch.bind(this)
    this.findUser = this.findUser.bind(this)
  }

  findUser(searchEmail, searchUserID){
    this.setState({
      searchEmail : searchEmail,
      searchUserID : searchUserID
    })
  }

  submitSearch(search){
    this.setState({search : search})
  }
  

  render() {
    // Specifies all the pages that the Nav Bar will be rendered on
    const NavRoutes = () => {
      return (
        <div>
          <Nav submitSearch = {this.submitSearch}/>
          <Switch>
            <Route path="/login" exact component={LoginPage}></Route>
            <Route path="/user" exact component = {() => <UserPage email = {this.state.searchEmail} userID = {this.state.searchUserID}/>}></Route>
            <Route path="/" exact component={Home}></Route>
            <Route path="/signup" exact component={SignUpForm}></Route>
            <Route path="/template" exact component={Template}></Route>
            <Route path="/profile" exact component={() => <UserPage email = {UserStore.user.emailAddress} userID = {UserStore.user.userID}/>}></Route>
            <Route path="/accountinfo" exact component={ProfilePage}></Route>
            <Route path="/search" exact component = {() => <SearchPage search = {this.state.search} findUser = {this.findUser}/>}></Route>
          </Switch>
          <Footer />
          </div>
      );
    };

    // Route components with no Nav Bar first 
    return (
        <Router>
          <Helmet>
            <title>eProfolio</title>
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
