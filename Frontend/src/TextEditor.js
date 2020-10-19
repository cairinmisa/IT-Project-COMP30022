import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";
import Resume from "./templates/template2.js";
import Diary from "./templates/template.js";
import {Link} from "react-router-dom";
import UserStore from "./stores/UserStore";
import {Redirect} from 'react-router-dom';
import Axios from "axios";
import {host} from "./stores/Settings";
import CreateNew from "./components/CreateNew";
import CreateTemplateModal from "./components/CreateTemplateModal";
import WorkspaceToolbar from "./components/WorkspaceToolbar";
import TemplateToFolioModal from "./components/TemplateToFolioModal";


export default class TextEditor extends Component {
  state = {
    userPortfolios : [],
    userTemplates : [],
    displayCreate : false,
    displayCreateTemplate : false,
    displayConvertToFolio : false,
    currentID : "",
    currentTitle: "",
    currentTemplate : "",
    isTemplateSelected : false
  }
  
  constructor(props){
    super(props)
    this.closeCreateNew = this.closeCreateNew.bind(this)
    this.createPortfolio = this.createPortfolio.bind(this)
  }

  handleClick(templateClicked, eportID, title, isTemplate) {
    this.setState({
      currentTemplate : templateClicked,
      currentID : eportID,
      currentTitle: title,
      isTemplateSelected : isTemplate
    })
  }

  closeCreateNew(){
    this.setState({displayCreate: false, displayCreateTemplate: false, displayConvertToFolio : false})
  }

  createNew(){
    this.setState({currentTemplate : ""})
    this.setState({displayCreate : true})
  }

  showTemplateModal(){
    this.setState({displayCreateTemplate : true})
  }

  showConvertToFolio() {
    this.setState({displayConvertToFolio : true})
  }

  // Capitalises the first element of a string
  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Saves folio that a user has been working on
  async savePortfolio(){
    if(this.state.currentID == "" || this.state.currentTitle == ""){
      alert("You must give your portfolio a title before it can be created")
      return;
    }

    // Wait for the request to resolve before getting updated folios
    await Axios({
      method: 'put',
      url:  host+'/eportfolio/save', 
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      data: {
        dateUpdated : Date().toLocaleString(),
        eportID : this.state.currentID.toString(),
        data : this.state.currentTemplate
      }
    })
    .then(response => {
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    }) 

    // Instead of reload, get portfolios again such that user can keep editing their work
    // Also solves issue of reloading the page on autosave (which would be annoying to have)
    this.getPortfolios(UserStore.user.userID);
  }

  // Deletes the currently selected folio
  async deletePortfolio(){
    alert("Are you sure you want to delete " + this.state.currentTitle +"? This action cannot be reversed.")
    await Axios({
      method: 'delete',
      url:  host+'/eportfolio', 
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      data: {
        eportID : this.state.currentID
      }
    })
    .then(response => {
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    }) 
    window.location.reload(false)
  }

  // Deletes the currently selected folio
  async deleteTemplate(){
    console.log(this.state.currentID)
    alert("Are you sure you want to delete " + this.state.currentTitle +"? This action cannot be reversed.")
    await Axios({
      method: 'delete',
      url:  host+'/template', 
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      data: {
        templateID : this.state.currentID
      }
    })
    .then(response => {
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    }) 
    window.location.reload(false)
  }

  // Gets portfolios of the user
  async getPortfolios(userId){
    await Axios({
      method: 'post',
      url:  host+'/eportfolio/userfetch', 
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      data: {
        userID : userId
      }
    })
    .then(response => {
      let portfolios = [];
      for(let i=0;i<response.data.length;i++){
        portfolios[i] = [response.data[i].data,response.data[i].title,response.data[i].eportID]
      }
      this.setState({
        userPortfolios : portfolios
      });
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    })

    await Axios({
      method: 'get',
      url:  host+'/template/fetchFromUser', 
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      params: {
        userID : userId
      }
    })
    .then(response => {
      let templates = [];
      for(let i=0;i<response.data.length;i++){
        templates[i] = [response.data[i].data,response.data[i].title,response.data[i].templateID]
      }
      this.setState({
        userTemplates : templates
      });
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    })
  }

  // Function for creating a folio from scratch. Sends request to server and handles errors
  createPortfolio(title, publicity){
    Axios({
        method: 'post',
        url:  host+'/eportfolio/create', 
        headers: {
          Authorization : "Bearer " + UserStore.token
        },
        data: {
          dateCreated : Date().toLocaleString(),
          title: title,
          userID : UserStore.user.userID,
          isPublic : publicity
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
          window.location.reload(false);
        }
        console.log(response)
      })
      .catch(response => {
        console.log(response)
      }) 
  }

  // Function for creating a template from a portfolio
  convertPortfolio(title, publicity, category){
    Axios({
        method: 'post',
        url:  host+'/template/create', 
        headers: {
          Authorization : "Bearer " + UserStore.token
        },
        data: {
          category: category,
          dateCreated : Date().toLocaleString(),
          title: title,
          userID : UserStore.user.userID,
          eportID: this.state.currentID,
          isPublic: publicity
        }
      })
      .then(response => {
        if(response.data.hasErrors === "True") {
          if(response.data.titleGiven === "False") {
            alert("Please enter a folio name.");
          }
          else if(response.data.titleExists === "True") {
            alert("You attempted to create a template with a name that already exists in your account. Please enter a different name.");
          }
          else if(response.data.categoryGiven === "False") {
            alert("Please enter a category.");
          }
          else {
            alert("Something crazy has occured. Please contact team DewIT");
          }
        }
        else if(response.data.hasErrors === "False"){
          this.setState({displayCreateTemplate: false})
          this.getPortfolios(UserStore.user.userID);
        }
        console.log(response)
      })
      .catch(response => {
        console.log(response)
      }) 
  }

  convertToFolio(title, publicity) {
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
        templateID: this.state.currentID,
        isPublic: publicity
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
        this.setState({displayConvertToFolio: false})
        this.getPortfolios(UserStore.user.userID);
      }
      console.log(response)
    })
    .catch(response => {
      console.log(response)
    }) 
  }

  componentDidMount(){
    if(UserStore.user != undefined){
      this.getPortfolios(UserStore.user.userID)
    }
  }

  // Appends "..." to end of string if it exceeds a specified length
  shortenString(str, len) {
    if(str.length > len - 3) {
      return str.substring(0,len-3) + "...";
    }
    return str;
  }

  render() {
    if(UserStore.user == undefined){
      return <Redirect  to="/login" />
    }
    else{
      return (
        <div className="text-editor">
          {this.state.displayCreate ? <CreateNew closeCreateNew = {this.closeCreateNew} createPortfolio = {this.createPortfolio}/> : null}
          {this.state.displayCreateTemplate ? <CreateTemplateModal closeCreateNew = {this.closeCreateNew} createTemplate = {(title, publicity, category) => this.convertPortfolio(title, publicity, category)}/> : null}
          {this.state.displayConvertToFolio ? <TemplateToFolioModal closeCreateNew = {() => this.closeCreateNew()} createPortfolio = {(title, publicity) => this.convertToFolio(title, publicity)}/> : null}
          <div className="editorNavBar">
            <div className="leftAlign">
              <Link to = "/" >Home</Link>
            </div>
            <div className="rightAlign">
              <Link to = "/template" >Templates</Link>{" "}|{" "}
              <Link to = "/profile" >{this.capitaliseName(UserStore.user.firstName)}</Link>{" "}|{" "}
              <Link to = "" >Help</Link>
            </div>
          </div>
          <div className="userPanel">
            <div className="panelContent">
              <p className="bold">Welcome {this.capitaliseName(UserStore.user.firstName)} </p>
              <p className="medium clickable" onClick = {() => this.createNew()}><span className="green">+</span> Create new</p>
              <p className="bold">Your folios:</p>
              <ul>
                  {this.state.userPortfolios.map((portfolio) => <li onClick = {() => this.handleClick(portfolio[0],portfolio[2], portfolio[1], false)}>{this.shortenString(portfolio[1],23)}</li>)}
              </ul>
              <p className="bold">Your templates:</p>
              <ul>
                  {this.state.userTemplates.map((template) => <li onClick = {() => this.handleClick(template[0],template[2], template[1], true)}>{this.shortenString(template[1],23)}</li>)}
              </ul>
            </div>
          </div>
          <div className="editorComponent">
            <WorkspaceToolbar 
              folioTitle = {this.state.currentTitle}
              saveFolio = {() => this.savePortfolio()}
              deleteFolio = {() => this.deletePortfolio()}
              deleteTemplate = {() => this.deleteTemplate()}
              convert = {() => this.showTemplateModal()}
              convertToFolio = {() => this.showConvertToFolio()}
              templateSelected = {this.state.isTemplateSelected} 
            />
            <div className="editor-container">
              <CKEditor
                editor={BalloonEditor}
                data= {this.state.currentTemplate}
                onChange = { (event, editor) => {
                  const data = editor.getData();
                  this.setState({currentTemplate : data})
                }
              }
              />
              <div className="editorBorder"></div>
            </div>
          </div>
        </div>
      );
    }
  }
}
