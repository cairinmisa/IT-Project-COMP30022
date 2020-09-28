import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";
import Resume from "./templates/template2.js";
import Diary from "./templates/template.js";
import {Link} from "react-router-dom";
import LoginForm from "./pages/LoginForm.js";


export default class TextEditor extends Component {
  state = {
    userPortfolios : ["Portfolio 1", "Portfolio 2", "Portfolio 3"], //dummy
    currentTemplate : ""
  }
  
  constructor(props){
    super(props)
    this.props.updateWorkshop(true)
  }

  handleClick(templateClicked) {
    console.log(templateClicked);
    this.setState({currentTemplate : templateClicked})
  }

  pleaseUpdate(value){
    this.props.updateWorkshop(value)
  }

  resetData(){
    this.setState({currentTemplate : ""})
  }


  render() {
    return (
      <div className="text-editor">
        <div className="userPanel">
          <div className="panelContent">
            <Link to = "/" onClick = {() => this.pleaseUpdate(false)}>Back</Link>
            <p>Welcome asshole</p>
            <p>Your folios:</p>
            <ul>
              {this.state.userPortfolios.map((portfolio) => <li>{portfolio}</li>)}
            </ul>
            <p>Templates:</p>
            <ul>
                <li onClick = {() => this.handleClick(Diary)}>Diary</li>
                <li onClick = {() => this.handleClick(Resume)}>Resume</li>
            </ul>
            <p onClick = {() => this.resetData()}>+ Create new</p>
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
        </div>
      </div>
    );
  }
}
