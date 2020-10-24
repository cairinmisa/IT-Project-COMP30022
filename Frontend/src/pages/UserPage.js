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
        portfolios: []
     }

     async getPortfolios(ID){
      await Axios({
        method: 'post',
        url:  host+'/eportfolio/userfetch', 
        headers: {
          Authorization : "Bearer " + UserStore.token
        },
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
          headers: {
            Authorization : "Bearer " + UserStore.token
          },
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
        console.log("This is the email " + this.props.email)
        this.getUser(this.props.email)
        this.getPortfolios(this.state.userID)
    }

    render() { 
        return ( 
            <div>
              <h1>{this.state.fullName}</h1>
              <h2>{this.state.userName}</h2>
              {this.state.portfolios.map((portfolio) => <li>{portfolio[1]}</li>)}
            </div>
        );
    }
}
 
export default UserPage;