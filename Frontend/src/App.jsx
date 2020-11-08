import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import TextEditor from "./pages/TextEditor";
import Template from "./pages/Template";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import SignUpForm from "./pages/SignUpForm";
import LoginPage from "./pages/LoginPage";
import {Helmet} from "react-helmet";
import SearchPage from "./pages/SearchPage";
import UserPage from "./pages/UserPage"
import UserStore from "./stores/UserStore";
import EportReader from "./pages/EportReader";

class App extends React.Component {

  state = {
    searchEmail : "",
    searchUserID : "",
    eportID : "",
    title : "",
    tempID : ""
  }

  constructor(props){
    super(props)
    this.submitSearch = this.submitSearch.bind(this)
    this.findUser = this.findUser.bind(this)
    this.searchEport = this.searchEport.bind(this)
    this.searchTemp = this.searchTemp.bind(this)
  }

  // Stores email address and user ID of a user that 
  // the user wants to get information on
  findUser(searchEmail, searchUserID){
    this.setState({
      searchEmail : searchEmail,
      searchUserID : searchUserID
    })
  }

  // Called when user submits a search using the nav bar
  submitSearch(search){
    this.setState({search : search})
  }
  
  // Stores folio ID of folio that user wants to read
  searchEport(eportID){
    this.setState({
      eportID: eportID,
      tempID : null
    })
  }

  // Stores template ID of template that user wants to read
  searchTemp(tempID){
    this.setState({
      eportID : null,
      tempID : tempID
    })
  }

  render() {
    // Specifies all the pages that the Nav Bar will be rendered on
    const NavRoutes = () => {
      return (
        <div>
          <Nav submitSearch = {this.submitSearch}/>
          <Switch>
            <Route path="/login" exact component={LoginPage}></Route>
            <Route path="/user" exact component = {() => <UserPage email = {this.state.searchEmail} searchEport = {this.searchEport} searchTemp = {this.searchTemp} userID = {this.state.searchUserID}/>}></Route>
            <Route path="/" exact component={Home}></Route>
            <Route path="/signup" exact component={SignUpForm}></Route>
            <Route path="/template" exact component={() => <Template eportID = {this.state.searchEportID}/>}></Route>
            <Route path="/profile" exact component={() => <UserPage email = {UserStore.user.emailAddress} searchEport = {this.searchEport} searchTemp = {this.searchTemp} userID = {UserStore.user.userID}/>}></Route>
            <Route path="/accountinfo" exact component={ProfilePage}></Route>
            <Route path="/eportReader" exact component={() => <EportReader eportID = {this.state.eportID} tempID = {this.state.tempID}/>}></Route>
            <Route path="/search" exact component = {() => <SearchPage search = {this.state.search} searchEport = {this.searchEport} searchTemp = {this.searchTemp} findUser = {this.findUser}/>}></Route>
          </Switch>
          <Footer />
          </div>
      );
    };

    // Render the whole app
    return (
        <Router>
          <Helmet>
            <title>eProfolio</title>
          </Helmet>
          <Switch>
            {/* Render routes with no nav bar first */}
            <Route path="/editor" exact component={TextEditor} ></Route>
            <Route component={NavRoutes}/>
          </Switch>
        </Router>
    );
  }
}



export default App;
