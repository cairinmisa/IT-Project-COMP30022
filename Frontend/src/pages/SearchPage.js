import React, { Component } from 'react';

class SearchPage extends Component {
    state = {  }
    render() { 
        return (  
            <div>  
                <h1>SearchPage</h1>
                <h2>{this.props.search}</h2>
            </div>
        );
    }
}
 
export default SearchPage;