import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import { getRole } from '../utils/common';
import { Role } from '../utils/role';
import  DeactivateFarm  from './DeactivateFarm';
import {Modal, Button} from 'react-bootstrap';
import { getUserName } from '../utils/common';
import EchartBar from '../dashboard/barchart';
import { useLoading, Bars } from '@agney/react-loading';
import * as axiosInstance from '../utils/axiosinstace';
const Mortality = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
    const [farmData, setFarmData] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [headersobj] = useState(headers());
    const [batchID, setBatchID]= useState('');
    const [numbers, setNumbers] = useState([]);
    const [showNumbers, setShowNumbers] = useState(false);
    const [graphData, setGraphData] = useState({});
    const [showGraph, setShowGraph] = useState(false);
    const [showLoader, setShowloader] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const onchangeHandler = async(e)=> {
        
        try {
            const response = await axiosInstance.getListofBatches(e.target.value, 'full');
            setBatchData(response.list);
            setShowGraph(false);
        } catch (err) {
            setBatchData([]);
            console.log(err);
        }
        
        // axios.get(env.produrl+'/misc/listofbatches/'+ e.target.value+'/full', { headers: headersobj}
        // ).then(res=>{
        //   console.log(res.data.list);
        //     setBatchData(res.data.list);
        //     setShowGraph(false);
        // }).catch((err) =>{
        //     setBatchData([]);
        //     console.log(err);
        // });      
    }
    const onSubmit = async(data, e) => {
        e.preventDefault();
        setShowloader(true);
        try {
            const response = await axiosInstance.getMortlalityData(data.batchID, data.filter)
           
            setGraphData(response);
            setShowGraph(true);
            setShowloader(false);
        } catch (err) {
            setGraphData({});
            setShowGraph(false);
            console.log(err);
            setShowloader(false);
        }
    }
    const onBatchChange = (e)=>{
        //alert("hi");
        setBatchID(e.target.value);
        setShowGraph(false);
    }
    const onFilterChange = (e)=>{
        //alert(batchID);
        setShowGraph(false);
        // let prefix = e.target.value==='week'? 'Week ': e.target.value==='phase'?'Phase ': null;
        // let index =  e.target.value==='week'? 0: e.target.value==='phase'? 1 : null;
        // if(e.target.value==='week' || e.target.value === 'phase') {
        //     setShowNumbers(true);
        // } else {
        //     setShowNumbers(false);
        //     return;
        // }
        // axios.get(env.produrl+'/analytics/filters/'+batchID+'/'+ e.target.value, { headers: headersobj}
        // ).then(res=>{
            
        //     let numbersData= [];
           
        //     for(let i=0; i<res.data.resp; i++) {
        //         numbersData.push({
        //             number: i+index,
        //             value: prefix+(i+1)
        //         })
        //     }
        //     setNumbers(numbersData);
        // }).catch((err) =>{
        //     // setBatchData([]);
        //     console.log(err);
        // }); 
    }
    // const onNumberChange = () =>{
    //     setShowGraph(false);
    // }
    const getFarms = async()=>{
        try {
            const response = await axiosInstance.getListofFarms(getUserName())
            setFarmData(response.list);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {  
        getFarms();
     },[headersobj]);
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Mortality</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                        
                        <div className="row">
                            
                            <div className="col-md-3">
                                <div className="form-group">
                                   <label>Select Barn</label>
                                    <select class="form-control" name="famrmID"
                                    {...register("famrmID", { required: true })}
                                    onChange={onchangeHandler}
                                    // ref={register ({
                                    //     required: 'Please select farm'
                                        
                                    // })} onChange={onchangeHandler}
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
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>Select Batch</label>
                                    <select class="form-control" name="batchID" onChange= {onBatchChange}
                                    // ref={register ({
                                    //     required: 'Please select batch'
                                        
                                    // })}
                                    {...register("batchID", { required: true })}
                                    >
                                        <option value="">-Select-</option>
                                        {batchData.map(item => (
                                                <option
                                                  key={item.batchID}
                                                  value={item.batchID}
                                                >
                                                  {item.batchName}
                                                  
                                                </option>
                                              ))}
                                    </select>
                                    {errors.batchID && <span className="err-msg">Please select Batch</span>}
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>Select Filter</label>
                                    <select onChange = {onFilterChange} class="form-control" name="filter"
                                    {...register("filter", { required: true })}
                                    // ref={register ({
                                    //     required: 'Please select Filter'
                                        
                                    // })}
                                    >
                                        <option>Select</option>
                                        <option value="week">Week</option>
                                        <option value="phase">Phase</option>
                                        <option value="full">Full</option>
                                    </select>
                                    {errors.filter && <span className="err-msg">Please select Filter</span>}
                                </div>
                            </div>
                            {/* {showNumbers? 
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>Select Week/Phase</label>
                                    <select class="form-control" name="number" onChange = {onNumberChange}
                                    ref={register ({
                                        required: 'Please select Week/Phase'
                                        
                                    })}
                                    >
                                        <option>Select</option>
                                        {numbers.map(item => (
                                                <option
                                                  key={item.number}
                                                  value={item.number}
                                                >
                                                  {item.value}
                                                  
                                                </option>
                                              ))
                                        }
                                    </select>
                                    {errors.number && <span className="err-msg">{errors.number.message}</span>}
                                </div>
                            </div>
                            :""} */}
                            <div className="col-md-1 form-group">
                                <div class="spacer"></div>
                                <input type="submit"  value="Fetch" class="btn btn-primary" />
                            </div>
                            <div className='col-md-1'>
                                { showLoader?
                                     <section {...containerProps} style = {{"margin-top": "30px"}}>
                                        {indicatorEl} {/* renders only while loading */}
                                    </section> :""
                                }
                            </div>
                        </div>
                </form>
                    <div className="row">
                        <div className="col-md-12">
                            {showGraph? 
                            <EchartBar  key={Math.random()} data={graphData} category='Chick Mortality' color="#dc1d22" ylabel='Chick Mortality' ></EchartBar>
                           :""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Mortality;