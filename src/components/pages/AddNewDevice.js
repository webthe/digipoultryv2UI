import { useEffect, useState } from "react";
import {useForm } from "react-hook-form";
import React  from "react";
import axios from 'axios';
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Modal, Button} from 'react-bootstrap';
import CloseBatch  from './CloseBatch';
import UpdateDevice  from './UpdateDevice';
import {env} from './const';
import { headers } from '../utils/common';
import { useHistory, Link, withRouter } from 'react-router-dom';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
const AddNewDevice = (props) => {
   const [headersobj] = useState(headers());
    function handleClose(){
       props.onChange (false);
       reset()
    }
   const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
       mode: 'onChange'
   });
   const [showResults, setShowResults] = useState(false)
   const [resultMessage, setResultMessage] = useState({});
   const [farmers, setFarmers] = useState([]);
   const onSubmit = (data, e) => {
        e.preventDefault();
        // alert(JSON.stringify(data));
        axios.post(env.produrl + '/mydevices/addnew', data, { headers: headersobj })
            .then(res => {
                //alert(res.data.status);
                setShowResults(true);
                setResultMessage({
                    error: res.data.status, message: res.data.message
                });
                e.target.reset();
            }).catch((err) => {
                console.log(err)
                setShowResults(true)
                setResultMessage({
                    error: true, message: err.response.data.message
                });
                console.log(err.response.data.message);
       });
    }
   useEffect(() => {
        if (getRole() === Role.Admin) {
            axios.get(env.produrl + '/misc/listoffarmers', { headers: headersobj })
                .then(res => {
                    setFarmers(res.data.list);
                    console.log(res.data.list)
                }).catch((err) => {
                    setFarmers([])
                    console.log(err.message);
                });
        }
    }, []);
   return(
       <div>
           <Modal show={props.show}>
               <Modal.Header>
                   <Modal.Title>Add New Device</Modal.Title>
               </Modal.Header>
               <Modal.Body>
               <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='col-md-12'>
                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='row'>
                                    {getRole() === Role.Admin ?
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Select Farmer</label>
                                                <select class="form-control" name="farmer"
                                                    {...register("farmer", {
                                                        required: "Please select Farmer",

                                                    })}
                                                >
                                                    <option value="">-Select-</option>
                                                    {farmers.map(item => (
                                                        <option
                                                            key={item.userName}
                                                            value={item.userName}
                                                        >
                                                            {item.farmerName}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.farmer && <span className="err-msg">{errors.farmer.message}</span>}
                                            </div>
                                        </div>
                                        : ""}
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor>Device ID (IMEI Number)</label>
                                            <input type="text" className="form-control" placeholder="Enter IMEI Number"
                                                name="imeinumber"
                                                {...register("imeinumber", {
                                                    required: "Please enter IMEI Number/DeviceID",
                                                    minLength: { value: 15, message: 'Minimum Length is 15' },
                                                    maxLength: { value: 20, message: 'Maximum Length is 20' }
                                                })}
                                            />
                                            {errors.imeinumber && <span className="err-msg">{errors.imeinumber.message}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row' style={{marginTop:20}}>
                            <div className='col-md-12'>
                                <input type="submit" value="Save" class="btn btn-primary btn-sm" /> &nbsp;&nbsp;
                                <button onClick={()=>handleClose()} type="button" class="btn btn-dark btn-sm">Close</button> 
                            </div>
                        </div>
                    </form>
               </Modal.Body>
               {/* <Modal.Footer>
                    <input type="submit" class="btn btn-sm btn-primary" value={'Add'} />
                    <button onClick={()=>handleClose()} type="button" class="btn btn-sm btn-dark">Close</button> 
               </Modal.Footer> */}
           </Modal>
       </div>  
   );
}
const Results = (props) => {
    let error, classes;
    if (props.error === true) {
        error = 'Success';
        classes = 'alert alert-success alert-dismissible fade show'
    } else {
        error = 'Error!';
        classes = 'alert alert-danger alert-dismissible fade show'
    }
    return (
        <div className="results">
            <div className={classes}>
                <strong>{error}</strong> {props.message}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
        </div>
    );
}
export default AddNewDevice;