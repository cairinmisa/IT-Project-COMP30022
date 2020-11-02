import React, { Component } from 'react';
import {host} from "../stores/Settings";
import Axios from "axios";
import TemplateCard from "./TemplateCard"

class TemplateCategory extends Component {
    state = {
        templates : []
    }

    // Loads public templates
    // TODO: Change such that it loads templates of a specific category
    //       and sorts them according to this.props.sort
    async loadTemplates() {
        await Axios({
            method: 'get',
            url:  host+'/template/getPublic',
            params: {
                category : this.props.category
            }
          })
          .then(response => {
            // Seperate the data and put templates into a list
            let templates = [];
            for(let i = 0; i < response.data.length; i++){
                templates[i] = response.data[i];
            }
            templates.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
            console.log(templates);

            // Set global templates list
            this.setState({
                templates : templates
            });
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    // Grab templates when component is mounted
    componentDidMount() {
        this.loadTemplates();
    }

    render () {
        if(this.state.templates.length === 0) {
            return null;
        }
        return (
            <div className = "templateCategory">
                <h2>{this.props.displayTitle}</h2>
                <div className="templateCategory-content">
                    {this.state.templates.map((template) => <TemplateCard template={template} createNew={(templateID) => this.props.createNew(templateID)}/>)}
                </div>
            </div>
        );
    }
}

export default TemplateCategory;