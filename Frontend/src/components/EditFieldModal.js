import React from 'react';
import InputField from "../pages/InputField";
import axios from "axios";
import {host} from "../stores/Settings"
import UserStore from "../stores/UserStore";

class EditFieldModal extends React.Component {
    state = {
        input: null,
        password: null,
        password2: null
    };
    resetModal = false;

    resetForm() {
        this.setState({
            input: this.props.prevInput,
            password: null,
            password2: null
        });
    }

    handleResponse(response) {
        console.log(response);
        // Modifying success
        if(!response.data.hasErrors) {
            // Submit if everything went smoooth
            this.props.onSubmit();

            // Also force app reload so data is up to date
            window.location.reload(false);
        } else if(response.data.hasErrors) {
            this.resetForm();
        }
    }

    handleResponseError(response) {
        console.log(response);
        alert("An unknown error has occured.");
        this.resetForm();
    }

    // Send edit request to server
    async submitValue(whichField, input, password, password2) {
        // Check if all fields have input
        if(input != "" && password != "" && password2 != ""){
            // Make a value being changed property
            let valueModifying = "";
            if(whichField === "First Name") {
                valueModifying = "firstName";
            } else if(whichField === "Last Name") {
                valueModifying = "lastName";
            } else if(whichField === "Email") {
                valueModifying = "emailAddress";
            } else if(whichField === "Username") {
                valueModifying = "username";
            } else if(whichField === "Date of Birth") {
                valueModifying = "dob";
            }
            
            // Run check to server
            await axios({
                method: 'put',
                url:  host+'/profile/update',
                data: {
                    userID: UserStore.user.userID,
                    oldpassword: password,
                    oldpassword2: password2,
                    [valueModifying]: input
                }
                })
                .then(response => this.handleResponse(response))
                .catch(response => this.handleResponseError(response));
        }
    }

    render() {
        if(!this.props.show) {
            this.resetModal = false;
            return null;
        }
        else if (!this.resetModal) {
            this.state.input = this.props.prevInput;
            this.state.password = null;
            this.state.password2 = null;
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
                                placeholder={this.props.whichField === "Password" ? "Old Password" : "Password"}
                                value={this.state.password ? this.state.password : ""}
                                onChange={(val) => this.setState({password:val})}
                            ></InputField>
                            <InputField
                                type="password"
                                placeholder={this.props.whichField === "Password" ? "Confirm Old Password" : "Confirm Password"}
                                value={this.state.password2 ? this.state.password2 : ""}
                                onChange={(val) => this.setState({password2:val})}
                            ></InputField>
                            <button onClick={()=> this.submitValue(this.props.whichField, this.state.input, this.state.password, this.state.password2)}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditFieldModal;