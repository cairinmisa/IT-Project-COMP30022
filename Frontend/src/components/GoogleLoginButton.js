import React, { Component } from "react";
import {GoogleLogin} from "react-google-login";
import axios from "axios";
import {host} from "../stores/Settings";
import UserStore from "../stores/UserStore";

const CLIENT_ID = "678370899290-c6n53p7t4351dtqgmdjl6a80qjq5h26i.apps.googleusercontent.com";

class GoogleLoginButton extends Component {
    // Handles response from backend
    async handleResponse(response) {
        //handle success from database
        if(!response.data.hasErrors) {
            // Split Bearer from token
            UserStore.token = response.data.token.split(" ")[1];

            // Set the local storage of user
            localStorage.setItem("token", UserStore.token);
            localStorage.setItem("emailAddress", response.data.emailAddress);

            // Update status & force reload
            UserStore.isLoggedIn = true;
            window.location.reload(false);

        }
        else if (response.data.hasErrors){
            alert("Unable to create user from Google ID");
        }
    }

    // Handles error response from backend 
    handleResponseError(response) {
        console.log(response);
    }

    // Called on successful Google Login
    onSuccess = (res) => {
        const token = res.tokenId;

        // Send token to back end here and await response
        axios({
            method: 'post',
            url:  host+'/profile/login',
            data: {
              googleToken: token
            }
            })
            .then(response => this.handleResponse(response))
            .catch(response => this.handleResponseError(response));
    };

    // Called when something went wrong with Google Login
    onFailure = (res) => {
        console.log(res);
    };

    render() {
        return (
            <div className="googleButton">
                <GoogleLogin
                    clientId={CLIENT_ID}
                    render={renderProps => (
                        <button onClick={renderProps.onClick} className="btn">
                            <img src={require("../images/svgs/google-icon.svg")} alt="Google Icon"/>
                            Log in with Google.
                        </button>
                    )}
                    buttonText="Log in With Google"
                    onSuccess={res => this.onSuccess(res)}
                    onFailure={res => this.onFailure(res)}
                />
            </div>
        )
    };
}

export default GoogleLoginButton;
