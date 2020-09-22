import React from "react";
import {GoogleLogin} from "react-google-login";

const CLIENT_ID = "678370899290-c6n53p7t4351dtqgmdjl6a80qjq5h26i.apps.googleusercontent.com"

function GoogleLoginButton() {
    const onSuccess = (res) => {
        console.log(res.profileObj);
    };

    const onFailure = (res) => {

    };

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
                onSuccess={onSuccess}
                onFailure={onFailure}
            />
        </div>
    );
}

export default GoogleLoginButton;