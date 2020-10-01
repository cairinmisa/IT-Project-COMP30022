import React from 'react';
import InputField from "../pages/InputField";

class EditFieldModal extends React.Component {
    state = {
        input: null,
        password: null
    };
    resetModal = false;

    // Send edit request to server
    submitValue(whichField, input, password) {

    }

    render() {
        if(!this.props.show) {
            this.resetModal = false;
            return null;
        }
        else if (!this.resetModal) {
            this.state.input = this.props.prevInput;
            this.state.password = null;
            this.resetModal = true;
        }
        return (
            <div className="greyOutBG">
                <div className="modal">
                    <button className="closeBtn" onClick={()=> this.props.onClose()}>X</button>
                    <div className="modal-content">
                        <div>{this.props.children}</div>
                        <div>
                            <InputField
                                type={this.props.fieldType}
                                placeholder={this.props.whichField}
                                value={this.state.input ? this.state.input : ""}
                                onChange={(val) => this.setState({input:val})}
                            ></InputField>
                            <InputField
                                type="password"
                                placeholder="Password"
                                value={this.state.password ? this.state.password : ""}
                                onChange={(val) => this.setState({password:val})}
                            ></InputField>
                            <button onClick={()=> this.props.onSubmit()}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditFieldModal;