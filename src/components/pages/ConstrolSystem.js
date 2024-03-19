import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import { env } from './const';
import { headers } from '../utils/common';
import { getRole, getUserName, controls } from '../utils/common';
import { useLoading, Bars } from '@agney/react-loading';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useLocation } from 'react-router-dom';
import * as axioInstance from '../utils/axiosinstace';
import $ from 'jquery';
import 'select2';
import { Tune } from "@material-ui/icons";
const ControlSystems = (props) => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
    });
    const location = useLocation();

    const [role] = useState(getRole())
    const [data, setData] = useState([])
    const [headersobj] = useState(headers());
    const [farmData, setFarmData] = useState([]);
    
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        reset,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();
    const [showResults, setShowResults] = useState(false);
    const [resultMessage, setResultMessage] = useState({});
    const [showloader, setShowloader] = useState(false);

    const onSubmit = async (data) => {
        try{
            const response = await axioInstance.controlsystem(data);
                // console.log(res.data.message);
                setShowResults(true);
                setShowloader(false);
                
                if(response.status) {
                    
                    setResultMessage({
                        error: false, message: response.message
                    });
                } else {
                    setResultMessage({
                        error: true, message: response.message
                    });
                }
                
        } catch (err) {
            setShowResults(true);
            setResultMessage({
                error: true, message: err.response.data.message
            });
            setShowloader(false);
        }
        
    };

    const automatedMode = watch('automatedMode'); // Watch the automatedMode to conditionally render fields
    // Generate time options
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = `${hour % 12 === 0 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
                options.push(<option key={time} value={time}>{displayTime}</option>);
            }
        }
        return options;
    };
    const initialFormState = {
        selectFarm: '',
        manualMode: '',
        automatedMode: '', // Ensure this is set to hide conditional fields
        startTime: '',
        endTime: '',
        onTemperature: '',
        offTemperature: '',
        runTime: '',
        pauseTime: '',
      };
    
    // Reset the form to initial state
    const handleReset = () => {
        reset(initialFormState);
        $('#selectFarm').val('').trigger('change');
    };
    const getFarms = async()=>{
        try {
            const response = await axioInstance.getListofFarms(getUserName());
            setFarmData(response.list)
        } catch (err) {
            console.log(err.message);
        }
    }
    //const [addStatus, setAddStatus] = useState(false);
    const [showRun, setShowRun] = useState(false);
    const [schedulerStatus, setSchedulerStatus] = useState('');
    const [selectedFarm, setSelectedFarm] = useState('');

    const getControlSystemData = async(farmID)=>{
        setShowResults(false);
        setSelectedFarm(farmID);
        try {
            const response = await axioInstance.getControlSystemData(farmID);
            if(response.list.length >0) {
                setShowRun(true);
                setValue('automatedMode', response.list[0].automationMode, {
                    shouldTouch: true,
                    shouldDirty: true,
                })
                alert(response.list[0].status);
                setSchedulerStatus(response.list[0].status);
                reset({
                    selectFarm: response.list[0].farmID,
                    manualMode: response.list[0].manualMode,
                    automatedMode: response.list[0].automationMode, 
                    startTime: response.list[0].startTime,
                    endTime: response.list[0].endTime,
                    onTemperature: response.list[0].onTemp,
                    offTemperature: response.list[0].offTemp,
                    runTime: response.list[0].runTime,
                    pauseTime: response.list[0].pauseTime,
                }) 
            } else {
                reset(initialFormState);
                setValue('automatedMode', '', {
                    shouldTouch: true,
                    shouldDirty: true,
                })
            }
        } catch (err) {
            console.log(err.message);
        }
    }
   
    const updateSchedulerwithStatus = async (status)=>{
        alert(selectedFarm+ "----"+ status);
        setShowResults(false);
        try {
            const response = await axioInstance.updateCSStatus({
                farmID: selectedFarm,
                status: status
            });
            setShowResults(true);
            setShowloader(false);
            setSchedulerStatus(status)
            if(response.status) {
                
                setResultMessage({
                    error: false, message: response.message
                });
            } else {
                setResultMessage({
                    error: true, message: response.message
                });
            }
            
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
         getFarms();
         $(document).ready(function() {
            $('#selectFarm').select2();
            $('#selectFarm').on('change', function(e) {
              // When the select2 field changes, update react-hook-form
              //setValue('selectFarm', e.target.value);
              setValue('selectFarm', e.target.value, { shouldValidate: true }); // Automatically triggers validation
              getControlSystemData(e.target.value);
              trigger('selectFarm'); // Manually trigger validation for 'selectFarm'
            });
          });
      
          // Cleanup function to remove the event listener
          return () => {
            $('#selectFarm').off('change');
          };
    }, [reset]);
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Fans Scheduling</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="farmID" className="form-label">Select Farm:</label>
                                    <select
                                    id="selectFarm" 
                                    {...register('selectFarm', { required: true })} className="form-control form-control-sm">
                                        <option value="">-Select-</option>
                                        {farmData.map(item => (
                                                <option
                                                  key={item.farmID}
                                                  value={item.farmID}
                                                >
                                                  {item.farmName}
                                                </option>
                                              ))}
                                    </select>
                                    {errors.selectFarm && <div className="err-msg">Selecting a farm is required.</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="form-label">Manual Mode: &nbsp; &nbsp; &nbsp;</label>
                                    <div className="form-check form-check-inline" style={{ marginTop: 10 }}>
                                        <input className="form-check-input" type="radio" {...register('manualMode', { required: true })} id="manualModeOn" value="on" />
                                        <label className="form-check-label" htmlFor="manualModeOn">On</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{ marginTop: 10 }}>
                                        <input className="form-check-input" type="radio" {...register('manualMode', { required: true })} id="manualModeOff" value="off" />
                                        <label className="form-check-label" htmlFor="manualModeOff">Off</label>
                                    </div>
                                    {errors.manualMode && <div className="err-msg">Selecting a manual mode is required.</div>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="automatedMode" className="form-label">Automated Mode:</label>
                                    <select {...register('automatedMode', { required: true })} className="form-control form-control-sm">
                                        <option value="">-Select-</option>
                                        <option value="Threshold">Threshold</option>
                                        <option value="Timer">Timer</option>
                                    </select>
                                    {errors.automatedMode && <div className="err-msg">Selecting an automated mode is required.</div>}
                                </div>
                            </div>
                        </div>
                        {
                            automatedMode !== ''?
                            <div className="row" >
                                <div className="col-md-4" style={{marginBottom: 10, padding: 5, 
                                    borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd', background: '#f1f1f1'}}>
                                    <strong>Selected Mode: </strong> {automatedMode}
                                </div>
                            </div>: <></>
                        }
                        {automatedMode === 'Threshold' && (
                            <>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label htmlFor="startTime" className="form-label">Start Time:</label>
                                        <select {...register('startTime', { required: 'Start Time is required' })} className="form-control form-control-sm">
                                            <option value="">-Select-</option>
                                            {generateTimeOptions()}
                                        </select>
                                        {errors.startTime && <div className="err-msg">Start time is required.</div>}
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="endTime" className="form-label">End Time:</label>
                                        <select
                                            {...register('endTime', { required: "End time is required" })}
                                            className={`form-control form-control-sm`}
                                        >
                                            <option value="">-Select-</option>
                                            {generateTimeOptions()}
                                        </select>
                                        {errors.endTime && <div className="err-msg">End time is required.</div>}
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: 20}}>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="onTemperature" className="form-label">On Temperature (°C):</label>
                                            <input type="number"
                                             {...register('onTemperature', 
                                             { required: 'Required',  
                                                 min: { value: 1, message: 'Should not be less than 0' },
                                                 max: { value: 100, message: 'Should not be less than 100' }
                                                })
                                            } 
                                            className="form-control form-control-sm" />
                                            {errors.onTemperature && <div className="err-msg">On Temperature must be between 0 and 100.</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="offTemperature" className="form-label">Off Temperature (°C):</label>
                                            <input type="number" 
                                            
                                            {...register('offTemperature', 
                                                { required: 'Required',  
                                                    min: { value: 1, message: 'Should not be less than 0' },
                                                    max: { value: 100, message: 'Should not be less than 100' }
                                                })
                                            } className="form-control form-control-sm" />
                                            {errors.offTemperature && <div className="err-msg">Off Temperature must be between 0 and 100.</div>}
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                        {automatedMode === 'Timer' && (
                            <>
                                <div className="row">
                                    <div className="col-md-2">
                                        <label htmlFor="startTime" className="form-label">Start Time:</label>
                                        <select {...register('startTime', { required: 'Start Time is required' })} className="form-control form-control-sm">
                                            <option value="">-Select-</option>
                                            {generateTimeOptions()}
                                        </select>
                                        {errors.startTime && <div className="err-msg">Start time is required.</div>}
                                    </div>
                                    <div className="col-md-2">
                                        <label htmlFor="endTime" className="form-label">End Time:</label>
                                        <select
                                            {...register('endTime', { required: "End time is required" })}
                                            className={`form-control form-control-sm`}
                                        >
                                            <option value="">-Select-</option>
                                            {generateTimeOptions()}
                                        </select>
                                        {errors.endTime && <div className="err-msg">End time is required.</div>}
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: 20}}>
                                    
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="runTime" className="form-label">Run Time:</label>
                                            <input type="number" 
                                            {...register("runTime", {
                                                required: "Enter Value",
                                                min: { value: 1, message: 'Should not be less than 0' },
                                                
                                            })}
                                           className="form-control form-control-sm" />
                                            {errors.runTime && <div className="err-msg"></div>}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="pauseTime" className="form-label">Pause Time:</label>
                                            <input type="number"  
                                            {...register("pauseTime", {
                                                required: "Enter Value",
                                                min: { value: 1, message: 'Should not be less than 0' },
                                                
                                            })}
                                            className="form-control form-control-sm" />
                                            {errors.pauseTime && <div className="err-msg"></div>}
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                        <div className='row'>
                            <div className='col-md-12'>
                                <input type="submit" value="Save & Run" class="btn btn-primary newBtn" />
                                {
                                    !showRun?<button type="reset" onClick={handleReset}  value="Reset" class="btn btn-secondary newBtn">Reset</button>
                                    :
                                    (schedulerStatus =='run' ? 
                                        <button type="submit" onClick={()=>{updateSchedulerwithStatus('stop')}} value="Stop" class="btn btn-secondary newBtn">Stop</button>
                                        :
                                        <button type="submit" onClick={()=>{updateSchedulerwithStatus('run')}} value="run" class="btn btn-secondary newBtn">Run</button>
                                    )
                                }
                                
                            </div>
                        </div>

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
export default ControlSystems;