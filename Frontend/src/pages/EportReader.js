import React, { Component } from 'react';
import UserStore from "../stores/UserStore";
import Axios from "axios";
import {host} from "../stores/Settings";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonBlockEditor from "ckeditor5-custom-build/build/ckeditor";

class EportReader extends Component {
    state = { 
      data : ""
    }

    constructor(props){
        super(props);
    }

    async getPortfolio(search){
        await Axios({
          method: 'post',
          url:  host+'/eportfolio/fetch', 
          headers: {
            Authorization : "Bearer " + UserStore.token
          },
          data: {
            eportID : search
          }
        })
        .then(response => {
          console.log(response)
          this.setState({data : response.data.data})
        })
        .catch(response => {
          console.log(response)
        }) 
    }

    async getTemplate(search){
      await Axios({
        method: 'get',
        url:  host+'/template/searchByID', 
        headers: {
          Authorization : "Bearer " + UserStore.token
        },
        params: {
          templateID : search
        }
      })
      .then(response => {
        console.log(response)
        this.setState({data : response.data.data})
      })
      .catch(response => {
        console.log(response)
      }) 
  }

    componentDidMount(){
      console.log(this.props.eportID,this.props.tempID)
      if(this.props.eportID !== ""){
        this.getPortfolio(this.props.eportID);
      }
      if(this.props.tempID !== ""){
        this.getTemplate(this.props.tempID)
      }
    }

    render() { 
        return ( 
          <div className="readerContent">
            <CKEditor
                      editor={ BalloonBlockEditor }
                      data={this.state.data ? this.state.data : ""}
                      disabled = {true}
                      config = {{
                        simpleUpload: {
                          // The URL that the images are uploaded to.
                          uploadUrl: host+'/uploader',
                        }
                      }}
            />
          </div>
        )
    }
}
 
export default EportReader;