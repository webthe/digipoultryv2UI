import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import axios from 'axios';
import { headers } from '../utils/common';
import {Modal, Button} from 'react-bootstrap';
import {env} from './const';
import moment from 'moment';
import Datepicker from 'react-datepicker';
const UpdateDevice = (props) => {
    const [headersobj] = useState(headers());
    
    // const { register, control, handleSubmit, reset, watch , errors, formState} = useForm({
    //     mode:'onChange'
    //   });
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
      const [showResults, setShowResults] = useState(false)
      const [resultMessage, setResultMessage] = useState({});
      const onSubmit = (data, e) => {
        e.preventDefault();
        let batchID = props.batchID;
        //alert(JSON.stringify(data))
        //console.log(data);
        
            axios.put(env.produrl+'/updatedevice/', null, {
                params: { batchID, imeiNumber: data.imeiNumber }
            })
            .then(res=>{
                 setShowResults(true);
                 setResultMessage({
                    error: false, message: res.data.message
                 });
                 e.target.reset();
            }).catch((err) =>{
                 console.log(err.response.data.message);
                 setShowResults(true);
                 setResultMessage({
                    error: true, message:err.response.data.message
                 });
            });
      }
      const handleChange = ()=>{
        props.onChange(false);
      }
    return (
        <div className="updateDevice">
            
            <Modal show={props.show}>
                <Modal.Header>
                    <Modal.Title>
                    {/* <FontAwesomeIcon icon={icon} color={iconColor} /> */}
                    Close Batch: <b>{props.batchName} sdfsfsf- {props.farmName}</b></Modal.Title>
                </Modal.Header>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor>Update Device</label>
                            <select class="form-control" name="imeiNumber" 
                                {...register("imeiNumber", {
                                required: "Please enter number of birds",
                                pattern: { value: /^[0-9]+$/i, message: 'Invalid Number'}
                            })}
                            
                            >
                                <option value=''>-Select-</option>
                                
                                    {props.deviceList.map(item => (
                                    <option
                                        key={item.deviceID}
                                        value={item.deviceID}
                                    >
                                        {item.deviceID}
                                    </option>
                                    ))}
                                
                            </select>
                            {errors.imeiNumber && <span className="err-msg">{errors.imeiNumber.message}</span>}
                        </div> 
                    </div>
                    { showResults ? <Results key={Math.random()} message={resultMessage.message} error = {resultMessage.error}  /> : null }
                    </Modal.Body>
                <Modal.Footer>
                    
                    {/* <input type="submit" value="Preview" className="btn btn-primary" /> */}
                    <button type="submit"  className="btn btn-primary">Update</button> 
                    <Button variant="secondary" onClick={handleChange}>Close</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
const Results = (props) =>{
    let error, classes;
    if(props.error === false) {
        error = 'Success';
        classes = 'alert alert-success alert-dismissible fade show'
    } else {
        error = 'Error!';
        classes = 'alert alert-danger alert-dismissible fade show'
    }
    return(
       <div className="results">
            <div className={classes}>
                <strong>{error}</strong> {props.message}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
       </div>
    );
}
export default UpdateDevice;
