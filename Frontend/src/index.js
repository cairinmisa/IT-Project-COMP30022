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
        console.log(response.data);
        // Check if jwt has expired
        var decoded = jwt_decode(token);
        if(Date.now()/1000 > decoded.exp) {
          localStorage.clear();
        } 
        else {
          UserStore.user = response.data;
          UserStore.isLoggedIn = true;
          UserStore.token = token;
        }
      })
      .catch(response => {
        console.log(response);
      });
  }

  ///
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}
setupApp();
