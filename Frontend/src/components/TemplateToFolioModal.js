// This modal will pop up when a user wants to create a folio from a template
import React, { Component } from 'react';
import InputField from "../pages/InputField";

class TemplateToFolioModal extends Component {
    state = {
        publicity : "True",
        input : ""
    }

    handleSubmit(){
        this.props.createPortfolio(this.state.input, this.state.publicity)
    }

    render() { 
        return (  
            <div className="greyOutBG">
                 <div className="modal">
                 <button className="closeBtn" onClick={()=> this.props.closeCreateNew()}>X</button>
                    <div className="modal-content">
                        <h2>Use Template as New Folio</h2>
                        <InputField
                            type="text"
                            placeholder="Enter Folio Name"
                            value={this.state.input ? this.state.input : ""}
                            onChange={(val) => this.setState({input:val})}
                        ></InputField>
                        <select
                        onChange = {(e) => this.setState({publicity : e.target.value})}
                        >
                            <option value = "True">Public Portfolio</option>
                            <option value = "False">Private Portfolio</option>
                        </select>
                        <button onClick={() => this.handleSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TemplateToFolioModal;