import React, { Component } from "react";
import UserStore from "../stores/UserStore";
import SubmitButton from "./SubmitButton";
import EditFieldModal from '../components/EditFieldModal';

class ProfilePage extends Component {
    capitaliseName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Logs user out of their account and redirects to home page
    doLogout() {
        localStorage.clear();
        this.props.history.push('/');
        window.location.reload(false);
    }

    state = {
        showEdit: false,
        whichField: null,
        fieldPrevValue: null,
        editFieldType: null
    };

    // Shows pop up window prompting user for new information
    showEditModal = (field, value, type) => {
        this.setState({
            showEdit: true,
            whichField: field,
            fieldPrevValue: value,
            editFieldType: type
        });
    };
    
    // Occurs when user closes pop up window
    closeEditModal = () => {
        this.setState({
            showEdit: false
        });
    }

    // Occurs when user submits new information
    submitEditModal = (field, value) => {
        console.log("Received new change: Changing field " + field + " to " + value);
        this.setState({
            showEdit: false,
            whichField: field
        });
    };

    render() {
        return (
            <div className="accountForm">
                <div className="accountForm-content"><h1>👨‍💼 Manage your account 👩‍💼</h1>
                    <p className="medium"><span className="bold">First name:</span> {this.capitaliseName(UserStore.user.firstName)}<button onClick={() => this.showEditModal("First Name", UserStore.user.firstName, "text")}>Edit</button></p> 
                    <p className="medium"><span className="bold">Last name:</span> {this.capitaliseName(UserStore.user.lastName)}<button onClick={() => this.showEditModal("Last Name", UserStore.user.lastName, "text")}>Edit</button></p> 
                    <p className="medium"><span className="bold">Username:</span> {UserStore.user.username}<button onClick={() => this.showEditModal("Username", UserStore.user.username, "text")}>Edit</button></p>
                    <p className="medium"><span className="bold">Email</span> {UserStore.user.emailAddress}<button onClick={() => this.showEditModal("Email", UserStore.user.emailAddress, "text")}>Edit</button></p>
                    <p className="medium"><span className="bold">Date of birth:</span> {UserStore.user.dOB ? UserStore.user.dOB : "Not Specified"}<button onClick={() => this.showEditModal("Date of Birth", UserStore.user.dOB, "date")}>Edit</button></p>
                    <SubmitButton
                    text="Logout"
                    onClick={() => this.doLogout()}
                    ></SubmitButton>
                </div>
                <EditFieldModal
                    fieldType={this.state.editFieldType} 
                    prevInput={this.state.fieldPrevValue} 
                    whichField={this.state.whichField} 
                    onSubmit={this.submitEditModal} 
                    onClose={this.closeEditModal} 
                    show={this.state.showEdit}>
                    <h2>Enter new {this.state.whichField}.</h2>
                </EditFieldModal>
            </div>
        );
    }
}

export default ProfilePage;