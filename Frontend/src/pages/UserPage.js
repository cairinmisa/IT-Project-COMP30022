import React, { Component } from 'react';
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings";
import SubmitButton from "./SubmitButton";
import { Redirect } from 'react-router-dom';

class UserPage extends Component {
    state = { 
        email : this.props.email,
        userName : "",
        fullName : "",
        userID : "",
        portfolios: [],
        templates: [],
        isLoggedInUser : false,
        redirectToModify : false
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
        if(UserStore.user !== null && this.state.email === UserStore.user.emailAddress) {
          this.setState({
            isLoggedInUser : true
          });
        }
    }

    render() { 
        if(this.state.redirectToModify) {
          return (
            <Redirect to="/accountinfo" />
          )
        }
        return ( 
            <div className = "accountForm">
              <div className ="accountForm-content">
                {/* Name of User */}
                <h1>✌🏼 {this.state.fullName} ✌🏼</h1>
                <p className="username">@{this.state.userName}</p>
                
                {/* Public Portfolio List */}
                <p className="bold">Public Folios:</p>
                {
                  this.state.portfolios.length !== 0
                    ? this.state.portfolios.map((portfolio, i) => <li className="folioTemplate-li" key={i}>{portfolio[1]}</li>)
                    : (this.state.isLoggedInUser ? "You do not have any public folios." : "User does not have any public folios.")
                }

                {/* Public Template List */}
                <p className="bold">Public Templates:</p>
                {
                  this.state.templates.length !== 0
                    ? this.state.templates.map((template, i) => <li className="folioTemplate-li" key={i}>{template[1]}</li>)
                    : (this.state.isLoggedInUser ? <p>You do not have any public templates.</p> : <p>User does not have any public templates.</p>)
                }

                {/* Button to modify user if logged in */}
                {
                  this.state.isLoggedInUser 
                  ? <SubmitButton
                    text="Modify Account/Logout" derivedClass="redBG"
                    onClick={() => this.setState({redirectToModify : true})}
                    ></SubmitButton>
                  : null
                }
              </div>
            </div>
        );
    }
}
 
export default UserPage;