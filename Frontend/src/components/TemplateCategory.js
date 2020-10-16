import React, { Component } from 'react';
import {host} from "../stores/Settings";
import Axios from "axios";
import TemplateCard from "./TemplateCard"

class TemplateCategory extends Component {
    state = {
        templates : []
    }

    async loadTemplates() {
        await Axios({
            method: 'get',
            url:  host+'/template/getPublic'
          })
          .then(response => {
            // Seperate the data and put templates into a list
            let templates = [];
            for(let i = 0; i < response.data.length; i++){
                templates[i] = response.data[i];
            }

            // Set global templates list
            this.setState({
                templates : templates
            });

            // Print response for debug
            console.log(response);
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    componentDidMount() {
        this.loadTemplates();
    }

    render () {
        return (
            <div className = "template-category-container">
                <h1>{this.props.displayTitle}</h1>
                {this.state.templates.map((template) => <TemplateCard template={template}/>)}
            </div>
        );
    }
}

export default TemplateCategory;