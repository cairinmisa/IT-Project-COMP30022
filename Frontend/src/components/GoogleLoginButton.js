import React, { Component } from "react";
import {GoogleLogin} from "react-google-login";
import axios from "axios";
import {host} from "../stores/Settings";
import UserStore from "../stores/UserStore";

const CLIENT_ID = "678370899290-c6n53p7t4351dtqgmdjl6a80qjq5h26i.apps.googleusercontent.com";

class GoogleLoginButton extends Component {
    async handleResponse(response) {
        //handle success from database
        if(!response.data.hasErrors) {
            UserStore.isLoggedIn = true;
            UserStore.token = response.data.token;

            // Get username from token
            // await axios({
            //     method: 'get',
            //     url: host+'/profile/findUser',
            //     params: {
            //         emailAddress: this.state.email
            //     }
            //     })
            //     .then(response => {
            //         UserStore.user = response.data;

            //         // Set local storage
            //         localStorage.setItem("user", JSON.stringify(UserStore.user));
            //         localStorage.setItem("token", UserStore.token);
            //     })
            //     .catch(response => {
            //         console.log(response);
            //     });
        }
        else if (response.data.hasErrors){
            alert("Unable to create user from Google ID");
        }
    }

    handleResponseError(response) {
        console.log(response);
    }

    onSuccess = (res) => {
        console.log("Received Token");
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

    onFailure = (res) => {

    };

    render() {
        return (
            <div className="googleButton">
                <GoogleLogin
                    clientId={CLIENT_ID}
                    render={renderProps => (
                        <button onClick={renderProps.onClick} className="btn">
                            <img src={require("../images/svgs/google-icon.svg")}/>
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