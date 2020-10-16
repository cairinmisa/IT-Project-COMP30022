import React, { Component } from 'react';
import InputField from "../pages/InputField";
import {Redirect} from 'react-router-dom';
import SubmitButton from "../pages/SubmitButton";

class CreateNew extends Component {

    state = {
        publicity : "True",
        input : "",
        useTemplate : false,
        templatePageRedirect : false
    }

    handleSubmit(){
        this.props.createPortfolio(this.state.input, this.state.publicity)
    }

    templateRedirect(){
        this.setState({
            templatePageRedirect : true
        })
    }

    render() { 
        if(this.state.templatePageRedirect == true){
            return <Redirect  to="/template" />
        }
        return (  
            <div className="greyOutBG">
                 <div className="modal">
                 <button className="closeBtn" onClick={()=> this.props.closeCreateNew()}>X</button>
                    <div className="modal-content">
                        <h2>Create New Portfolio</h2>
                        <button onClick={() => this.templateRedirect()}>Create From Template</button>
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
 
export default CreateNew;

