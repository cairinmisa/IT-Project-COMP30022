import React, { Component } from "react";

class SubmitButton extends Component {
  state = {};
  render() {
    return (
      <div className="submitButton">
        <button
          className={"btn " + this.props.derivedClass}
          disable={this.props.disabled}
          onClick={() => this.props.onClick()}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

export default SubmitButton;
