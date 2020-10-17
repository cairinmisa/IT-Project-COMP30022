// This modal will pop up when a user wants to create a folio from a template
import React, { Component } from 'react';
import InputField from "../pages/InputField";
import UserStore from "../stores/UserStore";
import { Link } from "react-router-dom";

class TemplateToFolioModal extends Component {
    state = {
        publicity : "True",
        input : ""
    }

    handleSubmit(){
        this.props.createPortfolio(this.state.input, this.state.publicity)
    }

    render() {
        if(UserStore.isLoggedIn == false) {
            return (  
                <div className="greyOutBG">
                     <div className="modal">
                     <button className="closeBtn" onClick={()=> this.props.closeCreateNew()}>X</button>
                        <div className="modal-content">
                            <h2><span className="blue">Join</span> our platform</h2>
                            <Link to="login" className="btn whiteBG">Log in</Link>
                            <Link to="signup" className="btn redBG">Sign up</Link>
                        </div>
                    </div>
                </div>
            );
        } 
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