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
        // Modifying success
        if(!response.data.hasErrors) {
            // Submit if everything went smoooth
            this.props.onSubmit();

            // Also force app reload so data is up to date
            localStorage.setItem("emailAddress", response.data.emailAddress);
            window.location.reload(false);
        } else if(response.data.hasErrors) {
            if(response.data.usernameExists === "True"){
                alert("Username already exists.");
            } if(response.data.oldPasswordGiven === "False"){
                alert("Please provide your password.");
            } if(response.data.oldPassword2Given === "False"){
                alert("Please confirm your password.");
            } if(response.data.passwordMatch === "False"){
                alert("Passwords do not match.");
            } if(response.data.incorrectPassword === "True"){
                alert("Password is incorrect.");
            } if(response.data.emailExists === "True"){
                alert("Email already exists.");
            } if(response.data.passwordLength === "False"){
                alert("Password must be 6-20 characters.");
            } if(response.data.emailValid === "False"){
                alert("Email not valid.");
            }
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
            valueModifying = "dOB";
        } else if(whichField === "Password") {
            valueModifying = "password";
        }

        // Check if all fields have input
        if(input != ""){ 
            // Handle modifying Google user
            if(this.props.isGoogleUser) {
                await axios({
                    method: 'put',
                    url:  host+'/profile/update',
                    headers: {
                        "Authorization": "Bearer " + UserStore.token
                    },
                    data: {
                        userID: UserStore.user.userID,
                        [valueModifying]: input
                    }
                    })
                    .then(response => this.handleResponse(response))
                    .catch(response => this.handleResponseError(response));
            }  
                     
            // Handle modifying regular user
            else if(password != "" && password2 != ""){
                await axios({
                    method: 'put',
                    url:  host+'/profile/update',
                    headers: {
                        "Authorization": "Bearer " + UserStore.token
                    },
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
    }

    // Handles delete response from the database
    handleDeleteResponse(response) {
        console.log(response);
        // Modifying success
        if(response.data.hasErrors === "False") {
            // Send the user back to login page
            localStorage.clear();
            window.location.reload(false);
        } else if (response.data.hasErrors === "True") {
            if(response.data.passwordGiven === "False"){
                alert("Please enter your password.");
            } if(response.data.password2Given === "False"){
                alert("Please confirm your password.");
            } if(response.data.passwordMatch === "False"){
                alert("Passwords do not match.");
            } if(response.data.passwordIncorrect === "True"){
                alert("Password is incorrect.");
            }
        }
    }

    // Functionality for deleting user
    deleteUser(password, password2) {
        // Check to see if the user logged in is a Google User
        // (because deleting their account is slightly different)
        if(this.props.isGoogleUser) {
            axios({
                method: 'delete',
                url:  host+'/profile/',
                headers: {
                    "Authorization": "Bearer " + UserStore.token
                },
                data: {
                    emailAddress: UserStore.user.emailAddress
                }
                })
                .then(response => this.handleDeleteResponse(response))
                .catch(response => {
                    console.log(response);
                    alert("An unknown error has occured.");
                });
        }
        
        // If password fields are not null then delete user 
        else if(password != "" && password2 != "") {
            axios({
                method: 'delete',
                url:  host+'/profile/',
                headers: {
                    "Authorization": "Bearer " + UserStore.token
                },
                data: {
                    password: password,
                    password2: password2,
                    emailAddress: UserStore.user.emailAddress
                }
                })
                .then(response => this.handleDeleteResponse(response))
                .catch(response => {
                    console.log(response);
                    alert("An unknown error has occured.");
                });
        }
    }

    render() {
        if(!this.props.show) {
            this.resetModal = false;
            return null;
        }
        else if (!this.resetModal) {
            this.setState({
                input : this.props.prevInput,
                password: null,
                password2: null
            })
            this.resetModal = true;
        }
        if(this.props.whichField === "Delete Account") {
            return (
                <div className="greyOutBG">
                    <div className="modal">
                        <button className="closeBtn" onClick={()=> this.props.onClose()}>X</button>
                        <div className="modal-content">
                            <h2>Delete Account.</h2>
                            <div>
                                <p>This process cannot be reversed.</p>
                                {this.props.isGoogleUser ? null : <InputField
                                    type="password"
                                    placeholder={this.props.whichField === "Password" ? "Old Password" : "Password"}
                                    value={this.state.password ? this.state.password : ""}
                                    onChange={(val) => this.setState({password:val})}
                                ></InputField> }
                                {this.props.isGoogleUser ? null : <InputField
                                    type="password"
                                    placeholder={this.props.whichField === "Password" ? "Confirm Old Password" : "Confirm Password"}
                                    value={this.state.password2 ? this.state.password2 : ""}
                                    onChange={(val) => this.setState({password2:val})}
                                ></InputField> }
                                <button onClick={()=> this.deleteUser(this.state.password,this.state.password2)}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else{
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
                                {this.props.isGoogleUser ? null : <InputField
                                    type="password"
                                    placeholder={this.props.whichField === "Password" ? "Old Password" : "Password"}
                                    value={this.state.password ? this.state.password : ""}
                                    onChange={(val) => this.setState({password:val})}
                                ></InputField> }
                                {this.props.isGoogleUser ? null : <InputField
                                    type="password"
                                    placeholder={this.props.whichField === "Password" ? "Confirm Old Password" : "Confirm Password"}
                                    value={this.state.password2 ? this.state.password2 : ""}
                                    onChange={(val) => this.setState({password2:val})}
                                ></InputField> }
                                <button onClick={()=> this.submitValue(this.props.whichField, this.state.input, this.state.password, this.state.password2)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default EditFieldModal;