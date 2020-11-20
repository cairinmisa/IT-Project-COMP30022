import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonBlockEditor from "ckeditor5-custom-build/build/ckeditor";
import {Link} from "react-router-dom";
import UserStore from "../stores/UserStore";
import {Redirect} from 'react-router-dom';
import Axios from "axios";
import {host} from "../stores/Settings";
import CreateNew from "../components/CreateNew";
import CreateTemplateModal from "../components/CreateTemplateModal";
import WorkspaceToolbar from "../components/WorkspaceToolbar";
import TemplateToFolioModal from "../components/TemplateToFolioModal";
import webLogo from "../images/fullwhitelogo.png";


export default class TextEditor extends Component {
  state = {
    userPortfolios : [],
    userTemplates : [],
    displayCreate : false,
    displayCreateTemplate : false,
    displayConvertToFolio : false,
    currentID : null,
    currentTitle: "",
    currentTemplate : "",
    isTemplateSelected : false,
    isSaving: false,
    lastSavedAt: null,
    unsaved: false,

    // So that we can bold selected folios
    listItemSelected : null
  }

  constructor(props){
    super(props)
    this.closeCreateNew = this.closeCreateNew.bind(this)
    this.createPortfolio = this.createPortfolio.bind(this)
    this.pdfRef = React.createRef();
  }

  // Called when user clicks between their folios and templates
  async handleClick(templateClicked, eportID, title, isTemplate, id) {
    // Autosave to save data
    if(this.state.currentID !== null) {
      await this.savePortfolio();
    }

    this.setState({
      currentTemplate : templateClicked,
      currentID : eportID,
      currentTitle: title,
      isTemplateSelected : isTemplate,
      listItemSelected : id,
      lastSavedAt: null,
      unsaved: false
    })
  }

  // Closes create modals
  closeCreateNew(){
    this.setState({displayCreate: false, displayCreateTemplate: false, displayConvertToFolio : false})
  }

  // Shows create new folio modal
  createNew(){
    this.setState({currentTemplate : ""})
    this.setState({displayCreate : true})
  }

  // Shows create new template modal
  showTemplateModal(){
    this.setState({displayCreateTemplate : true})
  }

  // Shows convert folio to template modal
  showConvertToFolio() {
    this.setState({displayConvertToFolio : true})
  }

  // Capitalises the first element of a string
  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Saves folio that a user has been working on
  async savePortfolio(){
    // Change state to saving
    this.setState({isSaving: true});

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
    .then(response => {})
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })

    // Instead of reload, get portfolios again such that user can keep editing their work
    // Also solves issue of reloading the page on autosave (which would be annoying to have)
    this.getPortfolios(UserStore.user.userID);

    // Finish saving
    var d = new Date();
    var savedTime = d.getHours() + ":" + d.getMinutes();
    this.setState({
      isSaving: false,
      lastSavedAt: savedTime,
      unsaved: false
    });
  }

  // Saves template that a user has been working on
  async saveTemplate(){
    // Change state to saving
    this.setState({isSaving: true});

    // Wait for the request to resolve before getting updated folios
    await Axios({
      method: 'put',
      url:  host+'/template/saveTemplate',
      headers: {
        Authorization : "Bearer " + UserStore.token
      },
      data: {
        dateUpdated : Date().toLocaleString(),
        templateID : this.state.currentID.toString(),
        data : this.state.currentTemplate
      }
    })
    .then(response => {})
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })

    // Instead of reload, get portfolios again such that user can keep editing their work
    // Also solves issue of reloading the page on autosave (which would be annoying to have)
    this.getPortfolios(UserStore.user.userID);

    // Finish saving
    var d = new Date();
    var savedTime = d.getHours() + ":" + d.getMinutes();
    this.setState({
      isSaving: false,
      lastSavedAt: savedTime,
      unsaved: false
    });
  }

  // Deletes the currently selected folio
  async deletePortfolio(){
    // Check if user wants to delete folio
    if(!window.confirm("Are you sure you want to delete " + this.state.currentTitle +"? This action cannot be reversed.")) {
      return;
    }

    // Else delete
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
    .then(response => {})
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })
    window.location.reload(false)
  }

  // Deletes the currently selected template
  async deleteTemplate(){
    // Check if user wants to delete template
    if(!window.confirm("Are you sure you want to delete " + this.state.currentTitle +"? This action cannot be reversed.")) {
      return;
    }

    // Else delete template
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
    .then(response => {})
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })
    window.location.reload(false)
  }

  // Gets portfolios & templates of the user
  async getPortfolios(userId){
    // Get folios
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
      // Sets up the folios in the component state from response data
      let portfolios = [];
      for(let i=0;i<response.data.length;i++){
        portfolios[i] = [response.data[i].data,response.data[i].title,response.data[i].eportID]
      }
      this.setState({
        userPortfolios : portfolios
      });
    })
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })

    // Get templates
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
      // Sets up the templates in the component state from response data
      let templates = [];
      for(let i=0;i<response.data.length;i++){
        templates[i] = [response.data[i].data,response.data[i].title,response.data[i].templateID]
      }
      this.setState({
        userTemplates : templates
      });
    })
    .catch(response => {
      // An unknown error has occurred
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
      })
      .catch(response => {
        // An unknown error has occurred
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
      })
      .catch(response => {
        // An unknown error has occurred
        console.log(response)
      })
  }

  // Function for creating folio from template
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
    })
    .catch(response => {
      // An unknown error has occurred
      console.log(response)
    })
  }

  // Get user's folios & templates on component load 
  componentDidMount(){
    if(UserStore.user !== null){
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
    // If user has not logged in (or their session expired) then redirect them to the login page
    if(UserStore.user === null){
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
              <Link to = "/" ><img className="workspaceLogo" src={webLogo} alt="HomeLogo" /></Link>
            </div>
            <div className="rightAlign">
              <Link to = "/template" >Templates</Link>{" "}|{" "}
              <Link to = "/profile" >{this.capitaliseName(UserStore.user.firstName)}</Link>{" "}|{" "}
              <a target="_blank" href="https://docs.google.com/document/d/1HoYN8A0IrbEWNTto792i_U9gfFQoHwWA-5yxTTsOQHI/edit">Help</a>
            </div>
          </div>
          <div className="userPanel">
            <div className="panelContent">
              <p className="bold">Welcome {this.capitaliseName(UserStore.user.firstName)} </p>
              <p className="medium clickable" onClick = {() => this.createNew()}><span className="green">+</span> Create new</p>
              <p className="bold">Your folios:</p>
              <ul className="folioTemplateList">
                  {this.state.userPortfolios.map((portfolio, i) => <li key={i} className={this.state.listItemSelected === i ? "selectedListItem" : ""} onClick = {() => this.handleClick(portfolio[0],portfolio[2], portfolio[1], false, i)}>{this.shortenString(portfolio[1],23)}</li>)}
              </ul>
              <p className="bold">Your templates:</p>
              <ul className="folioTemplateList">
                  {this.state.userTemplates.map((template, i) => <li key={i+this.state.userPortfolios.length} className={this.state.listItemSelected === i+this.state.userPortfolios.length ? "selectedListItem" : ""} onClick = {() => this.handleClick(template[0],template[2], template[1], true, i+this.state.userPortfolios.length)}>{this.shortenString(template[1],23)}</li>)}
              </ul>
            </div>
          </div>
          <div className="editorComponent">
            <WorkspaceToolbar
              folioTitle = {this.state.currentTitle}
              saveFolio = {() => this.savePortfolio()}
              saveTemplate = {() => this.saveTemplate()}
              deleteFolio = {() => this.deletePortfolio()}
              deleteTemplate = {() => this.deleteTemplate()}
              convert = {() => this.showTemplateModal()}
              convertToFolio = {() => this.showConvertToFolio()}
              templateSelected = {this.state.isTemplateSelected}
              isSaving = {this.state.isSaving}
              lastSavedAt = {this.state.lastSavedAt}
              unsaved = {this.state.unsaved}
              folioData = {this.state.currentTemplate}
            />
            <div className="editor-container" ref={this.pdfRef}>
              {this.state.currentTitle ? <CKEditor
                editor={BalloonBlockEditor}
                data= {this.state.currentTemplate}
                config={{
                  toolbar: {
                    items: [
                    ]
                  },
                  language: 'en',
                  blockToolbar: [
                    'heading',
                    'bold',
                    'italic',
                    'link',
                    '|',
                    'imageUpload',
                    'blockQuote',
                    'insertTable',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'indent',
                    'outdent',
                    '|',
                    'undo',
                    'redo'
                  ],
                  image: {
                    toolbar: [
                      'imageTextAlternative',
                      'imageStyle:full',
                      'imageStyle:side'
                    ]
                  },
                  table: {
                    contentToolbar: [
                      'tableColumn',
                      'tableRow',
                      'mergeTableCells'
                    ]
                  },
                  simpleUpload: {
                    uploadUrl: host+'/uploader',
                  }
                }}
                onChange = { (event, editor) => {
                  const data = editor.getData();
                  if(this.state.currentTemplate !== data){
                    this.setState({
                      unsaved: true
                    });
                  }
                  this.setState({
                    currentTemplate : data
                  });
                }
              }
              /> : null}
              <div className="editorBorder"></div>
            </div>
          </div>
        </div>
      );
    }
  }
}
