import React, { Component } from 'react';

class WorkspaceToolbar extends Component {
    render () {
        // If a folio isn't selected then return some place holder text
        if(this.props.folioTitle === "") {
            return (
                <div className = "bold workspace-title">
                    Select a folio or create a new one to start editing.
                </div>
            );
        }

        // If a template is selected show a different toolbar with different functions
        if(this.props.templateSelected === true) {
            return (
                <div className = "bold workspace-title">
                  <span>
                    {this.props.folioTitle ? this.props.folioTitle : null}
                    {" "}| <button onClick = {() => this.props.saveTemplate()}>Save</button>
                    {" "}| <button onClick = {() => this.props.deleteTemplate()}>Delete</button>
                    {" "}| <button onClick = {() => this.props.convertToFolio()}>Create Folio from Template</button>
                  </span>
                </div>
            );
        }

        // Otherwise, render a toolbar for users to interact with
        return (
            <div className = "bold workspace-title">
              <span>
                {this.props.folioTitle ? this.props.folioTitle : null}
                {" "}| <button onClick = {() => this.props.saveFolio()}>Save</button>
                {" "}| <button onClick = {() => this.props.deleteFolio()}>Delete</button>
                {" "}| <button onClick = {() => this.props.convert()}>Share as Template</button>
              </span>
            </div>
        );
    }
}

export default WorkspaceToolbar;