import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import 'react-datepicker/dist/react-datepicker.css'
import { headers } from '../utils/common';

import * as axiosInstance from '../utils/axiosinstace';
const DailyOperations = (props) => {
    const [headersobj] = useState(headers());
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const {
        register: register1,
        handleSubmit: handleSubmit1,
        watch: watch1,
        formState: { errors: errors1 },
    } = useForm({ mode: 'onChange' });
    
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        watch: watch2,
        formState: { errors: errors2 },
    } = useForm({ mode: 'onChange' });

    const {
        register: register3,
        handleSubmit: handleSubmit3,
        watch: watch3,
        formState: { errors: errors3 },
    } = useForm({ mode: 'onChange' });

    const validateEntries_mortality = () => {
        const mortality_male = watch3("mortality_male");
       
        const mortality_female = watch3("mortality_female");
        const male_culling = watch3("culling_male");
        const female_culling = watch3("culling_female");

        return (mortality_male && mortality_male.length > 0) || (mortality_female && mortality_female.length > 0
           || male_culling && male_culling.length > 0 || female_culling && female_culling.length > 0
        );
    };
    const validateEntries_weights = () => {
        const weight_male = watch2("weight_male");
        const weight_female = watch2("weight_female");
        let status = false;
        if((weight_male && weight_male.length > 0) || (weight_female && weight_female.length > 0)) {
            status = true;
        }
        return status;
    };

    const validateEntries_mortality_withoutSexing = () => {
        const mortality = watch3("mortality");
        const culling = watch3("culling");
        return (mortality && mortality.length > 0) || (culling && culling.length > 0
        );
    };

    const [sexingStatus, setSexingStatus] = useState(false);
    const [feed, setFeed] = useState({});
    const [chick, setChick] = useState({});
    const [mortality, setMortality] = useState({});
    const [dayFCR, setDayFCR] = useState('');
    const [dayFCRMale, setDayFCRMale] = useState('');
    const [dayFCRFemale, setDayFCRFemale] = useState('');
    const getAddedWeights = async()=>{
        try {
            const response = await axiosInstance.getDailyOperationsStatus(props.farm, props.date)
            setSexingStatus(response.list.sexing);
            setDayFCR(response.list.dayFCR);
            setDayFCRMale(response.list.dayFCRMale);
            setDayFCRFemale(response.list.dayFCRFemale)
            setFeed({
                feed: response.list.feed,
                feed_status: response.list.feed_status,
                feed_male: response.list.feed_male,
                feed_male_status: response.list.feed_male_status,
                feed_female: response.list.feed_female,
                feed_female_status: response.list.feed_male_status,
                editStatus: response.list.feed_status || response.list.feed_male_status? true:false
            })
            setChick({
                chickWeight: response.list.checkWeight,
                chick_status: response.list.chickWeight_status,
                chickWeight_male: response.list.chickWeight_male,
                chickWeight_male_status: response.list.chickWeight_male_status,
                chickWeight_female: response.list.chickWeight_female,
                chickWeight_female_status: response.list.chickWeight_female_status,
                editStatus: response.list.chickWeight_status || response.list.chickWeight_male_status? true:false
            })
            let mortality_obj = {
                mortality: response.list.mortality,
                mortality_status: response.list.mortality_status,
                mortality_male: response.list.mortality_male,
                mortality_male_status: response.list.mortality_male_status,
                mortality_female: response.list.mortality_female,
                mortality_female_status: response.list.mortality_female_status,
                culling_status: response.list.culling_status,
                culling:  response.list.culling,
                culling_male_status: response.list.culling_male_status,
                culling_male:  response.list.culling_male,
                culling_female_status: response.list.culling_female_status,
                culling_female:  response.list.culling_female,
                editStatus: response.list.mortality_status 
                || response.list.mortality_male_status
                || response.list.mortality_female_status
                || response.list.culling_male_status
                || response.list.culling_male_status
                ? true:false
            }
           
            setMortality(mortality_obj)
           
        } catch (err) {
            console.log(err);
        }
    }
    const _dataobj = (weight, type)=>{
        return {
            weight: weight,
            farmID: props.farm,
            date: props.date,
            type: type
        }
    }
    const [feedMessage, setFeedMessage] = useState({
        status: false,
        show: false,
        message: ''
    });

    const [weightMessage, setWeightMessage] = useState({
        status: false,
        show: false,
        message: ''
    });
    const [mortalityMessage, setMortalityMessage] = useState({
        status: false,
        show: false,
        message: ''
    });
    const onSubmit = async(data, e)=>{
        e.preventDefault();
        let dataobj = []
        
        let type='';
        if(data.feed !== undefined) {
            type = 'feed';
            const obj = _dataobj(data.feed, 'feed')
            dataobj.push(obj);
           
        } 
        if(data.weight !== undefined) {
            type = 'weight';
            
            //alert(JSON.stringify(data))
            if(sexingStatus) {
                const validations = validateEntries_weights();
                if(!validations) {
                    alert('**Please fill at least one field.')
                    return;
                }
               const male_obj = _dataobj(data.weight_male, 'chick_male')
               const female_obj = _dataobj(data.weight_female, 'chick_female')
               dataobj.push(male_obj);
               dataobj.push(female_obj);
            } else {
                const obj = _dataobj(data.weight, 'chick')
                dataobj.push(obj);
            }
        }
        if(data.mortality !== undefined) {
            type = 'mortality';
            
            
            if(sexingStatus) {

                const validations = validateEntries_mortality();
                if(!validations) {
                    alert('**Please fill at least one field.')
                    return;
                }
               
               const male_obj = _dataobj(data.mortality_male, 'mortality_male')
               const female_obj = _dataobj(data.mortality_female, 'mortality_female')
               const male_culling_obj = _dataobj(data.culling_male, 'culling_male');
               const female_culling_obj = _dataobj(data.culling_female, 'culling_female');
               dataobj.push(male_obj);
               dataobj.push(female_obj);
               dataobj.push(male_culling_obj);
               dataobj.push(female_culling_obj);
            } else {
                //alert(JSON.stringify(data))
                const validations = validateEntries_mortality_withoutSexing();
                
                if(!validations) {
                    alert('**Please fill at least one field.')
                    return;
                }
                
                const obj_mortality = _dataobj(data.mortality, 'mortality')
                const obj_culling = _dataobj(data.culling, 'culling')
                dataobj.push(obj_mortality);
                dataobj.push(obj_culling);
            }
        } 
            //alert(JSON.stringify(dataobj));
       
            const filteredData = dataobj.filter(obj => 
                obj.weight && 
                obj.weight !== "" &&
                obj.date && 
                obj.type &&
                obj.farmID &&
                obj.farmID !== ''
            );
           //alert(JSON.stringify(filteredData))
           try {
                const response = await axiosInstance.addDailyParams(filteredData);
                // alert(JSON.stringify(response))
                
                if(type == 'feed') {
                    setFeedMessage({
                        status: !response.status,
                        show: true,
                        message: response.message
                    })
                } else if(type == 'weight') {
                    setWeightMessage({
                        status: !response.status,
                        show: true,
                        message: response.message
                    })
                }else if(type == 'mortality') {
                    setMortalityMessage({
                        status: !response.status,
                        show: true,
                        message: response.message
                    })
                }
                getAddedWeights();
           } catch (err) {
                console.log(err);
                alert(err)
           }
    }
    useEffect(() => {
        getAddedWeights();
    }, []);
    return (
        <div id="dailyOperations">
            <div className='sexingStatusrow'>
               <div className='row' style={{marginBottom: 20}}>
                <div className='col-md-4'>
                        <strong>Selected Date: </strong> {props.date}
                </div>
                <div className='col-md-8' style={{textAlign: 'right'}}>
                        <strong>**Bird Sexing: </strong>
                        <span className='textHiglighter'>{sexingStatus? 'YES':'NO'}</span>
                        {sexingStatus?<span>(Please enter feed, weight and mortality for both male and female birds)</span>: <></>}
                        
                </div>
               </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <h5 className='weight_heading'>Add/Edit Feed (in KG) {(!feed.feed_status)? <span className='redcolor' style={{fontSize: 12}}><i>Not Entered for the day</i></span>
                    :
                    <span className='editButton' onClick={()=>{
                        setFeed({
                            ...feed,  
                            editStatus: !feed.editStatus, 
                          });
                    }}>
                         <i className='fa fa-edit'></i>
                    </span>
                    }</h5>
                    <form onSubmit={handleSubmit1(onSubmit)}>
                        <div className='row'>
                             <div className='col-md-12'>
                                <div className="form-group">
                                    <label>Feed</label>
                                    <input class="form-control form-control-sm" 
                                        placeholder='Enter Feed in KGs' id="inputsm" 
                                        type="number"
                                        defaultValue={feed.feed_status? feed.feed: ''}
                                        {...register1("feed", {
                                            required: "Please enter feed",
                                        })}
                                        disabled = {feed.editStatus}
                                    />
                                    {errors1.feed && <span className="err-msg">{errors1.feed.message}</span>}
                                </div>
                              </div>
                            
                            <div className='col-md-2'>
                                <div className="form-group">
                                    <input type="submit" disabled={feed.editStatus} class="btn btn-sm btn-secondary" value="Submit" />
                                </div>
                            </div>
                           
                        </div>
                        <div style={{marginTop: 15}}>
                            {
                                feedMessage.show? <Results key={'feed'} error={feedMessage.status} message={feedMessage.message}></Results>:<></>
                            }
                        </div>
                    </form>
                </div>
                <div className='col-md-4'>
                    <h5 className='weight_heading'>Add/Edit Chick Weight (in KG) {(!chick.chick_status && !sexingStatus) || (!chick.chickWeight_male && sexingStatus)? <span className='redcolor' style={{fontSize: 12}}><i>Not Entered for the day</i></span>
                     :
                     <span className='editButton' onClick={()=>{
                         setChick({
                             ...chick,  
                             editStatus: !chick.editStatus, 
                           });
                     }}>
                          <i className='fa fa-edit'></i>
                     </span>
                     }</h5>
                    <form onSubmit={handleSubmit2(onSubmit)}>
                        <div className='row'>
                            { sexingStatus ?<>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Male</label>       
                                    <input class="form-control form-control-sm" placeholder='add weight in KGs' 
                                        id="inputsm" type="text"
                                        disabled = {chick.editStatus}
                                        defaultValue={chick.chickWeight_male_status? chick.chickWeight_male: ''}
                                        {...register2("weight_male", {
                                            //required: "Enter weight for Male Birds",
                                            pattern: {
                                                value: /^[0-5](\.\d+)?$/,
                                                message: 'Invalid Number for weight',
                                              },
                                            //setValueAs: (value) => parseFloat(value),
                                        })}
                                    />
                                    {errors2.weight_male && <span className="err-msg">{errors2.weight_male.message}</span>}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Female</label>       
                                    <input class="form-control form-control-sm" 
                                    placeholder='add weight in KGs' id="inputsm" 
                                    type="text" 
                                    disabled = {chick.editStatus}
                                    defaultValue={chick.chickWeight_female_status? chick.chickWeight_female: ''}
                                    {...register2("weight_female", {
                                        //required: "Enter weight for Female Birds",
                                        pattern: {
                                            value: /^[0-5](\.\d+)?$/,
                                            message: 'Invalid Number for weight',
                                          },
                                    })}
                                    />
                                    {errors2.weight_female && <span className="err-msg">{errors2.weight_female.message}</span>}
                                </div>
                            </div>
                            </>
                            :
                                <>
                                    <div className='col-md-8'>
                                        <div className="form-group">
                                            <label>Chick Weight</label>
                                            <input class="form-control form-control-sm" 
                                            placeholder='Weight in KGs' id="inputsm" type="text" 
                                            defaultValue={chick.chick_status? chick.chickWeight: ''}
                                            {...register2("weight", {
                                                required: "Enter weight",
                                                pattern: {
                                                    value: /^[0-5](\.\d+)?$/,
                                                    message: 'Invalid Number for weight',
                                                  },
                                            })}
                                            disabled = {chick.editStatus}
                                            
                                            />
                                            {errors2.weight && <span className="err-msg">{errors2.weight.message}</span>}
                                        </div>
                                    </div>
                                </>
                            }
                            <div className='col-md-2'>
                                <div className="form-group">
                                    {!sexingStatus?<label>&nbsp;</label>:''}
                                    <input type="submit" disabled = {chick.editStatus} class="btn btn-sm btn-secondary" value="Submit" />
                                </div>
                            </div>
                           
                        </div>
                        <div style={{marginTop: 15}}>
                            {
                                weightMessage.show? <Results key={'weight'} error={weightMessage.status} message={weightMessage.message}></Results>:<></>
                            }
                        </div>
                    </form>
                </div>
                <div className='col-md-4'>
                    <h5>Add/Edit Chick Mortality {(!mortality.mortality_status && !sexingStatus) || (!mortality.mortality_male_status && sexingStatus)? <span className='redcolor' style={{fontSize: 12}}><i>Not Entered for the day</i></span>
                    :
                    <span className='editButton' onClick={()=>{
                        setMortality({
                            ...mortality,  
                            editStatus: !mortality.editStatus,
                            
                          });
                    }}>
                         <i className='fa fa-edit'></i>
                    </span>
                    }</h5>
                     <form onSubmit={handleSubmit3(onSubmit)}>
                        <div className='row'>
                            { sexingStatus ?<>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Male</label>       
                                    <input class="form-control form-control-sm" 
                                    placeholder='# of male birds' id="inputsm" type="number" 
                                    defaultValue={mortality.mortality_male_status? mortality.mortality_male: ''}
                                    {...register3("mortality_male", {
                                        //required: "Enter male mortality",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Invalid Number for Mortality'
                                          }
                                    })}
                                    disabled = {mortality.editStatus}
                                    />
                                     {errors3.mortality_male && <span className="err-msg">{errors3.mortality_male.message}</span>}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Female</label>       
                                    <input class="form-control form-control-sm" 
                                    placeholder='# of female birds' id="inputsm" type="number" 
                                    defaultValue={mortality.mortality_female_status? mortality.mortality_female: ''}
                                    {...register3("mortality_female", {
                                        //required: "Enter female mortality",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Invalid Number for Mortality'
                                          }
                                    
                                    })}
                                    disabled = {mortality.editStatus}
                                    />
                                    {errors3.mortality_female && <span className="err-msg">{errors3.mortality_female.message}</span>}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Culling Male</label>       
                                    <input class="form-control form-control-sm" 
                                    placeholder='# of male birds' id="inputsm" type="number" 
                                    defaultValue={mortality.culling_male_status? mortality.culling_male: ''}
                                    {...register3("culling_male", {
                                        //required: "Enter male culling",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Invalid Number for Mortality'
                                          }
                                    })}
                                    disabled = {mortality.editStatus}
                                    />
                                    {errors3.culling_male && <span className="err-msg">{errors3.culling_male.message}</span>}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="form-group">
                                    <label htmlFor>Culling Female</label>       
                                    <input class="form-control form-control-sm" 
                                    placeholder='# of female birds' id="inputsm" type="number" 
                                    defaultValue={mortality.culling_female_status? mortality.culling_female: ''}
                                    {...register3("culling_female", {
                                        //required: "Enter female culling",
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Invalid Number for Mortality'
                                          }
                                    })}
                                        disabled = {mortality.editStatus}
                                    />
                                    {errors3.culling_female && <span className="err-msg">{errors3.culling_female.message}</span>}
                                </div>
                            </div>  
                            </>
                            :
                                <>
                                    <div className='col-md-8'>
                                        <div className="form-group">
                                            <label>Mortality</label>
                                            <input class="form-control form-control-sm" 
                                            placeholder='# of birds' id="inputsm" type="number" 
                                            defaultValue={mortality.mortality_status? mortality.mortality: ''}
                                            {...register3("mortality", {
                                                //required: "Enter mortality",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'Invalid Number for Mortality'
                                                  }
                                            })}
                                            disabled = {mortality.editStatus}
                                            />
                                            {errors3.mortality && <span className="err-msg">{errors3.mortality.message}</span>}
                                        </div>
                                    </div>
                                    <div className='col-md-8'>
                                        <div className="form-group">
                                            <label>Culling</label>
                                            <input class="form-control form-control-sm" 
                                            placeholder='# of birds' id="inputsm" type="number" 
                                            defaultValue={mortality.culling_status? mortality.culling: ''}
                                            {...register3("culling", {
                                                //required: "Enter mortality",
                                                pattern: {
                                                    value: /^[0-9]+$/,
                                                    message: 'Invalid Number for Culling'
                                                  }
                                            })}
                                            disabled = {mortality.editStatus}
                                            />
                                            {errors3.culling && <span className="err-msg">{errors3.culling.message}</span>}
                                        </div>
                                    </div>
                                    
                                </>
                            }
                            <div className='col-md-2'>
                                <div className="form-group">
                                    {!sexingStatus?<label>&nbsp;</label>:''}
                                    <input type="submit"  disabled = {mortality.editStatus} class="btn btn-sm btn-secondary" value="Submit" />
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop: 15}}>
                            {
                                mortalityMessage.show? <Results key={'mortality'} error={mortalityMessage.status} message={mortalityMessage.message}></Results>:<></>
                            }
                        </div>
                    </form>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12' style={{fontSize: 18}}>
                    {
                        !sexingStatus?
                            <div>
                                <strong>Day FCR: </strong>{dayFCR}
                            </div>
                        : 
                        <div>
                            <strong>Day Male Birds FCR: </strong> {dayFCRMale} <br></br><br></br>
                            <strong>Day Female Birds FCR: </strong> {dayFCRFemale}
                        </div>
                        
                    }
                    
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
export default DailyOperations;