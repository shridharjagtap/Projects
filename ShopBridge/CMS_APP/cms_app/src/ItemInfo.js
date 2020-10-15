import React, { Component } from 'react';
import axios from 'axios'
import styled from 'styled-components'
import swal from "sweetalert";

export const CenterDiv=styled.div`
    position: absolute;
    width: 60%;
    top: 20%;
    bottom: 0;
    left: 20%;
    right: 0;
    margin: auto
    background: ;
`


class Iteminfo extends Component {
    constructor(props) {
        super(props)
        this.item_id = props.location.search.substring(1).split("=")[1]
        this.state = {item: "",
                      price: '',
                      description: "",
                      image: "",
                      readOnly: true}
        this.onClickHandler = this.onClickHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handleIntegerOnChange = this.handleIntegerOnChange.bind(this)
        this.onCancelHandler = this.onCancelHandler.bind(this)
      }

    componentDidMount(){
        axios.get("http://localhost:8888/api/v1/inventory/" + this.item_id)
            .then( res =>{
                let itemDetails = res.data['data'][0]
                this.setState(itemDetails)
                console.log(res.data['data'])
            }).catch(error => {
                if(error.response){
                    var errorObj = error.response.data;
                    swal("Error Code: " + errorObj.error.code +"\nError Message: " + errorObj.error.message, { icon: "error"});
                }else{
                    swal({text: "Unable to connect to the shopBridge service" , icon: "error"});
                }
            })  
            
    }

    handleOnChange(event){
        this.setState({[event.target.name]: event.target.value});
    }

    onClickHandler(){
        this.setState({readOnly: !this.state.readOnly})
    }

    onCancelHandler(){
        this.setState({readOnly: !this.state.readOnly})
        setTimeout(function(){ window.location.reload() }, 2000);
    }

    handleIntegerOnChange(event){
        event.persist();
        let regEx = /^[1-9][0-9]*$/
        if(regEx.exec(event.target.value)){
            this.setState({[event.target.name]: event.target.value});
        } else {
            if(event.target.value == "" || event.target.value == "0"){
                this.setState({[event.target.name]: event.target.value});
            }
        }
    }

    onSubmitHandler(event){
        event.preventDefault()
        let jsonData = {
            item: this.state.item,
            price: this.state.price,
            description: this.state.description,
            image: this.state.image 
        }

        axios.patch("http://localhost:8888/api/v1/inventory/" + this.item_id, jsonData)
        .then( res =>{
            swal("Inventory updated successfully.", { icon: "success"});
            setTimeout(function(){ window.location.reload() }, 2000);
        }).catch(error => {
            if(error.response){
                var errorObj = error.response.data;
                swal("Error Code: " + errorObj.error.code +"\nError Message: " + errorObj.error.message, { icon: "error"});
            }else{
                swal({text: "Unable to connect to the edge-api service" , icon: "error"});
            }
        })
        this.setState({readOnly: !this.state.readOnly})
    }

    render() {
        return (
            <CenterDiv>
                <div class="jumbotron jumbotron-fluid">
                    <div class="container">
                        <form>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label style={{'float': 'left'}}>Item Name</label>
                                <input onChange={this.handleOnChange} type="text" name="item" value={this.state.item} class="form-control" id="item" maxLength="256" disabled={this.state.readOnly}/>
                            </div>
                            <div class="form-group col-md-6">
                                <label style={{'float': 'left'}}>Price</label>
                                <input onChange={this.handleIntegerOnChange} type="text" name="price" value={this.state.price}class="form-control" id="price" disabled={this.state.readOnly} maxLength="10"/>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label style={{'float': 'left'}}>Description</label>
                                <input onChange={this.handleOnChange} type="text" name="description" value={this.state.description} class="form-control" maxLength="256" id="description" disabled={this.state.readOnly}/>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                            { this.state.readOnly &&
                                <image onChange={this.handleOnChange} type="file" name="image" class="form-control-file" id="image" disabled={this.state.readOnly}/>
                            }
                            { !this.state.readOnly &&
                                <div>
                                    <label style={{'float': 'left'}}>Upload an Image</label>
                                    <input onChange={this.handleOnChange} type="file" name="image" class="form-control-file" id="image" disabled={this.state.readOnly}/>
                                </div>
                            }
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                            { this.state.readOnly &&
                                <button style={{'float': 'left'}} onClick={this.onClickHandler} type="submit" class="btn btn-primary">Edit</button>
                            }
                            { !this.state.readOnly &&
                                <div style={{'float': 'left'}}>
                                    <button onClick={this.onSubmitHandler} type="submit" class="btn btn-primary">Save</button>
                                    <button style={{"marginLeft":"20px"}}onClick={this.onCancelHandler} type="cancel" class="btn btn-primary">Cancel</button>
                                </div>
                            }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </CenterDiv>
        )
    }
}

export default Iteminfo;