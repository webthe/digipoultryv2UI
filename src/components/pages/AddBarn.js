import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Button } from 'react-bootstrap';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import axios from 'axios';
import { render } from '@testing-library/react';
import { env } from './const';
import { headers } from '../utils/common';
import { Role } from '../utils/role';
import { getRole, controls } from '../utils/common';
import * as axiosiInstance from '../utils/axiosinstace';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import ListofBarns from './ListofBarns';
const FarmMaster = (props) => {
    const [headersobj] = useState(headers());
    function handleChangeFarm() {
        props.onChange(false);
    }
    // const {register, handleSubmit, errors, control, formState} = useForm ({
    //     mode:'onChange'
    // });
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });

    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const onSubmit = async (data, e) => {
        e.preventDefault();
        try {
            const response = await axiosiInstance.addbarn(data);
            setShowResults(true);
            setResultMessage({
                error: false, message: response.message
            });
            e.target.reset();
        } catch (err) {
            console.log(err)
            setShowResults(true)
            setResultMessage({
                error: true, message: err.response.data.message
            });
        }
    }
    const [farmers, setFarmers] = useState([]);
    const [userOptions, setUserOptions] = useState({
        controls:0, watermeter:0
    });
    const onchangeHandler = async(e) =>{
        e.preventDefault();
        try {
            const response = await axiosiInstance.getUserOptions(e.target.value);
            // alert(JSON.stringify(response))
            if(response.status) {
                
                setUserOptions(response.list[0]);
            }
        } catch (err) {
            console.log(err)
        }
    }
    const getfarmers = async()=>{
        try {
            //const response = await apiInstance.getListofFarmers()
            if (getRole() === Role.Admin) {
                const response = await axiosiInstance.getListofFarmers_admin()
                setFarmers(response.list);
            }  
            
            if (getRole() === Role.Farmer) {
                const response = await axiosiInstance.getListofFarms('undefined');
                let farmDropDown = [];
                    response.list.forEach((item) => {
                        farmDropDown.push({
                            name: item.farmName,
                            id: item.farmID
                        })
                    })
            }
           
        } catch (err) {
            setFarmers([])
            //console.log(err.message);
        }
    }
    useEffect(() => {
       
        getfarmers();
    }, []);
    return (
        <div className="farmMaster">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Add Barn</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <Tabs activeHeaderStyle={{background:'transparent'}}>
                    <Tab label="Add New Barn">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='col-md-8'>
                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                            </div>
                        </div>
                        
                        <div className='row'>
                            <div className='col-md-5'>
                                    <div className='row'>
                                    {getRole() === Role.Admin ?
                                        <div className="col-md-10">
                                            <div className="form-group">
                                                <label>Select Farmer</label>
                                                <select class="form-control" name="farmer" 
                                                    {...register("farmer", {
                                                        required: "Please select Farmer",
                                                    })}
                                                    onChange={onchangeHandler}
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
                                        : <></>}
                                </div>
                                <div className="row">
                                    <div className="col-md-10">

                                        <div className="form-group">
                                            <label htmlFor>Barn Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Barn Name"
                                                name="farmName"
                                                {...register("farmName", {
                                                    required: "Please enter Farm Name",
                                                    minLength: { value: 3, message: 'Name is too short' },
                                                    maxLength: { value: 20, message: 'Too Long for a Name' }
                                                })}
                                            />
                                            {errors.farmName && <span className="err-msg">{errors.farmName.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                {
                                    (getRole()== Role.Admin && userOptions.controls == 1) ||  
                                     (getRole()== Role.Farmer && controls()==1)
                                ?
                                <div className="row">
                                    <div className="col-md-10">

                                        <div className="form-group">
                                            <label htmlFor>Number of Fans</label>
                                            <select class="form-control"
                                                name="fans"
                                                {...register("fans", {
                                                    required: "Please select number of Fans",
                                                   
                                                })}
                                            >
                                                <option value="">-Select-</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                            {errors.fans && <span className="err-msg">{errors.fans.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                :<></>}
                                {/* <div className='row'>
                                    {getRole() === Role.Admin ?
                                        <div className="col-md-10">
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
                                </div> */}
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label htmlFor>Available Networks</label>
                                            <input type="text" className="form-control" placeholder="Enter Network Name"
                                                name="network"
                                                {...register("network", {
                                                    //required: "Please enter Network Name",
                                                    minLength: { value: 3, message: 'Network name is too short' },
                                                    maxLength: { value: 30, message: 'Too Long for a Network name' }
                                                })}
                                            />
                                            {errors.network && <span className="err-msg">{errors.network.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <input type="submit" value="Save" class="btn btn-primary newBtn" />
                                        <input type="reset" value="Reset" class="btn btn-secondary newBtn" />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-7'>
                                <h5>BARN CREATION INSTRUCTIONS</h5>
                                <p>You must first create a Barn – your bird house before you can create a Batch and assign it to your Barn.</p>
                                <ul className='ul-align'>
                                    <li>The name of your Barn must be <strong>unique</strong> across all users, who use the iPoultry system.</li>
                                    <li>If another user has already created a barn using the name that you are trying to use now, the system will throw an error.</li>
                                    <li>If you have access to Exhaust Fans control system, you will see a drop-down selection to select the number of fans for the Barn. Please select the number of fans used in the barn. </li>
                                    <li>Enter the cell network that works good inside your barn. Examples can be: ‘Digi’, ‘Maxis’, ‘Digi and Maxis’ etc.</li>
                                    <li>Once you have filled/selected all above information, click on <strong style={{color: '#0654d1'}}>Save</strong>.</li>
                                    <li>Click <strong style={{color: '#0654d1'}}>Reset</strong> to clear all fields and start creating the Barn again. </li>
                                </ul>
                            </div>
                        </div>

                    </form>
                    </Tab>
                    <Tab label="List of Barns">
                        <ListofBarns></ListofBarns>
                    </Tab>
                </Tabs>
                </div>
            </div>

        </div>

    );
}
const Results = (props) => {
    let error, classes;
    if (props.error === false) {
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
export default FarmMaster;