import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";

axios({
  method: 'get',
  url: 'http://localhost:8000/profile/login',
  params: {
    emailAddress: "test@gmail.com",
    password: "yikes"
  }
  })
  .then(function (response) {
      //handle success
      console.log(response.data.result);
      if(response.data.result == "Success") {
        console.log("LOGGED ON");
      }
  })
  .catch(function (response) {
      //handle error
      console.log(response);
  });

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
