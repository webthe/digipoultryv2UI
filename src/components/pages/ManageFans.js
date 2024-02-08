import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import {env} from './const';
import { headers } from '../utils/common';
import { getRole, getUserName, controls } from '../utils/common';
import { useLoading, Bars } from '@agney/react-loading';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { useLocation } from 'react-router-dom';
import * as axiosInstance from '../utils/axiosinstace'
const ManageFans = (props) => {
    const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Bars width="30" color="#333" />,
    });
    const location = useLocation();
    
    const [role]=useState(getRole())
    const [data, setData] = useState([])
    const [headersobj] = useState(headers());
    const loadFarmData = useRef(()=>{});
    const [farmData, setFarmData] = useState([]);
   
    const [showOnLoader, setShowOnLoader] = useState(false);
    const [showLoader, setShowloader] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [fans, setFans] = useState([]);
    const [noFans, setNoFans] = useState(true);
    const [selectedFarm, setSelectedFarm] = useState('');
    loadFarmData.current = async()=>{
       setShowloader(true);
       try {
        const response = await axiosInstance.getListofFarms(getUserName());
            setFarmData(response.list);
            setShowloader(false);
       } catch (err) {
            setShowloader(false);
        }
    }
    const onchangeHandler = (e)=>{
        setSelectedFarm(e.target.value)
        getFaninfo(e.target.value);
    }
    const getFaninfo = async(farmID)=>{
        setShowloader(true);
        try {
            const response = await axiosInstance.getFansByFarm(farmID);
            setFans(response.list);
             if(response.list.length === 0) {
                setNoFans(false);
             } else {
                setNoFans(true);
             }
             setShowloader(false);
        } catch (error) {
            //console.log(err.message);
            setShowloader(false);
        }
       
    }
    const swithcontrol  = (status, farmID)=>{
        alert(status)
    }
    const [isLoading, setIsLoading] = useState({});
    const [activeFarmID, setActiveFarmID] = useState(null);
    const handleToggle = async(itemId, fanID, checked) => {
        setIsLoading(prevState => ({
          ...prevState,
          [itemId]: true
        }));
        const status = checked?'ACTIVE':'INACTIVE';
        
        const updatedData = fans.map((item) =>
            item.fanID === fanID ? { ...item, swtichStatus: status } : item
        );
        
        // Update Fan swith status
        const data = {fanID: fanID, fanNumber:itemId+1, status: status};
        try {
            const response = await axiosInstance.updateFanStatus(data);
            if(!response.message) {
                alert("Error in controlling switch");
                return;
            }
            setIsLoading(prevState => ({
                ...prevState,
                [itemId]: false
              }));
        } catch (err) {
            alert(err.response.data.message);
            return;
        }
        // axios.put(env.produrl+'/misc/updateSwitch/', {fanID: fanID, fanNumber:itemId+1, status: status}, { headers: headersobj}
        // ).then(res=>{
        //     if(!res.data.message) {
        //         alert("Error in controlling switch");
        //         return;
        //     }
        //     setIsLoading(prevState => ({
        //         ...prevState,
        //         [itemId]: false
        //       }));
        // }).catch((err) =>{
        //     console.log(err);
        //     alert(err.response.data.message);
        //     return;
        // });    
        
        
        setFans(updatedData);
        if (checked) {
            setActiveFarmID(fanID);
        } else {
        setActiveFarmID(null);
        }
    };
    const onSubmit = ()=>{}
    // const updateSwitchStatus = (fanID, status)=>{

    // }
    useEffect(()=>{
        loadFarmData.current();
        if(location.farmID !== undefined) {
            setSelectedFarm(location.farmID);
            getFaninfo(location.farmID);
        } else {
            setNoFans(true);
        }
    },[loadFarmData]);
    
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Manage Fans</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <div className="row">
                       <div className="col-md-12">
                       <form onSubmit={handleSubmit(onSubmit)} style={{width:'100%'}}>
                            <div className="row" >
                                <div className="col-md-4">
                                    <div className="form-group">
                                    <label>Select Barn</label>
                                        <select value={selectedFarm} class="form-control" name="famrmID"
                                        {...register("famrmID", { required: true })}
                                        onChange={onchangeHandler}
                                        >
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
                                        {errors.famrmID && <span className="err-msg">Please select farm</span>}
                                    </div>
                                </div>
                                <div className='col-md-1'>
                                    { showLoader?
                                        <section {...containerProps} style = {{"margin-top": "30px"}}>
                                            {indicatorEl} {/* renders only while loading */}
                                        </section> :""
                                    }
                                </div>
                            </div>
                            {
                            controls()==0?
                            
                                <div className="waterMeterMessage" role="alert">
                                    <img src="/dist/img/lock.png" width="30"></img>
                                    "Available in pro version, please contact administrator to activate"
                                </div>
                                :''
                            }
                        </form>
                       </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            {
                                noFans===false?<span className="redcolor">No Fans information found</span>: <></>
                            }
                        </div>
                    </div>
                    {fans.map((item, index) => (
                       <div className="row" key={index} style={{marginBottom: 15}}>
                            <div className="col-md-2">
                                <div className="row">
                                    <div className="col-md-4">
                                        {
                                            item.swtichStatus==='ACTIVE'?
                                            <div className="heading-img">
                                                <img src="/dist/img/fan.png"  className='rotating'></img>
                                            </div>
                                            :<div className="heading-img">
                                                <img src="/dist/img/fan_grey.png"></img>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-md-8" style={{marginTop: 6}}>
                                        <span className="fanLabel">Fan {index+1}</span>
                                    </div>
                                </div>
                               
                            </div>
                            <div className="col-md-1">
                                <BootstrapSwitchButton
                                    checked={item.swtichStatus==='ACTIVE'?true:false}
                                    disabled={activeFarmID !== null && activeFarmID !== item.fanID}
                                    onChange={(checked) => {
                                        //swithcontrol(checked, item.farmID);
                                        // setShowOnLoader(true);
                                        handleToggle(index, item.fanID, checked)
                                    }}
                                    width={80}
                                />
                            </div>
                            <div className='col-md-1' style={{marginLeft: 10}}>
                            {isLoading[index] && (
                                <section {...containerProps} style = {{"margin-top": "0px"}}>
                                    {indicatorEl} {/* renders only while loading */}
                                </section> 
                            )}
                              
                            </div>
                       </div>
                    ))}
                   
                </div>
            </div>
        </div>
    );
}

export default ManageFans;