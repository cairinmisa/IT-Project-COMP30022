import React, { Component } from "react";
import UserStore from "../stores/UserStore";
import SubmitButton from "./SubmitButton";
import EditFieldModal from '../components/EditFieldModal';

class ProfilePage extends Component {
    capitaliseName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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

    showEditModal = (field, value, type) => {
        this.setState({
            showEdit: true,
            whichField: field,
            fieldPrevValue: value,
            editFieldType: type
        });
    };

    closeEditModal = () => {
        this.setState({
            showEdit: false
        });
    }

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
                <div className="accountForm-content"><h1>Account Management.</h1>
                    <h3 className="medium"><span className="bold">First Name:</span> {this.capitaliseName(UserStore.user.firstName)}<button onClick={() => this.showEditModal("First Name", UserStore.user.firstName, "text")}>Edit</button></h3> 
                    <h3 className="medium"><span className="bold">Last Name:</span> {this.capitaliseName(UserStore.user.lastName)}<button onClick={() => this.showEditModal("Last Name", UserStore.user.lastName, "text")}>Edit</button></h3> 
                    <h3 className="medium"><span className="bold">Username:</span> {UserStore.user.username}<button onClick={() => this.showEditModal("Username", UserStore.user.username, "text")}>Edit</button></h3>
                    <h3 className="medium"><span className="bold">Email</span> {UserStore.user.emailAddress}<button onClick={() => this.showEditModal("Email", UserStore.user.emailAddress, "text")}>Edit</button></h3>
                    <h3 className="medium"><span className="bold">Date of Birth:</span> {UserStore.user.dOB ? UserStore.user.dOB : "Not Specified"}<button onClick={() => this.showEditModal("Date of Birth", UserStore.user.dOB, "date")}>Edit</button></h3>
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
                    Enter in new {this.state.whichField}
                </EditFieldModal>
            </div>
        );
    }
}

export default ProfilePage;