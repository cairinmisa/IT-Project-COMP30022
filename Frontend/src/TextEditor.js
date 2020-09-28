import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";
import template2 from "./templates/template2.js";
import template1 from "./templates/template.js";
import {Link} from "react-router-dom";
import UserStore from "./stores/UserStore";
import {Redirect} from 'react-router-dom';


export default class TextEditor extends Component {
  state = {
    currentTemplate : template1
  }
  
  constructor(props){
    super(props)
  }

  handleClick(templateClicked) {
    console.log(templateClicked);
    this.setState({currentTemplate : templateClicked})
  }

  resetData(){
    this.setState({currentTemplate : ""})
  }

  capitaliseName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
              <Link to = "/profile" >Profile</Link>{" "}|{" "}
              <Link to = "" >Help</Link>
            </div>
          </div>
          <div className="userPanel">
            <div className="panelContent">
              <p className="bold">Welcome {this.capitaliseName(UserStore.user.firstName)} </p>
              <p className="bold">Your folios:</p>
              <ul>
                  <li onClick = {() => this.handleClick(template1)}>Template 1</li>
                  <li onClick = {() => this.handleClick(template2)}>Template 2</li>
              </ul>
              <p className="medium" onClick = {() => this.resetData()}><span className="green">+</span> Create new</p>
            </div>
          </div>
          <div className="editorComponent">
            <CKEditor
              editor={BalloonEditor}
              data= {this.state.currentTemplate}
              onInit={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
            />
            <div class="editorBorder"></div>
          </div>
        </div>
      );
    }
  }
}
