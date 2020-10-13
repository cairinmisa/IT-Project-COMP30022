import React, { Component } from 'react';
import InputField from "../pages/InputField";

class CreateNew extends Component {
    
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        isPublic : false,
        value : "",
        useTemplate : false
    }

    handleChange(event){
        this.setState({value : event.target.value})
    }

    handleSubmit(event){
        alert('A name was submitted: '+ this.state.value)
        event.preventDefault();
    }
    render() { 
        return (  
            <div classname = "greyOutBG">
                 <div className="modal">
                    <div className="modal-content">
                        <form onSubmit = {this.handleSubmit}>
                            <h2>Create New Portfolio</h2>
                            <label>
                                Title:
                                <InputField type="text" value = {this.state.value} onChange = {this.handleChange}></InputField>
                            </label>
                            <select>
                                <option value = "isPublic">Public Portfolio</option>
                                <option value = "isPublic">Private Portfolio</option>
                            </select>
                            <input type = "submit" value = "Submit"/>
                            <button onClick = {this.props.closeCreateNew}>X</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default CreateNew;

