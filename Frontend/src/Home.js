import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="welcome">
          <div className="welcome-content">
          <img src={require("./images/fullbluelogo.png")} alt="Welcome Image" />
            <h1>
              Welcome to the eProfolio creation engine. Browse community made <Link to="/template">templates</Link> or{" "}
              <Link to="/editor">create your own</Link> folio.
            </h1>
          </div>
        </div>
        <div className="highlight">
          <div className="highlight-text">
            <h2>
              <img src={require("./images/highlight.PNG")} alt="Portfolio Highlight 1" />
              👏 A{" "}<span className="blue">new way</span> to create portfolios 👏
            </h2>
            <h3>
              Our easy to use workspace makes creating displays of your work a
              breeze, so you can focus on job applications instead of spending
              hours aligning an image in Word.
            </h3>
          </div>
        </div>
        <div className="highlight">
          <div className="highlight-text">
            <h2>
              <img src={require("./images/highlight-4.PNG")} alt="Portfolio Highlight 2" />
              <span className="blue">🚀 Show off</span> your work in minutes 🚀
            </h2>
            <h3>
              We provide plenty of ready to go templates so that you don't need
              to worry about creating. Select a template, update it with your
              projects/details, and you will be good to go.
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
