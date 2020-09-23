import React, { Component } from "react";
import {Link} from "react-router-dom";

class Template extends Component {
  render() {
    return (
      <div>
        <h1>Template Page</h1>
        <div>
          <li>
            <Link to = "/editor"><img src={require("../images/Template1.PNG")}/></Link>
          </li>
          <li>
            <Link to = "/editor"><img src={require("../images/Template2.PNG")}/></Link>
          </li>
        </div>
      </div>
    );
  }
}

export default Template;
