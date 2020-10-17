// This is how an individual Template will be displayed on the templates page
import React, { Component } from 'react';

class TemplateCard extends Component {
    render () {
        return (
            <div className = "templateCard">
                <p>{this.props.template.title}</p>
                <p>Rating: {this.props.template.rating}/5</p>
                <button onClick = {() => this.props.createNew(this.props.template.templateID)}>Use Template</button>
            </div>
        );
    }
}

export default TemplateCard;