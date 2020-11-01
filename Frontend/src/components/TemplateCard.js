// This is how an individual Template will be displayed on the templates page
import React, { Component } from 'react';
import StarRatings from "react-star-ratings"
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings"

class TemplateCard extends Component {
    state = {
        hasUserRated : false,
        userRating : 0,
        username: null
    };

    // Gets username from user ID
    getUsernameFromID(id) {
        Axios({
            method: 'get',
            url:  host+'/profile/usernameFromUserID',
            params: {
                userID: id
            }
          })
          .then(response => {
            console.log(response.data);
            this.setState({
                username: response.data.username
            })
        })
    };

    rateTemplate(rating) {
        // Check if user is logged in
        if(UserStore.isLoggedIn === false) {
            alert("Please log in to rate a template");
            return;
        }

        // Send rating to server
        Axios({
            method: 'post',
            url:  host+'/template/rateTemplate',
            headers: {
                Authorization : "Bearer " + UserStore.token
            },
            data: {
                userID : UserStore.user.userID,
                templateID: this.props.template.templateID,
                rating: rating
            }
          })
          .then(response => {
              console.log(response.data);
            // Handle response errors
            if(response.data.hasErrors === "True") {
                if(response.data.ratingExists === "True") {
                    alert("You have already rated this template");
                }
            }

            // Successful rating
            else {
                window.location.reload(false);
            }
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    checkHasRated() {
        // Check if user is logged in
        if(UserStore.isLoggedIn === false) {
            return;
        }

        // Send rating to server
        Axios({
            method: 'get',
            url:  host+'/template/hasRated',
            headers: {
                Authorization : "Bearer " + UserStore.token
            },
            params: {
                templateID: this.props.template.templateID
            }
          })
          .then(response => {
            // Handle response errors
            if(response.data.hasErrors === "True") {
                alert("Unknown error, please try again later.");
            }

            // Successful rating
            else if(response.data.hasRated === "True"){
                // Change the rating state
                this.setState({
                    hasUserRated : true,
                    userRating : response.data.rating
                })
            }
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    // Appends "..." to end of string if it exceeds a specified length
    shortenString(str, len) {
        if(str == null) return;
        if(str.length > len - 3) {
        return str.substring(0,len-3) + "...";
        }
        return str;
    }

    componentDidMount() {
        this.getUsernameFromID(this.props.template.userID)
        this.checkHasRated();
    }

    render () {
        return (
            <div className = "templateCard">
                <p className="bold">{this.shortenString(this.props.template.title, 26)}</p>
                <p>Created by: {this.shortenString(this.state.username,20)}</p>
                <button onClick = {() => this.props.createNew(this.props.template.templateID)}>Use Template</button>
                <span> 
                    {
                        this.props.template.rating > 0
                        ? "Rating: " + this.props.template.rating.toString().substring(0,3) + "/5 " 
                        : null
                    }
                    {
                        this.props.template.rating > 0
                        ? <StarRatings
                            rating={1}
                            starRatedColor="orange"
                            numberOfStars={1}
                            name='rating'
                            className="templateRatingStars"
                            starDimension="20px"
                            starSpacing="4px"
                          /> 
                        : null
                    }
                    {
                        this.props.template.rating < 0
                        ? "Unrated" : null
                    }
                    {" | "} 
                    <StarRatings
                        rating={this.state.userRating}
                        starRatedColor="blue"
                        changeRating={(rating) => this.rateTemplate(rating)}
                        numberOfStars={5}
                        name='rating'
                        className="templateRatingStars"
                        starDimension="20px"
                        starSpacing="4px"
                    />
                </span>
            </div>
        );
    }
}

export default TemplateCard;