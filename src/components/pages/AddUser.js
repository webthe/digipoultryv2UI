import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import { getUserName, headers } from '../utils/common';
import { env } from './const';
import { Multiselect } from 'multiselect-react-dropdown';
import { getRole } from '../utils/common';
import { Role } from '../utils/role';
import * as axiosInstance from '../utils/axiosinstace';
import { useLoading, Bars } from '@agney/react-loading';
const AddUser = () => {
    // const {register, handleSubmit, errors, control, formState} = useForm ({
    //     mode:'onChange'
    // });
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
      const [formData, setFormData] = useState({});
    const { register, handleSubmit, watch, formState: { errors },setValue  } = useForm({
        mode: 'onChange',
        
    });

    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm({
        mode: 'onChange'
    });
    const [role, setRole] = useState(getRole());
    const [headersobj] = useState(headers());
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showResults2, setShowResults2] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [showLoader, setShowloader] = useState(false);
    
    const [action, setAction] = useState('Insert');
    const fetchUser = (data, e) => {
        axios.get(env.produrl + '/fetchuser/' + data.userID, { headers: headersobj })
            .then(res => {
                setShowResults2(false);
                console.log(res.data.list)
                setFormData(res.data.list);
                setSelectedFarms(res.data.list.farms);
            }).catch((err) => {
                console.log(err)
                setShowResults2(true)
                setResultMessage({
                    error: true, message: err.response.data.message
                });
                console.log(err.response.data.message);
            });
    }
    const [selectedFarms, setSelectedFarms] = useState([]);
    const onSelect = (selectedList, selectedItem) => {
        setSelectedFarms(selectedList);
        if (selectedFarms.length > 0) {
            setFarmError('')
        }
    }

    const onRemove = (selectedList, removedItem) => {
        setSelectedFarms(selectedList);
        if (selectedFarms.length > 0) {
            setFarmError('')
        }
    }
    const [farmError, setFarmError] = useState('')
    const onSubmit = async(data, e) => {
        e.preventDefault();
        
        //console.log(data);
        data.action = action;
        if (role === Role.Farmer || role === Role.Admin) {
            data.farms = selectedFarms;
        } else {
            data.farms = [];
        }
        data.farms = selectedFarms;
        if (data.roleID === Role.Worker || role === Role.Farmer) {
            if (selectedFarms.length === 0) {
                setFarmError('Atlest one farm is required');
                return;
            } else {
                setFarmError('');
            }
        }
        data.barnSensors = true;
        // alert(JSON.stringify(data))
        try {
            setShowloader(true);
        //     alert(JSON.stringify(data))
        // return;
            const response = await axiosInstance.addUser(data);
                // console.log(res.data.message);
                setShowResults(true);
                setShowloader(false);
                
                if(response.status) {
                    setFormData({});
                    setSelectedFarms([]);
                    setFarmers([]);
                    setFarms([]);
                    e.target.reset();
                    document.getElementById("userID").removeAttribute("readonly", "readonly");
                    setResultMessage({
                        error: false, message: response.message
                    });
                    fetchFarms.current(getUserName());
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
        // axios.post(env.produrl + '/addUser', data, { headers: headersobj })
        //     .then(res => {
        //         // console.log(res.data.message);
        //         setShowResults(true);
        //         setResultMessage({
        //             error: false, message: res.data.message
        //         });
        //         setFormData({});
        //         setSelectedFarms([]);
        //         setFarmers([]);
        //         setFarms([]);
        //         e.target.reset();
        //         document.getElementById("userID").removeAttribute("readonly", "readonly");
        //         fetchFarms.current(getUserName());
        //     }).catch((err) => {
        //         console.log(err)
        //         setShowResults(true)
        //         setResultMessage({
        //             error: true, message: err.response.data.message
        //         });
        //         console.log(err.response.data.message);
        //     });
    }

    const onCountrychange = (e, countryID) => {
        let _id = '';
        if (e === undefined || e === null || e === '') {
            _id = countryID;
        } else {
            _id = e.target.value;
        }
        axios.get(env.produrl + '/geoLocations/states/' + _id
        ).then(res => {
            setStates(res.data.list)

        }).catch((err) => {
            console.log(err);
        });
    }
    const onStatechange = (e, stateID) => {
        let _id = '';
        if (e === undefined || e === null || e === '') {
            _id = stateID;
        } else {
            _id = e.target.value;
        }

        axios.get(env.produrl + '/geoLocations/cities/' + _id
        ).then(res => {
            setCities(res.data.list)

        }).catch((err) => {
            console.log(err);
        });
    }
    const [farms, setFarms] = useState([]);
    const [roles, setRoles] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const fetchFarms = useRef()
    const onFarmerChange = (e) => {
        let selectedFarmer = '';
        if (e === '') {
            selectedFarmer = formData.farmowner;
        } else {
            selectedFarmer = e.target.value;
        }
        fetchFarms.current(selectedFarmer);

    }
    const[_selectedRole , setSelectedRole] = useState('');
    const onRolechange = (e) => {
        setShowResults(false);
        let selectedRole = '';
        if (e === '') {
            selectedRole = formData.roleID;
        } else {
            selectedRole = e.target.value;
            setSelectedRole(e.target.value)
        }
        if (selectedRole === Role.Worker || selectedRole === Role.Digiviewer) {
            axios.get(env.produrl + '/misc/listoffarmers', { headers: headersobj })
                .then(res => {
                    //alert(res.data.list)
                    setFarmers(res.data.list);
                    console.log(res.data.list)
                }).catch((err) => {
                    setFarmers([])
                    console.log(err.message);
                });
        } else {
            setFarmers([]);
        }
    }
    fetchFarms.current = (famerUserName) => {

        axios.get(env.produrl + '/misc/listoffarms/' + famerUserName, { headers: headersobj })
            .then(res => {
                let farmDropDown = [];
                res.data.list.forEach((item) => {
                    farmDropDown.push({
                        name: item.farmName,
                        id: item.farmID
                    })
                })
                setFarms(farmDropDown)
            }).catch((err) => {
                console.log(err.message);
            });
    }
    useEffect(() => {
        axios.get(env.produrl + '/geoLocations/countries')
            .then(res => {
                setCountries(res.data.list)
            }).catch((err) => {
                console.log(err.message);
            });
        if (role === Role.Admin) {
            axios.get(env.produrl + '/misc/roles', { headers: headersobj })
                .then(res => {
                    setRoles(res.data.list)
                }).catch((err) => {
                    setRoles([]);
                    console.log(err.message);
                });
        }
        if (role === Role.Farmer) {
            fetchFarms.current(getUserName());
        }

        if (Object.keys(formData).length > 0) {
            let e = ""
            onCountrychange(e, formData.country);
            onStatechange(e, formData.state);
            onRolechange(e);
            onFarmerChange(e);
            //onFarmerChange(e, "hhh")
            setAction('Update');
            document.getElementById("userID").setAttribute("readonly", "readonly");

            setValue('name', formData.farmerName)
            setValue('userName', formData.userName)
            setValue('orgName', formData.org)
            setValue('emailID', formData.emailID)
            setValue('phoneNumber', formData.phoneNumber)
            setValue('addressLine1', formData.addressLine1)
            setValue('addressLine2', formData.addressLine2)
            setValue('country', formData.country)
            setValue('state', formData.state);
            setValue('city', formData.city);
            setValue('status', formData.status);
            setValue('waterMeter', formData.watermeter==0?false:true);
            setValue('controls', formData.controls==0?false:true);
            setValue('role', formData.roleID)
        }
    }, [formData, fetchFarms]);
    //  const [optionsArray] = useState( [
    //     { key: "au", label: "Australia" },
    //     { key: "ca", label: "Canada" },
    //     { key: "us", label: "USA" },
    //     { key: "pl", label: "Poland" },
    //     { key: "es", label: "Spain" },
    //     { key: "fr", label: "France" },
    //   ]);
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Add / Modify User</h2>
                </div>
            </div>
            <div className="col-12">
                <div className="card collapsed-card">
                    <div className="card-header">
                        <p className="card-title font12">Please Enter User ID/ Phone number to modify User</p>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-plus" />
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-10" style={{ display: 'none' }}>
                        <form onSubmit={handleSubmit2(fetchUser)}>
                            <div>
                                {showResults2 ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error2} /> : null}
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label htmlFor>User Name or Phone Number</label>
                                        <input type="text" className="form-control form-control-sm" id placeholder="Enter User Name / Phone Number"
                                            name="userID"  {...register2('userID',
                                                {
                                                    required: "User Name or Phone is Required"
                                                }
                                            )} />
                                        {errors2.userID && <span className="err-msg">{errors2.userID.message}</span>}
                                    </div>
                                </div>
                                <div className="col-md-4 mt10">
                                    <div class="form-group">

                                        <button type="submit" value="Submit" class="btn btn-sm btn-secondary">Fetch</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
                <div className="card">
                    <div class="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                           
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label htmlFor>Name</label>
                                        <input type="text" className="form-control form-control-sm" id placeholder="Enter Name"
                                            name="name" defaultValue={Object.keys(formData).length > 0 ? formData.farmerName : ""} {...register('name',
                                                {
                                                    required: "Name is Required",
                                                    minLength: { value: 3, message: 'Name is too short' },
                                                    maxLength: { value: 50, message: 'Too Long for a Name' }
                                                }
                                            )} />
                                        {errors.name && <span className="err-msg">{errors.name.message}</span>}
                                    </div>
                                </div>
                                {role === Role.Admin ?
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Select Role</label>
                                            <select class="form-control form-control-sm" name="role"
                                                {...register('role', {
                                                    required: 'Please select Role',
                                                    
                                                })}
                                                onChange={onRolechange}
                                            >
                                                <option value="">-Select-</option>
                                                {roles.map(item => (
                                                    <option
                                                        key={item.roleID}
                                                        value={item.roleID}
                                                        selected={formData.roleID === "" + item.roleID ? true : false}
                                                    >
                                                        {item.roleName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.roleID && <span className="err-msg">{errors.roleID.message}</span>}
                                        </div>
                                    </div>
                                    : ""}

                                {farmers.length > 0 ?

                                    <div className="col-md-4">

                                        <div className="form-group">
                                            <label>Select Farmer </label>
                                            {/* <DropdownMultiselect options={optionsArray} name="countries" /> */}
                                            <select class="form-control form-control-sm" name="farmer"
                                                {...register('farmer', {
                                                    required: 'Please select Farmer',
                                                   
                                                })}
                                                onChange={onFarmerChange}
                                            >
                                                <option value="">-Select-</option>
                                                {farmers.map(item => (
                                                    <option
                                                        key={item.userName}
                                                        value={item.userName}
                                                        selected={formData.farmowner === "" + item.userName ? true : false}
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
                            {role === Role.Farmer || farmers.length > 0 ?
                                <div className="row">
                                    <div className="col-md-4">
                                        <div class="form-group">
                                            <label htmlFor>Select Farms</label>
                                            <Multiselect
                                                options={farms} // Options to display in the dropdown
                                                selectedValues={selectedFarms} // Preselected value to persist in dropdown
                                                onSelect={onSelect} // Function will trigger on select event
                                                onRemove={onRemove} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                                //className='form-control form-control-sm'
                                                name="farms"
                                        
                                            />
                                            {<span className="err-msg">{farmError}</span>}
                                        </div>
                                    </div>
                                </div>
                                : ""}
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label htmlFor>User Name</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.userName : ""}
                                            className="form-control form-control-sm" placeholder="Enter User Name"
                                            name="userName" id="userID"
                                            {...register('userName',
                                                {
                                                    required: "User Name is Required",
                                                    minLength: { value: 3, message: 'User Name is too short' },
                                                    maxLength: { value: 20, message: 'Too Long for a User Name' },
                                                    pattern: { value: /[^ ]+$/i, message: 'No Spaces are allowed' }
                                                }
                                            )} />
                                        {errors.userName && <span className="err-msg">{errors.userName.message}</span>}
                                    </div>
                                </div>
                                
                                {role === Role.Admin && farmers.length ==0?
                                    <div class="col-md-4"> 
                                        <div class="form-group">
                                            <label htmlFor>Organization Name</label>
                                            <input type="text" className="form-control form-control-sm" placeholder="Enter Organization Name"
                                                name="orgName" defaultValue={Object.keys(formData).length > 0 ? formData.org : ""}
                                                {...register('orgName',
                                                    {
                                                        //required: "Organization is Required",
                                                        minLength: { value: 3, message: 'Organization Name is too short' },
                                                        maxLength: { value: 50, message: 'Organization Name is too long' }
                                                    }
                                                )} />
                                            {errors.orgName && <span className="err-msg">{errors.orgName.message}</span>}
                                        </div>
                                    </div>
                                    :
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label htmlFor>Password</label>
                                        <input type="password" className="form-control form-control-sm" placeholder="Enter Password"
                                            name="password" defaultValue={Object.keys(formData).length > 0 ? "defaultPassword" : ""}
                                            {...register('password',
                                                {
                                                    required: "Password is Required",
                                                    minLength: { value: 5, message: 'Password is too short' }
                                                }
                                            )} />
                                        {errors.password && <span className="err-msg">{errors.password.message}</span>}
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="row">
                                {
                                    role == Role.Admin?
                                
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor>Email</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.emailID : ""}
                                            className="form-control form-control-sm" id placeholder="Enter Email Address"
                                            name="emailID" {...register('emailID',
                                                { 
                                                  required: _selectedRole==Role.Farmer?"Email is Required":false,
                                                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  message: 'Invalid Email Address'}
                                                }
                                            )} />
                                        {errors.emailID && <span className="err-msg">{errors.emailID.message}</span>}
                                    </div>
                                </div>
                                : 
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor>Email</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.emailID : ""}
                                            className="form-control form-control-sm" id placeholder="Enter Email Address"
                                            name="emailID" {...register('emailID',
                                                { 
                                                  pattern: { value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/i, message: 'Invalid Email Address'}
                                                }
                                            )} />
                                        {errors.emailID && <span className="err-msg">{errors.emailID.message}</span>}
                                    </div>
                                </div>
                                }
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor>Phone Number</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.phoneNumber : ""}
                                            className="form-control form-control-sm" id placeholder="Enter Phone Number"
                                            name="phoneNumber" {...register('phoneNumber',
                                                {
                                                    required: _selectedRole==Role.Farmer?"Phone Number is Required":false,
                                                    pattern: { value: /^[0-9]+$/i, message: 'Invalid Phone Number' },
                                                    minLength: { value: 10, message: 'Invalid Phone Number' },
                                                    maxLength: { value: 11, message: 'Invalid Phone Number' }
                                                }
                                            )} />
                                        {errors.phoneNumber && <span className="err-msg">{errors.phoneNumber.message}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor>Address Line 1</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.addressLine1 : ""}
                                            className="form-control form-control-sm" id placeholder="Enter Address Line 1"
                                            name="addressLine1" {...register('addressLine1',
                                                {
                                                    required: _selectedRole==Role.Farmer?"Address Line 1 is Required":false,
                                                    minLength: { value: 5, message: 'Minimum 5 chars is required' },
                                                    maxLength: { value: 100, message: 'Maximum of 30 chars is allowed' }
                                                }
                                            )} />
                                        {errors.addressLine1 && <span className="err-msg">{errors.addressLine1.message}</span>}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor>Address Line 2</label>

                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.addressLine2 : ""}
                                            className="form-control form-control-sm" id placeholder="Enter Address Line 2"
                                            name="addressLine2" {...register('addressLine2',
                                                {
                                                    //required: "Address Line 2 is Required",
                                                    minLength: { value: 5, message: 'Minimum 5 chars is required' },
                                                    maxLength: { value: 100, message: 'Maximum of 30 chars is allowed' }
                                                }
                                            )} />
                                        {errors.addressLine2 && <span className="err-msg">{errors.addressLine2.message}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor>Country</label>
                                        <select name="country"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.country : ""}
                                            id="country" className="form-control form-control-sm"
                                            {...register('country',
                                                {
                                                    required: _selectedRole==Role.Farmer?"Country is Required":false,
                                                    onChange: (e) => { onCountrychange(e) }
                                                }
                                            )}
                                        >
                                            <option value="">-Select-</option>
                                            {countries.map(item => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                    selected={formData.country === "" + item.id ? true : false}
                                                >
                                                    {item.name}
                                                </option>

                                            ))}
                                        </select>
                                        {errors.country && <span className="err-msg">{errors.country.message}</span>}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor>State/Region</label>
                                        <select name="state" className="form-control form-control-sm"
                                            {...register('state',
                                                {
                                                    required: _selectedRole==Role.Farmer?"State is Required":false,
                                                    onChange: (e) => { onStatechange(e) }
                                                }
                                            )}
                                        >
                                            <option value="">-Select-</option>
                                            {states.map(item => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                    selected={formData.state === "" + item.id ? true : false}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.state && <span className="err-msg">{errors.state.message}</span>}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor>City</label>
                                        <input type="text"
                                            defaultValue={Object.keys(formData).length > 0 ? formData.city : ""}
                                            className="form-control form-control-sm" id placeholder="Enter City"
                                            name="city" {...register('city',
                                                {
                                                    //required: "City is Required"
                                                    required: _selectedRole==Role.Farmer?"City is Required":false,

                                                }
                                            )} />

                                        {errors.city && <span className="err-msg">{errors.city.message}</span>}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor>Status</label>

                                        <select name="status" className="form-control form-control-sm"

                                            {...register('status',
                                                {
                                                    required: "Status is Required"
                                                }
                                            )}
                                        >
                                            {/* <option value="">-Select-</option> */}
                                            <option value="ACTIVE" selected={formData.status === "ACTIVE" ? true : false}>ACTIVE</option>
                                            <option value="INACTIVE" selected={formData.status === "INACTIVE" ? true : false}>INACTIVE</option>

                                        </select>
                                        {errors.status && <span className="err-msg">{errors.status.message}</span>}
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            {
                                role == Role.Admin && _selectedRole === Role.Farmer?
                            
                            <div className="row">
                                <div className="col-md-8">
                                    <p>**Please choose the IOT Sensors</p>
                                    <div class="form-group">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" disabled checked='true'
                                                            {...register('barnSensors')}
                                                    />
                                                    <label class="form-check-label">Barn Senses (Default)</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" 
                                                            {...register('waterMeter')}
                                                           
                                                    />
                                                    <label class="form-check-label">Water Meter</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox"
                                                        {...register('controls')}
                                                    />
                                                    <label class="form-check-label">Control Systems</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :<></>}
                            <div className='row'>
                                <div className="col-md-1">
                                    <div class="form-group">
                                        <input type="submit" value="Submit" class="btn btn-primary" />
                                    </div>
                                    
                                </div>
                                <div className='col-md-1'>
                                        { showLoader?
                                            <section {...containerProps} style = {{"margin-top": "0px", color: '#ccc'}}>
                                                {indicatorEl} 
                                            </section> :""
                                        }
                                    </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* <ErrorModal key= {Math.random()} onChange={handleChange} estatus={errorModal.estatus} show={errorModal.show} message={errorModal.message}></ErrorModal> */}
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
export default AddUser;