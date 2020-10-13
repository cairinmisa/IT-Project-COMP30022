import React, { Component } from 'react';
import InputField from "../pages/InputField";

class CreateNew extends Component {

    state = {
        isPublic : false,
        input : "",
        useTemplate : false
    }

    handleSubmit(){
        alert('A name was submitted: '+ this.state.input)
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
                        <select>
                            <option value = "isPublic">Public Portfolio</option>
                            <option value = "isPublic">Private Portfolio</option>
                        </select>
                        <button onClick={() => this.handleSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default CreateNew;

