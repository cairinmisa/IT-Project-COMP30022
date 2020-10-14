import React, { Component } from 'react';

class WorkspaceToolbar extends Component {
    render () {
        // If a folio isn't selected then return some place holder text
        if(this.props.folioTitle == "") {
            return (
                <div className = "bold workspace-title">
                    Select a folio or create a new one to start editing.
                </div>
            );
        }

        // Otherwise, render a toolbar for users to interact with
        return (
            <div className = "bold workspace-title">
              <span>
                {this.props.folioTitle ? this.props.folioTitle : null}
                {" "}| <button onClick = {() => this.props.save()}>Save</button>
                {" "}| <button onClick = {() => this.props.delete()}>Delete</button>
                {" "}| <button onClick = {() => this.props.convert()}>Share as Template</button>
              </span>
            </div>
        );
    }
}

export default WorkspaceToolbar;