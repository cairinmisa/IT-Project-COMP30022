import React, { Component } from "react";
import TemplateCategory from "../components/TemplateCategory"
import Axios from "axios";
import {host} from "../stores/Settings";
import UserStore from "../stores/UserStore";
import TemplateToFolioModal from '../components/TemplateToFolioModal';

class Template extends Component {

  state = {
    displayCreate : false,
    templateID : null
  }

  createNew(templateID){
      this.setState({displayCreate : true});
      this.setState({templateID: templateID});
  }

  closeCreateNew(){
      this.setState({displayCreate: false});
  }

  // Function for creating a folio from scratch. Sends request to server and handles errors
  createPortfolio(title, publicity){
    console.log(this.state.templateID);
    Axios({
        method: 'post',
        url:  host+'/template/createFolio', 
        headers: {
            Authorization : "Bearer " + UserStore.token
        },
        data: {
            dateCreated : Date().toLocaleString(),
            title: title,
            userID : UserStore.user.userID,
            isPublic : publicity,
            templateID : this.state.templateID
        }
    })
    .then(response => {
        if(response.data.hasErrors === "True") {
            if(response.data.titleGiven === "False") {
                alert("Please enter a folio name.");
            }
            else if(response.data.titleExists === "True") {
                alert("You attempted to create a folio with a name that already exists in your account. Please enter a different name.");
            }
            else {
                alert("Something crazy has occured. Please contact team DewIT");
            }
        }
        else if(response.data.hasErrors === "False"){
            alert("Folio now exists in your workspace");
            this.closeCreateNew();
        }
        console.log(response);
    })
    .catch(response => {
        console.log(response);
    }) 
  }

  render() {
    return (
      <div className="templatePage-container">
        {this.state.displayCreate ? <TemplateToFolioModal closeCreateNew = {() => this.closeCreateNew()} createPortfolio = {(title, publicity) => this.createPortfolio(title, publicity)}/> : null}
        <div className="templatePage">
          <div className="templatePage-header">
            <h1>Templates.</h1>
            <h2 className="grey">Made by the community.</h2>
          </div>
          <TemplateCategory displayTitle="Highest Rated" sort="rating" createNew={(templateID) => this.createNew(templateID)}/>
          <TemplateCategory displayTitle="Technology" category="Technology" sort="rating" createNew={(templateID) => this.createNew(templateID)}/>
          <TemplateCategory displayTitle="Professional" category="Professional" sort="rating" createNew={(templateID) => this.createNew(templateID)}/>
        </div>
      </div>
    );
  }
}

export default Template;
