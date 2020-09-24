import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon-block";
import template2 from "./templates/template2.js";
import template1 from "./templates/template.js";

export default class TextEditor extends Component {
  state = {
    currentTemplate : template1
  }
  constructor(props){
    super(props);
    this.state = {currentTemplate : template1}
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(templateClicked) {
    console.log(templateClicked);
    this.setState({currentTemplate : templateClicked})
  }

  render() {

    return (
      <div className="text-editor">
        <ul>
            <li onClick = {() => this.handleClick(template1)}>Template 1</li>
            <li onClick = {() => this.handleClick(template2)}>Template 2</li>
        </ul>
        <h2>Create a portfolio below.</h2>
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
