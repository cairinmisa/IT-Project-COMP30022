import React, { Component } from "react";
import UserStore from "../stores/UserStore";

class ProfilePage extends Component {
    capitaliseName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    doLogout() {
        localStorage.setItem("user", null);
        localStorage.setItem("token", null);
        this.props.history.push('/');
        window.location.reload(false);
    }

    render() {
        return (
            <div>
                <h1>Welcome {this.capitaliseName(UserStore.user.firstName)}</h1>
                <button onClick={() => this.doLogout()}>Logout</button>
            </div>
        );
    }
}

export default ProfilePage;