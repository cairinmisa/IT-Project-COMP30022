import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import {host} from "./stores/Settings"
import jwt_decode from "jwt-decode";
import UserStore from "./stores/UserStore";

// Function called on startup to initiate the app
async function setupApp() {
  // Check if user session has expired by checking
  // if jwt token is still valid
  const token = localStorage.getItem("token");
  if(token != null) {
    var decoded = jwt_decode(token);
    if(Date.now()/1000 > decoded.exp) {
      localStorage.clear();
    } 
  }
  
  // If a user is logged in, then load user data
  // (check if emailAddress stored is null)
  const emailAddress = localStorage.getItem("emailAddress");
  if(emailAddress != null){
    await axios({
      method: 'get',
      url: host+'/profile/findUser',
      params: {
        emailAddress: emailAddress
      }
      })
      .then(response => {
        if(response.data.hasErrors === "False"){
          UserStore.user = response.data;
          UserStore.isLoggedIn = true;
          UserStore.token = token;
        } else if (response.data.hasErrors === "True") {
          // User may have been deleted or something has gone
          // wrong so clear local storage
          localStorage.clear();
        }
      })
      .catch(response => {
        // An error has occurred
        console.log("Unable to find server or an unknown error has occured. Wiping Local Storage.");
        localStorage.clear();
      });
  }

  // Render app when user data has been processed
  ReactDOM.render(
      <App />,
    document.getElementById("root")
  );
}

// Init app
setupApp();
