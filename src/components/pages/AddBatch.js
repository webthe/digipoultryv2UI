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
import { getRole } from '../utils/common';
import * as axiosInstance from '../utils/axiosinstace';
const BatchMaster = (props) => {
    let show = props.showState;
    function handleChange() {
        props.onChange(false);
    }
    // const { register, handleSubmit, errors, control, formState } = useForm({
    //     mode: 'onChange'
    // });
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [headersobj] = useState(headers());
    const [selectedDate, setSelectedDate] = useState(null);
    const [farmData, setFarmData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const onSubmit = async(data, e) => {
        e.preventDefault();
        data.startDate = moment(selectedDate).format('YYYY-MM-DD');
        try {
            const response = await axiosInstance.addBatch(data)
            console.log(response.message);
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
                //console.log(err.response.data.message);
        }
        // axios.post(env.produrl + '/batchMaster', data, { headers: headersobj })
        //     .then(res => {
        //         console.log(res.data.message);
        //         setShowResults(true);
        //         setResultMessage({
        //             error: false, message: res.data.message
        //         });

        //         e.target.reset();
        //     }).catch((err) => {
        //         console.log(err)
        //         setShowResults(true)
        //         setResultMessage({
        //             error: true, message: err.response.data.message
        //         });
        //         console.log(err.response.data.message);
        //     });
    }
    const [farmers, setFarmers] = useState([]);
    const listoffarms = useRef();
    const listofDevices = useRef();
    listoffarms.current = async(farmer) => {
        //alert("hi "+farmer);
        try {
            const response = await axiosInstance.getListofFarms(farmer)
            setFarmData(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl + '/misc/listoffarms/' + farmer, { headers: headersobj })
        //     .then(res => {
        //         console.log(res);
        //         setFarmData(res.data.list)
        //     }).catch((err) => {
        //         console.log(err);
        //     });
    }
    listofDevices.current = async(farmer) => {
        try {
            const response = await axiosInstance.getListofAssignedDevices(farmer)
            setDeviceList(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl + '/assigndevices/listofavailabledevices/' + farmer + '/true', { headers: headersobj })
        //     .then(res => {
        //         console.log(res);
        //         setDeviceList(res.data.list)
        //     }).catch((err) => {
        //         console.log(err);
        //     });
    }
    const onFarmerChange = (e) => {
        //alert('hi')
        listoffarms.current(e.target.value);
        listofDevices.current(e.target.value);
    }
    const [deviceList, setDeviceList] = useState([]);
    const listoffarmers = useRef();
    listoffarmers.current = async() => {
        try {
            const response = await axiosInstance.getListofFarmers_admin()
            setFarmers(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl + '/misc/listoffarmers', { headers: headersobj })
        //     .then(res => {
        //         setFarmers(res.data.list);
        //         console.log(res.data.list)
        //     }).catch((err) => {
        //         setFarmers([])
        //         console.log(err.message);
        //     });
    }
    const listoftemplates = useRef();
    listoftemplates.current = async() => {
        try {
            const response = await axiosInstance.getListofTemplates()
            setTempData(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl + '/misc/listoftemplates', { headers: headersobj })
        //     .then(res => {
        //         console.log(res);
        //         setTempData(res.data.list)
        //     }).catch((err) => {

        //         console.log(err);
        //     });
    }
    useEffect(() => {
        if (getRole() === Role.Admin) {
            listoffarmers.current();
        }
        if (getRole() === Role.Farmer) {
            listoffarms.current('farmer');
            listofDevices.current('farmer');
        }
        listoftemplates.current();

    }, [setResultMessage, headersobj]);
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Add Batch</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='col-md-8'>
                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label htmlFor>Batch Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Batch Name"
                                                name="farmName"
                                                {...register("batchName", {
                                                    required: "Please enter batch name",
                                                    minLength: { value: 3, message: 'Name is too short' },
                                                    maxLength: { value: 20, message: 'Too Long for a Name' }
                                                })}
                                            />
                                            {errors.batchName && <span className="err-msg">{errors.batchName.message}</span>}
                                        </div>
                                    </div>

                                    {getRole() === Role.Admin ?
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Select Farmer</label>
                                                <select class="form-control" name="farmer"
                                                    {...register("farmer", {
                                                        required: "Please select farmer",
                                                        onChange: (e) => { onFarmerChange(e) }
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
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label htmlFor>Select Barn</label>
                                            <select class="form-control" name="farmID"
                                                {...register('farmID', {
                                                    required: 'Please select farm'

                                                })}
                                            >
                                                <option value=''>-Select-</option>

                                                {farmData.map(item => (
                                                    <option
                                                        key={item.farmID}
                                                        value={item.farmID}
                                                    >
                                                        {item.farmName}
                                                    </option>
                                                ))}

                                            </select>
                                            {errors.farmID && <span className="err-msg">{errors.farmID.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor>Assign Device</label>
                                            <select class="form-control" name="imeiNumber"
                                                {...register('imeiNumber', {
                                                    required: 'Please select device'

                                                })}
                                            >
                                                <option value=''>-Select Device-</option>

                                                {deviceList.map(item => (
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
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor>Select Template</label>
                                            <select class="form-control" name="templateID"
                                                {...register('templateID', {
                                                    required: 'Please select template'

                                                })}
                                            >
                                                <option value=''>-Select-</option>

                                                {tempData.map(item => (
                                                    <option
                                                        key={item.templateID}
                                                        value={item.templateID}
                                                    >
                                                        {item.templateName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.templateID && <span className="err-msg">{errors.templateID.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Select Start Date</label>
                                            <Datepicker
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                placeholderText="Start Date"
                                                minDate={new Date()}
                                                dateFormat="dd-MMM-yyyy"
                                                name="startDate"
                                                className="form-control"
                                            >
                                            </Datepicker>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <input type="submit" value="Save" class="btn btn-primary newBtn" />
                                        <input type="reset" value="Reset" class="btn btn-secondary newBtn" />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6' style={{paddingLeft: 20}}>
                               
                                <h5>BATCH CREATION INSTRUCTIONS</h5>
                                <p>Once you place the device in the farm, you will need to create a Batch to start tracking the house conditions, record & track operational data such as feed, mortality, bird-weight and so on.</p>
                                <ul className='ul-align'>
                                    <li>The name of your Batch must be <strong>unique</strong> across all users, who use the iPoultry system.</li>
                                    <li>If another user has already created a Batch using the name that you are trying to use now, the system will throw an error.</li>
                                    <li>Once you have entered the Batch name, select the Barn in which you wish to run this Batch in the drop-down of <strong style={{color: '#0654d1'}}>Select Barn</strong>.</li>
                                    <li>Now select the device you have placed in the selected barn from the drop-down under <strong style={{color: '#0654d1'}}>Assign Device</strong>.
                                        <ul>
                                            <li><strong>NOTE:</strong>  only the devices that are free and not assigned to any Batch will appear in the drop-down. If you are unable to find a specific device, please check if there is any running Batch using that device.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>Select the template – there are preset templates for major bird-types such as Ross and Cobb.</li>
                                    <li>Select the date on which you are starting the Batch or bringing in the Day Old Chicks (DOC).
                                        <ul>
                                            <li><strong>NOTE:</strong> You will only be able to select present day or a future date. To create a Batch for a past date, please contact iPoultry Support.
</li>
                                        </ul>
                                    </li>
                                    <li>Once the Batch is created successfully, please proceed to Batch History to start a batch. Start the batch on the day the DOC arrive.</li>
                                </ul>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        </div>
        // <div>
        //     <Modal show={show} >
        //         <Modal.Header>
        //             <Modal.Title>
        //             <FontAwesomeIcon icon={faPlus} />
        //                 &nbsp; Add Batch</Modal.Title>
        //         </Modal.Header>
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             <Modal.Body>

        //                    <div className="row">
        //                        <div className="col-md-12">
        //                             <div className="form-group">
        //                                 <label htmlFor>Batch Name</label>
        //                                 <input type="text" className="form-control"  placeholder="Enter Batch Name"
        //                                 name="batchName" ref={register(
        //                                     { required: "Batch Name Required",
        //                                         minLength: {value: 3, message: 'Name is too short'},
        //                                         maxLength: {value: 20, message: 'Too Long for a Name'}
        //                                     }
        //                                     )} />
        //                                 {errors.batchName && <span className="err-msg">{errors.batchName.message}</span>}
        //                             </div> 
        //                        </div>
        //                        {getRole()===Role.Admin ?
        //                        <div className="col-md-12">
        //                             <div className="form-group">
        //                                     <label>Select Farmer</label>
        //                                     <select class="form-control" name="farmer" onChange={onFarmerChange}
        //                                     ref={register ({
        //                                         required: 'Please select Farmer'

        //                                     })}
        //                                     >
        //                                         <option value="">-Select-</option>
        //                                         {farmers.map(item => (
        //                                                 <option
        //                                                 key={item.userName}
        //                                                 value={item.userName}
        //                                                 >
        //                                                 {item.farmerName}
        //                                                 </option>
        //                                             ))}
        //                                     </select>
        //                                     {errors.farmer && <span className="err-msg">{errors.farmer.message}</span>}
        //                             </div> 
        //                        </div>
        //                         : ""}
        //                        <div className="col-md-12">
        //                             <div className="form-group">
        //                                 <label htmlFor>Select Barn</label>
        //                                 <select class="form-control" name="farmID" 
        //                                 ref={register ({
        //                                     required: 'Select Farm'

        //                                 })} 
        //                                 >
        //                                     <option value=''>-Select-</option>

        //                                        {farmData.map(item => (
        //                                         <option
        //                                           key={item.farmID}
        //                                           value={item.farmID}
        //                                         >
        //                                           {item.farmName}
        //                                         </option>
        //                                       ))}

        //                                 </select>
        //                             </div> 
        //                        </div>
        //                        <div className="col-md-12">
        //                             <div className="form-group">
        //                                 <label htmlFor>Assign Device</label>
        //                                 <select class="form-control" name="imeiNumber" 
        //                                 ref={register ({
        //                                     required: 'Select Device'

        //                                 })} 
        //                                 >
        //                                     <option value=''>-Select-</option>

        //                                        {deviceList.map(item => (
        //                                         <option
        //                                           key={item.deviceID}
        //                                           value={item.deviceID}
        //                                         >
        //                                           {item.deviceID}
        //                                         </option>
        //                                       ))}

        //                                 </select>
        //                             </div> 
        //                        </div>
        //                        <div className="col-md-6">
        //                             <div className="form-group">
        //                                 <label htmlFor>Select Template</label>
        //                                 <select class="form-control" name="templateID" 
        //                                 ref={register ({
        //                                     required: 'Select Template'

        //                                 })} 
        //                                 >
        //                                     <option value=''>-Select-</option>

        //                                    {tempData.map(item => (
        //                                         <option
        //                                         key={item.templateID}
        //                                         value={item.templateID}
        //                                         >
        //                                         {item.templateName}
        //                                         </option>
        //                                     ))}
        //                                 </select>
        //                             </div> 
        //                        </div>

        //                        <div className="col-md-6">
        //                             <div className="form-group">
        //                                 <label>Select Start Date</label>
        //                                <Datepicker 
        //                                     selected={selectedDate} 
        //                                     onChange = {(date)=>setSelectedDate(date)}
        //                                     placeholderText = "Start Date" 
        //                                     minDate={new Date()}
        //                                     dateFormat="dd-MMM-yyyy"
        //                                     name="startDate"
        //                                     className = "form-control"
        //                                     >
        //                               </Datepicker>
        //                             </div> 
        //                        </div>
        //                    </div>
        //                    { showResults ? <Results key={Math.random()} message={resultMessage.message} error = {resultMessage.error}  /> : null }
        //             </Modal.Body>
        //         <Modal.Footer>
        //             <input type="submit"  disabled={!formState.isValid}  value="Save" class="btn btn-primary" />
        //             {/* <Button variant="primary" onClick= {handleChange}>Close</Button> */}
        //             <Button variant="secondary" onClick= {handleChange}>Close</Button>
        //         </Modal.Footer>
        //         </form>
        //     </Modal>
        // </div>

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
export default BatchMaster;