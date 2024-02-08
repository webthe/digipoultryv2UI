import React, { useEffect, useState, useRef } from "react";
import * as axiosInstance from '../utils/axiosinstace';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
import { useForm } from "react-hook-form";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { useLoading, Bars } from '@agney/react-loading';

const TestDevice = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });

    const [showLoader, setShowloader] = useState(false);

    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
    });
    const [farmers, setFarmers] = useState([]);
    const getFarmersList = async () => {
        try {
            const response = await axiosInstance.getListofFarmers_admin()
            setFarmers(response.list)
        } catch (err) {
            console.log(err.message);
        }
    }
    const [devices, setDevices] = useState([]);
    const getDevicesList = async (farmerID) => {

        try {
            const response = await axiosInstance.getDevices(farmerID)
            JSON.stringify(response);
            setDevices(response.list);
        } catch (err) {
            console.log(err.message);
        }
    }
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [showValues, setShowValues] = useState(false);
    
    const [sensorData, setSensorData] = useState({

    });
    const onSubmit = async (data, e) => {
        e.preventDefault();
        //alert(JSON.stringify(data))
        setShowloader(true);
        try {
            //f(data.type == undefined) {
            data.type = 'deviceTest';
            // /}

            // alert(JSON.stringify(data))
            const response = await axiosInstance.callibrations(data)
            console.log(data)
            setShowloader(false);
            setShowResults(true);
            
            setShowValues(response.status)
            setResultMessage({
                error: !response.status, message: response.message
            });
            if (response.data != undefined) {
                setSensorData(response.data)
            }
            e.target.reset();
        } catch (err) {
            console.log(err);
            setShowValues(false);
            setShowloader(false)
            setShowResults(true)
            setResultMessage({
                error: true, message: err.response.data.message
            });
            //console.log(err.response.data.message);
        }
    }
    const onFarmerChange = (e) => {
        //alert(e.target.value)
        getDevicesList(e.target.value);
        setShowValues(false);
        setShowResults(false)
    }
    useEffect(() => {
        getFarmersList();
        if (getRole() == Role.Farmer) {
            getDevicesList('any');
        }
    }, []);
    return (
        <div className="batchOperations">
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Select Farmer</label>
                                    <select class="form-control" name="farmer"
                                        {...register("farmerID", {
                                            required: "Please select farmer",
                                            onChange: (e) => { onFarmerChange(e) }
                                        })}
                                    >
                                        <option value="">-Select-</option>
                                        {farmers.map(item => (
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
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Select Device</label>
                                    <select class="form-control" name="device"
                                        {...register('deviceID', { required: 'Please select device' })}>

                                        <option value="">-Select-</option>
                                        {devices.map(item => (
                                            <option
                                                key={item.imeiNumber}
                                                value={item.imeiNumber}
                                            >
                                                {item.imeiNumber}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.deviceID && <span className="err-msg">{errors.deviceID.message}</span>}
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-2 form-group">
                                <input
                                    style={{width: '100%'}}
                                    disabled={showLoader}
                                    type="submit" value="Test" class="btn btn-primary" />
                            </div>
                            <div className="col-md-4">
                                {showLoader ?
                                    <div>
                                        <section  {...containerProps} style={{ "margin-top": "0px", color: '#ccc', float: 'left' }}>
                                            {indicatorEl}
                                        </section>
                                        
                                    </div>
                                    : ""
                                }
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-8'>
                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                            </div>
                        </div>
                        {
                            showValues?
                            <div className="row">
                                <div className="col-md-12">
                            
                                        <ul>
                                            <li><strong>Signla Strength:</strong> {sensorData.SigStrength} dBM</li>
                                            <li><strong>Temp: </strong> {sensorData.Temperature} &deg;C</li>
                                            <li><strong>Ammonia: </strong>{sensorData.Ammonia} ppm</li>
                                            <li><strong>Co2: </strong>{sensorData.CO2} ppm</li>
                                        
                                        </ul>
                                    
                                </div>
                            </div>
                            :<></>
                        }
                       
                    </form>
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
export default TestDevice;