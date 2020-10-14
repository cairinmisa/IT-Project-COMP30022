import React, { Component } from 'react';
import InputField from "../pages/InputField";

class CreateNew extends Component {

    state = {
        publicity : true,
        input : "",
        useTemplate : false
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
                        <h2>Create New Portfolio</h2>
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

