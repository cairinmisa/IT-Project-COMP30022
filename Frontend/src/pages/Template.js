import React, { Component } from "react";
import TemplateCategory from "../components/TemplateCategory"
import {Link} from "react-router-dom";

class Template extends Component {
  render() {
    return (
      <div className="templatePage">
        <div className="templatePage-header">
          <h1>Templates.</h1>
          <h2 className="grey">Made by the community.</h2>
        </div>
        <TemplateCategory displayTitle="Highest Rated" category="All" sort="rating"/>
        <TemplateCategory displayTitle="Technology" category="Technology" sort="rating"/>
        <TemplateCategory displayTitle="Professional" category="Professional" sort="rating"/>
      </div>
    );
  }
}

export default Template;
