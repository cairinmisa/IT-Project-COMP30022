import React, { Component } from 'react';
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings";

class UserPage extends Component {
    state = { 
        userEmail : "",
        userName : "",
        fullName : ""
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
            fullName : response.data.fullName,
            userName : response.data.username
          })
        })
        .catch(response => {
          console.log(response)
        }) 
      
  }

    componentDidMount(){
        this.setState({userEmail : this.props.email})
        this.getUser(this.state.userEmail)
    }

    render() { 
        return ( 
            <div>
              <h1>{this.state.fullName}</h1>
              <h2>{this.state.userName}</h2>
            </div>
        );
    }
}
 
export default UserPage;