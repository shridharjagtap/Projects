import React, { Component } from 'react';
import styled from 'styled-components'
import ItemList from './ItemList'
import axios from 'axios';
import swal from "sweetalert";

export const CenterDiv=styled.div`
    position: absolute;
    width: 60%;
    top: 20%;
    bottom: 0;
    left: 20%;
    right: 0;
`
export const Label=styled.label`
    colour: white;
    margin: auto;
    paddingTop: 15px;
    font-size: 1.6em;
    font-style: italic;
`

class ShopBridge extends Component {
    constructor(){
        super()
        this.state = {item: '',
                      price: '',
                      description: '',
                      image: '',
                      addItem: false,
                      updateItem: false,
                      itemList: []
                    }
        this.onClickHandler = this.onClickHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
        this.onUpdateHandler = this.onUpdateHandler.bind(this)
        this.parentStateCallBack = this.parentStateCallBack.bind(this)
        this.handleIntegerOnChange = this.handleIntegerOnChange.bind(this)
    }

    componentDidMount(){
        axios.get("http://localhost:8888/api/v1/inventory")
            .then( res =>{
                let inventoryData = res.data['data']
                this.setState({itemList: inventoryData})
                console.log(res.data['data'])
            }).catch(error => {
                if(error.response){
                    var errorObj = error.response.data;
                    swal("Error Code: " + errorObj.error.code +"\nError Message: " + errorObj.error.message, { icon: "error"});
                }else{
                    swal({text: "Unable to connect to the shopBridge api service" , icon: "error"});
                }
            })           
    }

    onUpdateHandler(){
        console.log("updated succcefully")
    }

    onClickHandler(){
        this.setState({addItem : !this.state.addItem})
    }

    parentStateCallBack(){
        this.setState({updateItem: !this.state.updateItem})
    }

    onSubmitHandler(event){
        event.preventDefault()
        let jsonData = {
            item: this.state.item,
            price: this.state.price,
            description: this.state.description,
            image: this.state.image 
        }

        axios.put("http://localhost:8888/api/v1/inventory", jsonData)
        .then( res =>{
            swal("Inventory added successfully.", { icon: "success"});
            setTimeout(function(){ window.location.reload() }, 2000);
        }).catch(error => {
            if(error.response){
                var errorObj = error.response.data;
                swal("Error Code: " + errorObj.error.code +"\nError Message: " + errorObj.error.message, { icon: "error"});
            }else{
                swal({text: "Unable to connect to the edge-api service" , icon: "error"});
            }
        }) 
        
        this.setState({
            item: "",
            price: '',
            description: "",
            image: "",
            addItem: false
        })
    }

    handleOnChange(event){
        this.setState({[event.target.name]: event.target.value});
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


    render(){
        return (
            <CenterDiv>
                <div class="jumbotron jumbotron-fluid">
                    <div class="container">
                        <div class="page-header" style={{"paddingLeft": "15px", "background":"black", "color": "white", "fontFamily": "verdana", "marginTop": "10px"}}>
                            <Label>ShopBridge</Label>
                            <button onClick={this.onClickHandler} style={{"color": "black", "float":"right", "margin": "7px 7px"}}>Add Item</button>  
                        </div>
                        { this.state.addItem &&
                            <form>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label style={{'float': 'left'}}>Item Name</label>
                                        <input onChange={this.handleOnChange} type="text" name="item" value={this.state.item} class="form-control" id="item" maxLength="256"/>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label style={{'float': 'left'}} >Price</label>
                                        <input onChange={this.handleIntegerOnChange} type="text" name="price" value={this.state.price}class="form-control" id="price" maxLength="10"/>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label style={{'float': 'left'}} >Description</label>
                                        <input onChange={this.handleOnChange} type="text" name="description" value={this.state.description} class="form-control" id="description" maxLength="256"/>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label style={{'float': 'left'}}>Upload an Image</label>
                                        <input onChange={this.handleOnChange} type="file" name="image" value={this.state.image} class="form-control-file" id="image"/>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-12">
                                        <div style={{'float': 'left'}}>
                                        <button onClick={this.onSubmitHandler} type="submit" class="btn btn-primary">Add</button>
                                        <button style={{"marginLeft":"20px"}}onClick={this.onClickHandler} type="cancel" class="btn btn-primary">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        }
                        { (!this.state.addItem && this.state.itemList.length > 0) &&
                            <div>           
                                <table class="table w-auto overflow-auto">
                                    <tbody>
                                        <tr>
                                            <td><strong>#</strong></td>
                                            <td><strong>Item</strong></td>
                                            <td><strong>Price(Rs)</strong></td>
                                        </tr>
                                        { this.state.itemList.map((itemInfo, index) => {
                                            let jsonData = {"primaryKey": itemInfo.id,
                                                            "itemNumber": index + 1,
                                                            "itemName": itemInfo.item,
                                                            "itemPrice": itemInfo.price,
                                                            "itemDescription": itemInfo.desciption,
                                                            "image": itemInfo.image,
                                                            }
                                            return(
                                                <ItemList parentCallBack={this.parentStateCallBack} data={jsonData} />
                                            )   
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>             
                </div>                         
            </CenterDiv>
        )
    }
} 

export default ShopBridge;