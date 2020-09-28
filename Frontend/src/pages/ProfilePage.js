import React, { Component } from "react";
import UserStore from "../stores/UserStore";

class ProfilePage extends Component {
    capitaliseName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    doLogout() {
        localStorage.clear();
        this.props.history.push('/');
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <h1>Welcome {this.capitaliseName(UserStore.user.firstName)}</h1>
                <h2>Full Name: {this.capitaliseName(UserStore.user.firstName)} {this.capitaliseName(UserStore.user.lastName)}</h2>
                <h3>Username: {UserStore.user.username}</h3>
                <h3>Email: {UserStore.user.emailAddress}</h3>
                <h3>Date of Birth: {UserStore.user.dOB ? UserStore.user.dOB : "Not Specified"}</h3>
                {console.log(UserStore.user)}
                <button onClick={() => this.doLogout()}>Logout</button>
            </div>
        );
    }
}

export default ProfilePage;