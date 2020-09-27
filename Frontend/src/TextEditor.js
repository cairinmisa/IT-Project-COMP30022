import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";
import template2 from "./templates/template2.js";
import template1 from "./templates/template.js";
import {Link} from "react-router-dom";


export default class TextEditor extends Component {
  state = {
    currentTemplate : template1
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
            <p>Welcome [Insert Username]</p>
            <p>Your folios:</p>
            <ul>
                <li onClick = {() => this.handleClick(template1)}>Template 1</li>
                <li onClick = {() => this.handleClick(template2)}>Template 2</li>
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
