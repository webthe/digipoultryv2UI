import React, { useEffect, useState, useContext } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import axios from 'axios';
import { headers } from '../utils/common';
import {env} from './const';
import { faList, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Modal, Button} from 'react-bootstrap';
import { NotificationContext } from '../context/context';
import { Role } from "../utils/role";
const AssignDevices = () => {
    //let today = moment().tz("Asia/Singapore").format("YYYY-MM-DD");
    
    //let today = moment().tz("Asia/Singapore").format("YYYY-MM-DD");
    const [deviceList, setDeviceList] = useState([{ deviceID: "" }])
    //const { name, setName } = useContext(NotificationContext);
    const [showDevice, setShowDevices] = useState(false);
    //const [farmerID, setFarmerID] = useState('');
    const onFarmerChange = (e)=>{
       const _farmerID = e.target.value;
        axios.get(env.produrl+'/assignDevices/listofdevices/'+_farmerID+'/false', { headers: headersobj})
             .then(res=>{
              // alert(JSON.stringify(res.data.list));
                if(res.data.list.length===0) {
                    reset({
                        deviceList: [{deviceID: ''}],
                        farmerID: _farmerID
                    })
                } else {
                    reset({
                        deviceList: res.data.list,
                        farmerID: _farmerID
                    })
                    
                }
                setShowDevices(true);
             }).catch((err) =>{
                  console.log(err.message);
                  alert(err.message)
             });
    }
    const [headersobj] = useState(headers());
    const [farmerList, setFarmersList] = useState([]);
    const [erroLogs, setErrorLogs] = useState([]);
    const onSubmit = (data, e) => {
        e.preventDefault();
        alert(JSON.stringify(data));
        axios.post(env.produrl+'/assigndevices/', data, { headers: headersobj}
        ).then(res=>{
                console.log(res.data);
                setErrorLogs(res.data.logs)
                setShowPopUp(true);
            }).catch((err) =>{
                console.log(err);
                alert(err.response.data.message);
                reset({
                    deviceList: deviceList,
                    
                })
        });
    }
      const { register, control, handleSubmit, reset, watch , formState: { errors } } = useForm({
        defaultValues: {
            deviceList: deviceList
        },
        mode:'onChange'
      });
      const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
          control,
          name: "deviceList"
        }
      );
    const addRow = () => {
        append({ deviceID: "" });
    }
    const [showPopUp, setShowPopUp] = useState(false);
    useEffect(() => {    
       
        axios.get(env.produrl+'/misc/listoffarmers/', { headers: headersobj})
             .then(res=>{
                setFarmersList(res.data.list);
                
             }).catch((err) =>{
                  console.log(err.message);
                  alert(err.message)
             });
     },[headersobj, deviceList]);
     const handleChange = (newValue)=>{
        setShowPopUp(newValue);
      }
    //   const onTest = ()=>{
    //     alert('Helllo')
    //   }
    return (
        <div className="assignDevices">
           <div className="row">
                <div className="col-md-12">
               
                <form  onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className="col-md-4">
                                <div className="form-group">
                                <label>Select Farmer</label>
                                    <select class="form-control" 
                                    name="farmerID" 
                                    onChange={onFarmerChange
                                    }
                                    // {...register ('farmerID',{
                                    //     required: 'Please select farmer'
                                        
                                    // })}
                                    >
                                        <option value="">-Select-</option>
                                        {farmerList.map(item => (
                                                <option
                                                  key={item.id}
                                                  value={item.id}
                                                >
                                                  {item.farmerName}
                                                </option>
                                              ))}
                                    </select>
                                    {errors.farmerID && <span className="err-msg">{errors.farmerID.message}</span>}
                                </div>
                            </div>
                          
                        </div>
                        
                        {showDevice? 
                         <div className="Devices">
                             <label>Enter/Modify Imei Numbers</label>
                         {fields.map((item, index) => {
                            return (
                               
                                    <div className="row" key={item.id}>
                                        <div className="col-md-6">
                                            <div className="form-group input-group">
                                            <input type="text"
                                                name={`deviceList[${index}].deviceID`}
                                                defaultValue={item.deviceID} // make sure to set up defaultValue
                                                {...register(`deviceList[${index}].deviceID`, {
                                                    required: 'Required',
                                                    //pattern: { value: /^[0-9]+$/i, message: 'Invalid Number'}
                                                })}
                                                className="form-control" placeholder="Enter Imei Number" />
                                                { errors.deviceList? errors.deviceList[index] && <span className="err-msg">
                                                {errors.deviceList[index].deviceID ? errors.deviceList[index].deviceID.message: ''}</span> : null }
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                           
                                            <ul className="buttonsUL">
                                                <li>
                                                    <button type="button" className="btn btn-danger" onClick={() =>{
                                                        if(fields.length>1) {
                                                            remove(index)
                                                        }
                                                    } }> - </button>
                                           
                                                </li>
                                                <li>
                                                {(fields.length===index+1 )? <button type="button" className="btn btn-secondary" onClick={addRow}>+</button> : ""}
                                                </li>
                                            </ul>
                                        </div>
                                       
                                    </div>
        
                            );
                            })}
                            <div className="row">
                                <div className="col-md-4">
                                    <button type="submit"  className="btn btn-primary">Save/Update</button>
                            
                                &nbsp;&nbsp;&nbsp;
                                <button type="button" className="btn btn-info"
                                        onClick={() =>
                                            reset({
                                                deviceList: deviceList
                                            })
                                        } >Undo changes
                                        </button>
                                </div>
                            </div>
                         </div>
                           : ""} 
                    </form>
                </div>
           </div>
           <PopUP erroLogs = {erroLogs} show={showPopUp} key={Math.random()} onChange={handleChange}></PopUP>
        </div>
    )
}
const PopUP = (props)=>{
    function handleChange(){
        props.onChange(false);
    }
    return(
        <div>
            <Modal show={props.show} >
                <Modal.Header>
                    <Modal.Title>
                    <FontAwesomeIcon icon={faList} />
                        &nbsp; Logs</Modal.Title>
                </Modal.Header>
               
                    <Modal.Body>
                        <table class="table table-bordered table-sm">
                            <tbody>
                                <tr>
                                    <td width='20%'><strong>Error Status</strong></td>
                                    <td><strong>Message</strong></td>
                                </tr>
                                {props.erroLogs.map(item => (
                                    <tr>
                                       
                                        <td align="center">{item.error === 'yes'?  <FontAwesomeIcon icon={faTimes} className="red"  />: <FontAwesomeIcon icon={faCheck} className="green" />}</td>
                                        <td>{item.message}</td>
                                    </tr>                
                                ))}
                               
                            </tbody>
                        </table>
                           
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick= {handleChange}>Close</Button>
                </Modal.Footer>
                
            </Modal>
        </div>
        
    );
}
export default AssignDevices;
