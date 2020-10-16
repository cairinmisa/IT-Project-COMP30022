import React, { Component } from "react";
import TemplateCategory from "../components/TemplateCategory"
import {Link} from "react-router-dom";

class Template extends Component {
  render() {
    return (
      <div>
        <h1>Templates.</h1>
        <h2>Made by the community.</h2>
        <TemplateCategory displayTitle="Highest Rated" category="All" sort="rating"/>
        <TemplateCategory displayTitle="Technology" category="Technology" sort="rating"/>
      </div>
    );
  }
}

export default Template;
