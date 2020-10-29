// This is how an individual Template will be displayed on the templates page
import React, { Component } from 'react';
import StarRatings from "react-star-ratings"
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings"

class TemplateCard extends Component {
    state = {
        hasUserRated : false,
        userRating : null
    };

    rateTemplate(rating) {
        // Check if user is logged in
        if(UserStore.isLoggedIn === false) {
            alert("Please log in to rate a template");
            return;
        }

        // Send rating to server
        Axios({
            method: 'get',
            url:  host+'/template/rateTemplate',
            headers: {
                Authorization : "Bearer " + UserStore.token
            },
            params: {
                userID : UserStore.user.userID,
                rating: rating
            }
          })
          .then(response => {
            // Handle response errors
            if(response.data.hasErrors === "True") {
                if(response.data.ratingExists === "True") {
                    alert("You have already rated this template");
                }
            }

            // Successful rating
            else {
                // Change the rating state
                this.setState({
                    hasUserRated : true,
                    userRating : rating
                })
            }
          })
          .catch(response => {
            console.log(response);
          }) 
    }

    render () {
        return (
            <div className = "templateCard">
                <p className="bold">{this.props.template.title}</p>
                <p>Created by: {this.props.template.userID}</p>
                <button onClick = {() => this.props.createNew(this.props.template.templateID)}>Use Template</button>
                {
                    this.state.hasUserRated
                        ? <StarRatings
                            rating={this.state.userRating}
                            starRatedColor="blue"
                            changeRating={(rating) => console.log("Rating Change" + rating)}
                            numberOfStars={5}
                            name='rating'
                            className="templateRatingStars"
                            starDimension="20px"
                            starSpacing="4px"
                          />
                        : <StarRatings
                            rating={this.props.template.rating}
                            starRatedColor="orange"
                            changeRating={(rating) => this.rateTemplate(rating)}
                            numberOfStars={5}
                            name='rating'
                            className="templateRatingStars"
                            starDimension="20px"
                            starSpacing="4px"
                           />
                }
            </div>
        );
    }
}

export default TemplateCard;