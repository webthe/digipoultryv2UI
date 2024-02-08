import React, { useEffect, useState} from 'react';
import {useForm, Controller} from "react-hook-form";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Modal, Button} from 'react-bootstrap';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import axios from 'axios';
import { render } from '@testing-library/react';
import {env} from './const';
import { headers } from '../utils/common';
import * as axiosInstance from '../utils/axiosinstace'
const DeactivateFarm = (props)=>{
    let show = props.showState;
    console.log(props)
    function handleChange(){
        props.onChange(false);
    }
    const {register, handleSubmit, errors, control, formState} = useForm ({
        mode:'onChange'
    });
    const [headersobj] = useState(headers());
  
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
   
    const onSubmit = async(data, e)=>{
        e.preventDefault();
        console.log(data)
        data.farmID = props.farm.farmID
        try {
            const response = await axiosInstance.farmAction(data);
            setShowResults(true);
            setResultMessage({
            error: false, message: response.message
            });
            e.target.reset();
        } catch (err) {
            setShowResults(true)
            setResultMessage({
                error: true, message: err.response.data.message
            });
            console.log(err.response.data.message);
        }
        // axios.post(env.produrl+'/farmaction', data, { headers: headersobj })
        //     .then(res=>{
        //         console.log(res.data.message);
        //          setShowResults(true);
        //          setResultMessage({
        //             error: false, message: res.data.message
        //          });
                 
        //          e.target.reset();
        //     }).catch((err) =>{
        //         console.log(err)
        //          setShowResults(true)
        //          setResultMessage({
        //              error: true, message: err.response.data.message
        //          });
        //          console.log(err.response.data.message);
        //     });
    }
    return(   
        <div>
            <Modal show={show} >
                <Modal.Header>
                    <Modal.Title>
                    <FontAwesomeIcon icon={faCogs} />
                        &nbsp; Farm Action - {props.farm.farmName} </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                       
                           <div className="row">
                               <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor>Select Status</label>
                                        <select class="form-control" name="status" 
                                        {...register ('status',{
                                            required: 'Select Status'
                                            
                                        })} 
                                        >
                                            <option value=''>-Select-</option>
                                            <option value='ACTIVE'>Activate</option>
                                            <option value='INACTIVE'>De-activate</option>
                                           
                                        </select>
                                    </div> 
                               </div>
                               
                               <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Reason</label>
                                        <textarea class="form-control" 
                                        name="reason"
                                        {...register ('reason',{
                                            required: 'Required',
                                            minLength: {value: 5, message: 'Minimum 5 chars is required'},
                                            maxLength: {value: 200, message: 'Maximum of 200 chars is allowed'}
                                        })} 
                                        rows="3"></textarea>
                                     </div> 
                               </div>
                           </div>
                           { showResults ? <Results key={Math.random()} message={resultMessage.message} error = {resultMessage.error}  /> : null }
                    </Modal.Body>
                <Modal.Footer>
                    <input type="submit"  disabled={!formState.isValid}  value="Submit" class="btn btn-primary" />
                    {/* <Button variant="primary" onClick= {handleChange}>Close</Button> */}
                    <Button variant="secondary" onClick= {handleChange}>Close</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </div>
        
    );
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
export default DeactivateFarm;