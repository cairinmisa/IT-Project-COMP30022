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


export default class TextEditor extends Component {
  state = {
    userPortfolios : [],
    displayCreate : false,
    currentID : "",
    currentTitle: "",
    currentTemplate : ""
  }
  
  constructor(props){
    super(props)
  }

  handleClick(templateClicked, eportID, title) {
    this.setState({
      currentTemplate : templateClicked,
      currentID : eportID,
      currentTitle: title
    })
  }

  createNew(){
    this.setState({currentTemplate : ""})
    this.setState({displayCreate : true})
  }

  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  savePortfolios(){
    if(this.state.currentID == "" || this.state.currentTitle == ""){
      alert("You must give your portfolio a title before it can be created")
      return;
    }
    Axios({
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
  }

  getPortfolios(userId){
    let templateCount = 0
    Axios({
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
      let portfolios = []
      for(let i=0;i<response.data.length;i++){
        if(response.data[i].templateID != null){
          templateCount++;
          continue;
        }
        portfolios[i-templateCount] = [response.data[i].data,response.data[i].title,response.data[i].eportID]
      }
      this.setState({userPortfolios : portfolios})
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
    console.log(UserStore.token)
  }

  render() {
    if(UserStore.user == undefined){
      return <Redirect  to="/login" />
    }
    else{
      return (
        <div className="text-editor">
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
              <p className="bold">Your folios:</p>
              <ul>
                  {this.state.userPortfolios.map((portfolio) => <li onClick = {() => this.handleClick(portfolio[0],portfolio[2], portfolio[1])}>{portfolio[1]}</li>)}
              </ul>
              <p className="bold">Templates</p>
              <ul>
                  <li onClick = {() => this.handleClick(Resume)}>Resume</li>
                  <li onClick = {() => this.handleClick(Diary)}>Diary</li>
              </ul>
              <p className="medium clickable" onClick = {() => this.createNew()}><span className="green">+</span> Create new</p>
              {this.state.displayCreate ? <CreateNew/> : null}
              <p className="medium clickable" onClick = {() => this.savePortfolios()}>Save Eportfolio</p>
            </div>
          </div>
          <div className = "bold">
            {this.state.currentTitle ? this.state.currentTitle : null}
          </div>
          <div className="editorComponent">
            <CKEditor
              editor={BalloonEditor}
              data= {this.state.currentTemplate}
              onInit={(editor) => {
                console.log("Editor is ready to use!", editor);
              }}
              onChange = { (event, editor) => {
                const data = editor.getData();
                this.setState({currentTemplate : data})
              }
            }
            />
            <div class="editorBorder"></div>
          </div>
        </div>
      );
    }
  }
}
