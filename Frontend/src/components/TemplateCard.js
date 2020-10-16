// This is how an individual Template will be displayed on the templates page
import React, { Component } from 'react';

class TemplateCard extends Component {
    render () {
        return (
            <div className = "template-card">
                <h2>{this.props.template.title}</h2>
            </div>
        );
    }
}

export default TemplateCard;