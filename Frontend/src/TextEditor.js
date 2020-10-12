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
    currentTemplate : ""
  }
  
  constructor(props){
    super(props)
  }

  handleClick(templateClicked) {
    this.setState({currentTemplate : templateClicked})
  }
  createNew(){
    this.setState({currentTemplate : ""})
    this.setState({displayCreate : true})
  }

  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  savePortfolios(userId){
    Axios({
      method: 'post',
      url:  host+'/eportfolio/create', 
      headers: {
        Authorization : "Bearer" + UserStore.token
      },
      data: {
        userID : userId,
        title : "TestingSave",
        dateCreated : Date().toLocaleString(),
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
        portfolios[i] = [response.data[i].data,response.data[i].title]
      }
      this.setState({userPortfolios : portfolios})
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
                  {this.state.userPortfolios.map((portfolio) => <li onClick = {() => this.handleClick(portfolio[0])}>{portfolio[1]}</li>)}
              </ul>
              <p className="bold">Templates</p>
              <ul>
                  <li onClick = {() => this.handleClick(Resume)}>Resume</li>
                  <li onClick = {() => this.handleClick(Diary)}>Diary</li>
              </ul>
              <p className="medium clickable" onClick = {() => this.createNew()}><span className="green">+</span> Create new</p>
              {this.state.displayCreate ? <CreateNew/> : null}
              <p className="medium clickable" onClick = {() => this.savePortfolios(UserStore.user.userID)}>Save Eportfolio</p>
            </div>
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
