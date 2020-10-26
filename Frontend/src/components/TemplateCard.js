// This is how an individual Template will be displayed on the templates page
import React, { Component } from 'react';
import {host} from "../stores/Settings";
import Axios from "axios";

class TemplateCard extends Component {
    state = {
        username: null
    }

    // Gets username from user ID
    getUsernameFromID(id) {
        Axios({
            method: 'get',
            url:  host+'/profile/usernameFromUserID',
            params: {
                userID: id
            }
          })
          .then(response => {
            console.log(response.data);
            this.setState({
                username: response.data.username
            });
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    componentDidMount() {
        this.getUsernameFromID(this.props.template.userID)
    }

    render () {
        return (
            <div className = "templateCard">
                <p className="bold">{this.props.template.title}</p>
                <p>Rating: {this.props.template.rating}/5</p>
                <p>Created by: {this.state.username}</p>
                <button onClick = {() => this.props.createNew(this.props.template.templateID)}>Use Template</button>
            </div>
        );
    }
}

export default TemplateCard;