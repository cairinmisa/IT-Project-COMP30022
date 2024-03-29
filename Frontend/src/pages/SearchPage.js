import React, { Component } from 'react';
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings";
import {Link} from "react-router-dom";

class SearchPage extends Component {
    state = { 
        users : [],
        templates : [],
        eportfolios : [],
        usernames : []
    }

    constructor(props){
      super(props);
    }

    // Called when user clicks on a user search result
    handleClick(email,userID) {
      this.props.findUser(email,userID)
    }

    // Called when user clicks on a folio search result
    searchEport(eportID){
      this.props.searchEport(eportID);
    }

    // Called when user clicks on a template search result
    searchTemp(tempID){
      this.props.searchTemp(tempID);
    }

    // Search templates by title
    async getTemplates(search){
        await Axios({
          method: 'get',
          url:  host+'/template/searchByTitle', 
          headers: {
            Authorization : "Bearer " + UserStore.token
          },
          params: {
            title : search
          }
        })
        .then(response => {
          let reqtemplates = [];
          for(let i=0;i<response.data.length;i++){
            reqtemplates[i] = [response.data[i].data,response.data[i].title,response.data[i].templateID, response.data[i].username];
          }
          this.setState({
            templates : reqtemplates
          });
        })
        .catch(response => {
          // An unknown error has occurred
          console.log(response)
        }) 
        
    }

    // Search user by their full name
    async getUsers(search){
      await Axios({
        method: 'get',
        url:  host+'/profile/searchByName', 
        headers: {
          Authorization : "Bearer " + UserStore.token
        },
        params: {
          fullName : search
        }
      })
      .then(response => {
        let reqUsers = [];
        for(let i=0;i<response.data.length;i++){
          reqUsers[i] = [response.data[i].fullName, response.data[i].emailAddress, response.data[i].username,response.data[i].userID]
        }
        this.setState({
          users : reqUsers
        });
      })
      .catch(response => {
        // An unknown error has occurred
        console.log(response)
      }) 
    }

    // Searches folios by title
    async getPortfolios(search){
        await Axios({
          method: 'get',
          url:  host+'/eportfolio/searchByTitle', 
          headers: {
            Authorization : "Bearer " + UserStore.token
          },
          params: {
            title : search
          }
        })
        .then(response => {
          let reqPortfolios = [];
          for(let i=0;i<response.data.length;i++){
            reqPortfolios[i] = [response.data[i].title, response.data[i].eportID, response.data[i].userID, response.data[i].username];
          }
          this.setState({
            eportfolios : reqPortfolios
          });
        })
        .catch(response => {
          // An unknown error has occurred
          console.log(response)
        }) 
      }
    
    // Search users, folios and templates by the search string
    componentDidMount(){
        this.getTemplates(this.props.search)
        this.getUsers(this.props.search)
        this.getPortfolios(this.props.search)
    }


    render() { 
        if(this.state.users.length>0 || this.state.eportfolios.length>0 || this.state.templates.length>0){
          return (  
              <div>  
                  <div>
                  {this.state.users.length>0 ? <h1>Users</h1> : null}
                  <ul>
                    {this.state.users.map((user) => <Link to = "/user" onClick = {() => this.handleClick(user[1],user[3])}><li>{user[0]}, {user[2]}</li></Link>)}
                  </ul>
                  </div>
                  <div>
                  {this.state.eportfolios.length>0 ? <h1>Eportfolios</h1> : null}
                  <ul>
                    {this.state.eportfolios.map((eportfolio) => <li><Link to = "/eportReader" onClick = {() => this.searchEport(eportfolio[1])}>{eportfolio[0]}.</Link> Created By {eportfolio[3]}</li>)}
                  </ul>
                  </div>
                  <div>
                  {this.state.templates.length>0 ? <h1>Templates</h1> : null}
                  <ul>
                    {this.state.templates.map((template) => <li><Link to = "/eportReader" onClick = {() => this.searchTemp(template[2])}>{template[1]}.</Link> Created by {template[3]}</li>)}
                  </ul>
                  </div>
              </div>
          );
        }
      else{
        return(
          <h1>Can not find any matches for "{this.props.search}".</h1>
        )
      }
    }
}
 
export default SearchPage;