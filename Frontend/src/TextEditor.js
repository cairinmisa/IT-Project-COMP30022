import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";




export default class TextEditor extends Component {
  render() {
    return (
      <div className="text-editor">
        
        <h2>Create a portfolio below.</h2>
        <div className="editorComponent">
        
          <CKEditor
            editor={InlineEditor}
            data="<h1>John Smith</h1>"
            onInit={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
          />
        </div>
        <div className="editorComponent">
        <link rel="stylesheet" href="./Ck.css" type="text/css"></link>
          <CKEditor
            editor={InlineEditor}
            data="<div>
                    ello there
                  </div>"
            onInit={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
          />
        </div>
        <button>+</button>
      </div>
    );
  }
}

