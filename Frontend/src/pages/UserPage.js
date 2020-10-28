import React, { Component } from 'react';
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings";

class UserPage extends Component {
    state = { 
        email : this.props.email,
        userName : "",
        fullName : "",
        userID : "",
        portfolios: [],
        templates: []
     }

     async getPortfolios(ID){
      await Axios({
        method: 'get',
        url:  host+'/eportfolio/fetchPublic', 
        params: {
          userID : ID
        }
      })
      .then(response => {
        console.log(response)
        let portfolios = [];
        for(let i=0;i<response.data.length;i++){
          portfolios[i] = [response.data[i].data,response.data[i].title,response.data[i].eportID]
        }
        this.setState({
          portfolios : portfolios
        });
      })
      .catch(response => {
        console.log(response)
      }) 
    }


    async getUser(email){
        await Axios({
          method: 'get',
          url:  host+'/profile/findUser', 
          params: {
            emailAddress : email
          }
        })
        .then(response => {
          console.log(response)
          this.setState({
            fullName : response.data.firstName + " " + response.data.lastName,
            userName : response.data.username,
            userID : response.data.userID
          })
        })
        .catch(response => {
          console.log(response)
        }) 
    }

    componentDidMount(){
        this.getUser(this.props.email)
        console.log(this.props.userID)
        this.getPortfolios(this.props.userID)
    }

    render() { 
        return ( 
            <div className = "accountForm">
              <div className ="accountForm-content">
                <h1>{this.state.fullName}</h1>
                <p className="username">@{this.state.userName}</p>
                <p className="bold">Public Folios:</p>
                <ul className="folioTemplateList">
                  {
                    this.state.portfolios.length !== 0
                      ? this.state.portfolios.map((portfolio) => <li>{portfolio[1]}</li>)
                      : "User does not have any public folios."
                  }
                </ul>
                <p className="bold">Public Templates:</p>
                <ul className="folioTemplateList">
                  {
                    this.state.templates.length !== 0
                      ? this.state.templates.map((template) => <li>{template[1]}</li>)
                      : "User does not have any public templates."
                  }
                </ul>
              </div>
            </div>
        );
    }
}
 
export default UserPage;