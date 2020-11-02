import React, { Component } from "react";
import ReactToPdf from "react-to-pdf";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonBlockEditor from "ckeditor5-custom-build/build/ckeditor";

class WorkspaceToolbar extends Component {
  state = {
    displayPdf : false
  };

  generatePdf(toPdf) {
    this.setState({displayPdf: true});
    this.forceUpdate();
    setTimeout(() => {
      toPdf();
      this.setState({displayPdf : false});
    }, 10);
  }

  render() {
    // If a folio isn't selected then return some place holder text
    if (this.props.folioTitle === "") {
      return (
        <div className="bold workspace-title big">
          <span className="red">🡐🡐</span> Create a folio from the panel on the
          left, or select a folio to start editing.
        </div>
      );
    }

    // If a template is selected show a different toolbar with different functions
    if (this.props.templateSelected === true) {
      return (
        <div className="bold workspace-title">
          <span>
            {this.props.folioTitle ? this.props.folioTitle : null} |{" "}
            <button onClick={() => this.props.saveTemplate()}>Save</button> |{" "}
            <button onClick={() => this.props.deleteTemplate()}>Delete</button>{" "}
            |{" "}
            <button onClick={() => this.props.convertToFolio()}>
              Create Folio from Template
            </button>{" "}
            {"| "}
            <ReactToPdf scale={0.54} filename={this.props.folioTitle + ".pdf"}>
              {({ toPdf, targetRef }) => (
                <span>
                  <button onClick={() => this.generatePdf(toPdf)}>Generate PDF</button>
                  <div ref={targetRef}>
                    {this.state.displayPdf ? <div className="fullWidth"><CKEditor
                      editor={BalloonBlockEditor}
                      data={this.props.folioData}
                      disabled={true}
                    /></div> : null}
                  </div>
                </span>
              )}
            </ReactToPdf>
          </span>
        </div>
      );
    }

    // Otherwise, render a toolbar for users to interact with
    return (
      <div className="bold workspace-title">
        <span>
          {this.props.folioTitle ? this.props.folioTitle : null} |{" "}
          <button onClick={() => this.props.saveFolio()}>Save</button> |{" "}
          <button onClick={() => this.props.deleteFolio()}>Delete</button> |{" "}
          <button onClick={() => this.props.convert()}>
            Share as Template
          </button> {" "}
          |{" "}
          <ReactToPdf scale={0.54} filename={this.props.folioTitle + ".pdf"}>
            {({ toPdf, targetRef }) => (
              <span>
                <button onClick={() => this.generatePdf(toPdf)}>Generate PDF</button>
                <div ref={targetRef}>
                  {this.state.displayPdf ? <div className="fullWidth"><CKEditor
                    editor={BalloonBlockEditor}
                    data={this.props.folioData}
                    disabled={true}
                  /></div> : null}
                </div>
              </span>
            )}
          </ReactToPdf>
        </span>
      </div>
    );
  }
}

export default WorkspaceToolbar;
