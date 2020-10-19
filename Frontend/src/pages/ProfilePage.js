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
        editFieldType: null,
        isGoogleUser: false
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
    submitEditModal = () => {
        this.setState({
            showEdit: false
        });
    };

    componentDidMount() {
        console.log(UserStore.user);
        if(UserStore.user.googleUser == "True"){
            this.setState({isGoogleUser : true});
        }
    }

    render() {
        if(UserStore.user == null){
            this.props.history.push('/login');
            window.location.reload(false);
        } else{ 
            return (
                <div className="accountForm">
                    <div className="accountForm-content"><h1>👨‍💼 Manage your account 👩‍💼</h1>
                        <p className="medium"><span className="bold">Email:</span> {UserStore.user.emailAddress}{this.state.isGoogleUser ? null : <button className="noBorder" onClick={() => this.showEditModal("Email", UserStore.user.emailAddress, "text")}>✏️</button>}</p>
                        <p className="medium"><span className="bold">First name:</span> {this.capitaliseName(UserStore.user.firstName)}<button className="noBorder" onClick={() => this.showEditModal("First Name", UserStore.user.firstName, "text")}>✏️</button></p> 
                        <p className="medium"><span className="bold">Last name:</span> {this.capitaliseName(UserStore.user.lastName)}<button className="noBorder" onClick={() => this.showEditModal("Last Name", UserStore.user.lastName, "text")}>✏️</button></p> 
                        <p className="medium"><span className="bold">Username:</span> {UserStore.user.username}<button className="noBorder" onClick={() => this.showEditModal("Username", UserStore.user.username, "text")}>✏️</button></p>
                        <p className="medium"><span className="bold">Date of birth:</span> {UserStore.user.dOB ? UserStore.user.dOB : "Not Specified"}<button className="noBorder" onClick={() => this.showEditModal("Date of Birth", UserStore.user.dOB, "date")}>✏️</button></p>
                        {this.state.isGoogleUser ? null : <SubmitButton
                        text="Change Password" derivedClass="whiteBG"
                        onClick={() => this.showEditModal("Password", "", "password")}
                        ></SubmitButton> }
                        <SubmitButton
                        text="Delete Account" derivedClass="whiteBG"
                        onClick={() => this.showEditModal("Delete Account", "", "")}
                        ></SubmitButton>
                        <SubmitButton
                        text="Logout" derivedClass="redBG"
                        onClick={() => this.doLogout()}
                        ></SubmitButton>
                    </div>
                    <EditFieldModal
                        fieldType={this.state.editFieldType} 
                        prevInput={this.state.fieldPrevValue} 
                        whichField={this.state.whichField} 
                        onSubmit={this.submitEditModal} 
                        onClose={this.closeEditModal} 
                        show={this.state.showEdit}
                        isGoogleUser={this.state.isGoogleUser}>
                        <h2>Enter new {this.state.whichField}.</h2>
                    </EditFieldModal>
                </div>
            );
        }
    }
}

export default ProfilePage;