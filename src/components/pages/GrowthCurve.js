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
import { useLoading, Bars } from '@agney/react-loading';
import * as axioInstance from '../utils/axiosinstace';
import GrowthCurveComponent from "./GrowthCurveComponent";
import moment from "moment";
const GrowthCurve = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
    const [farmData, setFarmData] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [headersobj] = useState(headers());
    const [graphData, setGraphData] = useState({});
    const [showGraph, setShowGraph] = useState(false);
    const [showLoader, setShowloader] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const onchangeHandler = async(e)=> {
        
        try {
            setShowData(true);
            const response = await axioInstance.getListofBatches(e.target.value, 'full');
            setBatchData(response.list);
            setShowGraph(false);
        } catch (err) {
            setBatchData([]);
            console.log(err);
        }
    }
    const [xaxis, setXaxis] = useState([]);
    const [yaxis, setYaxis] = useState([]);
    const [idleweights, seIdleweights] = useState([]);
    const [showData, setShowData] = useState(true);
    const [maleSeries, setMaleSeries] = useState([]);
    const [femaleSeries, setFemaleSeries] = useState([]);
    const [asHatchedSeries, setAsHatchedSeries] = useState([]);
    const [sexingStatus, setSexingStatus] = useState('no');
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [maleLegends, setMaleLegends] = useState([]);
    const [femaleLegends, setFemaleLegends] = useState([]);
    const [chickLegends, setChickLegends] = useState([]);
    const [otherInfo, setOtherInfo] = useState({
        breedName: "",
        batchDuration: "",
        startDate: "",
        endDate: "",
        sexing: "",
        status: ""
    })
    const onSubmit = async(data, e) => {
        e.preventDefault();
        setShowloader(true);
        try {
            const response  = await axioInstance.getGrowthCurve(data.batchID);
            if(response.status ==false) {
                setShowData (false);
                setShowloader(false);
                setErrorMessage(response.message)
                return;
            }
            if(response.data.length ==0 ) {
                setShowData (false);
                setShowloader(false);
                setErrorMessage(response.message);
                return;
            }
            setShowData (false);
            setData(response.data);
            setOtherInfo(response.others)
            const days = response.data.map((item)=>item.day);
            setXaxis(days);
            setSexingStatus(response.others.sexing);
            let _data = response.data;
            //alert( moment(response.others.endDate).diff(moment(), 'days'))
            const daydiff = moment(response.others.endDate).diff(moment(), 'days');
            //alert(daydiff)
            if(daydiff >0 && response.others.status=='ACTIVE') {
                const day = response.others.batchDuration - daydiff;
                _data = _data.filter((item)=>parseInt(item.day)<=day);
                //alert(JSON.stringify(_data));
            } 
            
            if(response.others.sexing == 'no') {
                const asHatchdeSeriesData = [];
                const  asHatched = {
                    name: response.others.breedName,
                    type:'line',
                    smooth:true,
                    data: _data.map((item)=>{
                        if(item.chickweight === '--') {
                            return '--';
                        }
                        return item.chickweight;
                    }),
                    connectNulls: true
                }
                asHatchdeSeriesData.push(asHatched);
                const  ideal_weight = {
                    name: response.others.breedName+'-Ideal Weight',
                    type:'line',
                    smooth:true,
                    data: response.data.map((item)=>item.ideal),
                    connectNulls: true
                }
                asHatchdeSeriesData.push(ideal_weight);
               
                setChickLegends([ response.others.breedName, response.others.breedName+'-Ideal Weight'])
                setAsHatchedSeries(asHatchdeSeriesData);
                setShowloader(false);
                
                return;
            }
            
            const maleSeriesData = [];
            const femaleSeriesData = [];
           
            const  maleobj = {
                name: response.others.breedName+'-Male',
                type:'line',
                smooth:true,
                data: _data.map((item)=>{
                    if(item.male === '--') {
                        return null;
                    }
                    return item.male;
                }),
                connectNulls: true
            }
            
            maleSeriesData.push(maleobj);

            const  ideal_male = {
                name: response.others.breedName+'-Male Ideal Weight',
                type:'line',
                smooth:true,
                data: response.data.map((item)=>item.ideal_male),
                connectNulls: true
            }
            maleSeriesData.push(ideal_male)
            setMaleLegends([response.others.breedName+'-Male', response.others.breedName+'-Male Ideal Weight'])
            setMaleSeries(maleSeriesData);
            const  femaleobj = {
                name: response.others.breedName+'-Female',
                type:'line',
                smooth:true,
                data: _data.map((item)=>{
                    if(item.female === '--') {
                        return '--';
                    }
                    return item.female;
                }),
                connectNulls: true
            } 
            femaleSeriesData.push(femaleobj);
            const  ideal_female = {
                name: response.others.breedName+'-Female Ideal Weight',
                type:'line',
                smooth:true,
                data: response.data.map((item)=>item.ideal_female),
                connectNulls: true
            } 
            femaleSeriesData.push(ideal_female);
            setFemaleLegends([response.others.breedName+'-Female', response.others.breedName+'-Female Ideal Weight'])
            setFemaleSeries(femaleSeriesData);
            setShowloader(false);
        } catch (err) {
            setShowData (false);
            setShowloader(false);
        }
        // axios.get(env.produrl+'/growthcurve/'+data.batchID , { headers: headersobj}
        // ).then(res=>{
        //     console.log(res.data);
        //     setXaxis(res.data.xAxis);
        //     setYaxis(res.data.bweights);
        //     seIdleweights(res.data.yAxiskg);
        //     setShowGraph(true);
        //     setShowloader(false);
        // }).catch((err) =>{
        //     setXaxis([]);
        //     setYaxis([]);
        //     seIdleweights([]);
        //     setShowGraph(false);

        //     console.log(err);
        //     setShowloader(false);
        // });

    }
    const onBatchChange = (e)=>{
        setShowGraph(false);
    }
    const getFarms = async()=>{
        try {
            const response = await axioInstance.getListofFarms(getUserName());
            setFarmData(response.list)
        } catch (err) {
            console.log(err.message);
        }
    }
    
    useEffect(() => {    
        getFarms();
     },[]);
    return (
        
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Bird Growth Path</h2>
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
                                    {errors.famrmID && <span className="err-msg">Please select Barn</span>}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label>Select Batch</label>
                                    <select class="form-control" name="batchID" onChange= {onBatchChange}
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
                            <div className="col-md-1 form-group">
                                <div class="spacer"></div>
                                <input type="submit"   value="Fetch" class="btn btn-primary" />
                            </div>
                            <div className='col-md-1'>
                                { showLoader?
                                     <section {...containerProps} style = {{"margin-top": "30px"}}>
                                        {indicatorEl} 
                                    </section> :""
                                }
                            </div>
                        </div>
                </form>
                    {
                        showData?
                        <div className="row">
                            <div className="col-md-12">
                                <p className="redColor">{errorMessage}</p>
                            </div>
                        </div>
                        :
                        <div className="row">
                            <div className="col-md-12">
                                <GrowthCurveComponent key={Math.random()} data={data} xaxis={xaxis} legends = {[]} sexing = {sexingStatus} 
                                maleseries={maleSeries} femaleseries={femaleSeries} 
                                asHatchedSeries = {asHatchedSeries} max='4'
                                maleLegends = {maleLegends} femaleLegends={femaleLegends}
                                chickLegends = {chickLegends} otherInfo = {otherInfo}
                                ></GrowthCurveComponent>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
        
    );
}

export default GrowthCurve;