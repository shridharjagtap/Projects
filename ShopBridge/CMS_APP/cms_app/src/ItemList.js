import React, { Component } from 'react';
import { Card, CardTitle, CardText, Slider } from 'react-md';
import styled from 'styled-components'
import itemListDataService, { firebaseDB }  from './itemlist.service'
import axios from 'axios'
import swal from "sweetalert";

const style = { maxWidth: 320 };
export const ItemBox = styled.fieldset`
    border: 4em;
    width: 100px;
    height: 100px;
    border-color: green;
`

const ItemList = (props) => {
    const inventoryDetails = props.data

    const onClickRedirectHandler = () => {                
        window.location.href = "./item-info?id=" + inventoryDetails.primaryKey
    }

    const onClickDeleteHandler = () => {
        swal({text: "Are you sure you want to delete this inventory?",
              buttons: ['No', 'Yes'],
              dangerMode: true
        })
        .then((isConfirm) => {
            if (isConfirm) {
                axios.delete("http://localhost:8888/api/v1/inventory/" + inventoryDetails.primaryKey)
                    .then( res =>{
                        swal("Inventory deleted successfully.", { icon: "success"});
                        setTimeout(function(){ window.location.reload() }, 2000);
                    }).catch(error => {
                        if(error.response){
                            var errorObj = error.response.data;
                            swal("Error Code: " + errorObj.error.code +"\nError Message: " + errorObj.error.message, { icon: "error"});
                        }else{
                            swal({text: "Unable to connect to the shopBridge service" , icon: "error"});
                        }
                    })
            }    
        })
    }
     
    return (                
            <tr id={inventoryDetails.primaryKey} class="table-info">
            <td>{inventoryDetails.itemNumber}</td>
            <td onClick={onClickRedirectHandler}>{inventoryDetails.itemName}</td>
            <td>{inventoryDetails.itemPrice}</td>
            <td><button onClick={onClickDeleteHandler}>Remove</button></td>
            </tr>
            )
}

export default ItemList;