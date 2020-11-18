import React, { Component } from 'react';
import InputField from "../pages/InputField";

class CreateTemplateModal extends Component {

    state = {
        publicity : "True",
        title : "",
        category: "Professional"
    }

    // Called when user clicks submit button
    handleSubmit(){
        this.props.createTemplate(this.state.title, this.state.publicity, this.state.category)
    }

    render() { 
        return (  
            <div className="greyOutBG">
                 <div className="modal">
                 <button className="closeBtn" onClick={()=> this.props.closeCreateNew()}>X</button>
                    <div className="modal-content">
                        <h2>Create Template From Folio</h2>
                        <InputField
                            type="text"
                            placeholder="Enter Template Name"
                            value={this.state.title ? this.state.title : ""}
                            onChange={(val) => this.setState({title:val})}
                        ></InputField>
                        <select
                        onChange = {(e) => this.setState({publicity : e.target.value})}
                        >
                            <option value = "True">Public Template</option>
                            <option value = "False">Private Template</option>
                        </select>
                        <span className="inputHint">Category.</span>
                        <select
                        onChange = {(e) => this.setState({category : e.target.value})}
                        >
                            <option value = "Professional">Professional</option>
                            <option value = "Working">Working</option>
                            <option value = "Display">Display</option>
                            <option value = "Art">Art</option>
                            <option value = "Technology">Technology</option>
                            <option value = "Science">Science</option>
                        </select>
                        <button onClick={() => this.props.createTemplate(this.state.title, this.state.publicity, this.state.category)}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default CreateTemplateModal;

