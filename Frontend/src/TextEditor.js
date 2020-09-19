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
          <CKEditor
            editor={InlineEditor}
            data="<p>I like dogs and cats. My favourite programming language is Prolog.
                    No I am not a loser.</p>"
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
