import React, { useEffect, useState, useRef } from "react";
import * as axiosInstance from '../utils/axiosinstace';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
import { useForm } from "react-hook-form";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { useLoading, Bars } from '@agney/react-loading';
import TestDevice from "./TestDevice";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
const SensorCalibration = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            type: 'ammonia' // Set default value for the sensor type
        }
    });
    const { register: register2, handleSubmit: handleSubmit2,
        watch: watch2, formState: { errors: errors2 } } = useForm({
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
            setShowResults(false);
            setSensorData({})
        } catch (err) {
            console.log(err.message);
        }
    }
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const onDevicetest = async (data, e) => {
        alert(JSON.stringify(data))
    }
   
    const [sensorData, setSensorData] = useState({

    });
    // const [sensorStatus, setSensorStatus] = useState(false);
    const onSubmit = async (data, e) => {
        e.preventDefault();
        //alert(JSON.stringify(data))
        setShowloader(true);
        try {
            //setSelectedType(data.type)
            // alert(JSON.stringify(data))
            const response = await axiosInstance.callibrations(data)

            setShowloader(false);
            setShowResults(true);
            setResultMessage({
                error: !response.status, message: response.message
            });
            if (response.data != undefined) {
                setSensorData(response.data)
            }
            e.target.reset();
        } catch (err) {
            console.log(err)
            setShowloader(false)
            setShowResults(true)
            setResultMessage({
                error: true, message: err.response.data.message
            });
            //console.log(err.response.data.message);
        }
    }
    const onFarmerChange = (e) => {
        getDevicesList(e.target.value);
        setShowResults(false);
        setSensorData({})

    }
    const [showValues, setShowValues] = useState(false);
    const selectedType = watch('type', 'ammonia');
    useEffect(() => {
        getFarmersList();
        if (getRole() == Role.Farmer) {
            getDevicesList('any');
        }
        //alert(selectedType)
    }, [selectedType]);
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Sensor Calibration</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <Tabs activeHeaderStyle={{ background: 'transparent' }}>
                        <Tab label="Callibration">
                            <div className="row">
                                <div className="col-md-5">
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        {/* <div className="spacer"></div> */}
                                        {getRole() === Role.Admin ?

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

                                            : ""}
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
                                        <div className="spacer"></div>
                                        <div class="form-group clearfix">
                                            <div class="form-group clearfix">
                                                <div class="icheck-primary d-inline">
                                                    <input
                                                        type="radio"
                                                        id="radioPrimary1"
                                                        name="type"
                                                        value="ammonia"
                                                       // onChange={handleSensorTypeChange}
                                                        //checked={selectedType === 'ammonia'}
                                                        {...register('type', { required: 'Please select sensor' })}
                                                    />
                                                    <label for="radioPrimary1">
                                                        Ammonia &nbsp;  &nbsp;  &nbsp;
                                                    </label>
                                                </div>
                                                <div class="icheck-primary d-inline">
                                                    <input
                                                        type="radio"
                                                        id="radioPrimary2"
                                                        name="type"
                                                        value="co2"
                                                        //onChange={handleSensorTypeChange}
                                                        //checked={selectedType === 'co2'}
                                                        {...register('type', { required: 'Please select sensor' })}
                                                    />
                                                    <label for="radioPrimary2">
                                                        Carbon Dioxide
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>{errors.type && <span className="err-msg">{errors.type.message}</span>}</div>
                                        <div className="spacer"></div>
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <input style={{ width: '100%' }}
                                                    disabled={showLoader}
                                                    type="submit" value="Calibrate" class="btn btn-primary" />
                                            </div>
                                            <div className="col-md-6">
                                                {showLoader ?
                                                    <div>
                                                        <section  {...containerProps} style={{ "margin-top": "0px", color: '#ccc', float: 'left' }}>
                                                            {indicatorEl}
                                                        </section>
                                                        <p>&nbsp; Please do not refresh or press back button</p>
                                                        {/* <div style={{ float: 'left' }}>
                                                            <p>Following are the possible reasons:</p>
                                                            <ul>
                                                                <li>Device is turned OFF.</li>
                                                                <li>Problem with physical sensor connection/ sensor offline.</li>
                                                                <li>Device has limited or no network connectivity.</li>
                                                            </ul>
                                                        </div> */}
                                                    </div>
                                                    : ""
                                                }
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-12'>
                                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                                            </div>
                                            {
                                                resultMessage?.error ?
                                                    <div>
                                                        <p>Following are the possible reasons:</p>
                                                        <ul>
                                                            <li>Device is turned OFF.</li>
                                                            <li>Problem with physical sensor connection/ sensor offline.</li>
                                                            <li>Device has limited or no network connectivity.</li>
                                                        </ul>
                                                    </div>
                                                    :
                                                    <></>
                                            }

                                        </div>
                                        {
                                            Object.keys(sensorData).length > 0 && selectedType == 'ammonia' ?
                                                <div className="row">
                                                    <div className="col-md-12">

                                                        <ul>
                                                            <li><strong>Time:</strong> {sensorData.TimeStamp}</li>
                                                            <li><strong>VRL: </strong> {sensorData.VRL} </li>
                                                            <li><strong>RS: </strong>{sensorData.RS}</li>
                                                            <li><strong>RO: </strong>{sensorData.CO2} RO</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                : <></>
                                        }

                                    </form>
                                </div>
                                {
                                    selectedType=='ammonia'?

                                
                                <div className="col-md-7">
                                    <h3 style={{ textTransform: 'none' }}>Info: Ammonia Sensor Calibration</h3>
                                    <Accordion>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    What is Sensor Calibration?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p>
                                                    Your sensor operates on the basis of reading current or voltage subject to change in state of a sensitive material used to make up the sensor. Each voltage measurement corresponds to a particular reading.
                                                </p>
                                                <p>For example 1.0 Volts = 100 ppm, 1.1 volts = 120 ppm and so on (values for illustrative purposes only).</p>
                                                <p>By calibrating the sensor, we are enabling the sensor to determine a starting point or 0 point, so to speak. This is done to measure the readings accurately.</p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    When should I calibrate my Ammonia sensor?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p>
                                                    Generally, it is a good practice to calibrate your sensor after use of 3 to 6 months – depending on the general ammonia levels of the deployed environment.
                                                </p>
                                                <p>However you can also calibrate your sensor as you see fit.</p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    How to calibrate Ammonia sensor?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p><strong>STEP 1:</strong> In case of new sensor or sensor that has not been operating for a long period of time (over 1 month), leave the sensor turned on for AT LEAST 36 hours in an Ammonia free environment.</p>
                                                <p>If sensor is in continuous use, just place it in an Ammonia free environment and turn the device ON.</p>
                                                <p><strong>STEP 2:</strong> Select the device (IMEI number) from the list, to which the Sensor is connected. </p>
                                                <p><strong>STEP 3:</strong> Click on <span style={{color: 'blue'}}>Calibrate</span> button. </p>
                                                <p><strong>STEP 4:</strong> Wait for System configuration and close.</p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    </Accordion>

                                </div>
                                :<></>}
                                {
                                    selectedType == 'co2'?
                                    <div className="col-md-7">
                                    <h3 style={{ textTransform: 'none' }}>Info: CO2 Sensor Calibration</h3>
                                    <Accordion>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    What is Sensor Calibration?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p>
                                                    Your sensor operates on the basis of reading current or voltage subject to change in state of a sensitive material used to make up the sensor. Each voltage measurement corresponds to a particular reading.
                                                </p>
                                                <p>For example 1.0 Volts = 100 ppm, 1.1 volts = 120 ppm and so on (values for illustrative purposes only).</p>
                                                <p>By calibrating the sensor, we are enabling the sensor to determine a starting point or 0 point, so to speak. This is done to measure the readings accurately.</p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    When should I calibrate my Cabron dioxide sensor?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p>
                                                Generally, it is a good practice to calibrate your sensor after use of 5 to 6 months. However, you can also calibrate your sensor as you see fit.

                                                </p>
                                                
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    How to calibrate Ammonia sensor?
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <p><strong>STEP 1:</strong> Place your device in a carbon dioxide neutral place, i.e at a place where the Carbon dioxide concentration is 400 PPM approximately. Leave it on for 30 minutes. Examples of such places are:</p>
                                                <p style={{fontStyle: 'italic'}}>Terraces or Rooftops, Balconies, Verandahs, Gardens or any such open spaces.
</p>
                                                <p>Note: <srtong>DO NOT</srtong> place the sensor at places of high CO2 concentrations. Examples include kitchens, conference or such closed rooms, smoking zones or any closed spaces with people and animals.
</p>
                                                <p><strong>STEP 2:</strong> Select the device (IMEI number) from the list, to which the Sensor is connected. </p>
                                                <p><strong>STEP 3:</strong> Click on <span style={{color: 'blue'}}>Calibrate</span> button. </p>
                                                <p><strong>STEP 4:</strong> Wait for System configuration and close.</p>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    </Accordion>

                                </div>
                                :<></>}
                            </div>
                        </Tab>
                        {
                            getRole() == Role.Admin ?
                                <Tab label="Test Device">
                                    <TestDevice></TestDevice>
                                </Tab>
                                : <></>
                        }

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
export default SensorCalibration;