import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import {host} from "./stores/Settings"
import jwt_decode from "jwt-decode";
import UserStore from "./stores/UserStore";

async function setupApp() {
  const token = localStorage.getItem("token");
  const emailAddress = localStorage.getItem("emailAddress");

  // Check if jwt has expired
  if(token != null) {
    var decoded = jwt_decode(token);
    if(Date.now()/1000 > decoded.exp) {
      localStorage.clear();
      return;
    } 
  }
  
  // If email address of user isn't null then grab user data
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
          // User may have been deleted so clear storage
          localStorage.clear();
        }
      })
      .catch(response => {
        console.log("Unable to find server or an unknown error has occured. Wiping Local Storage.");
        localStorage.clear();
      });
  }

  ///
  ReactDOM.render(
      <App />,
    document.getElementById("root")
  );
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}
setupApp();
