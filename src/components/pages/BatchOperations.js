import React, { useEffect, useState } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import moment from 'moment-timezone';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import EdiText from "react-editext";
import {Tabs, Tab} from 'react-bootstrap-tabs';
import EchartLine from '../dashboard/echart';
import BatchAccounting from '../pages/BatchAccounting';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import DailyOperations from "./DailyOperations";
import WaterConsumption from "./WaterConsumption";
import * as axiosInstance from '../utils/axiosinstace'
const BatchOperations = () => {
    let today = moment().tz("Asia/Singapore").format("YYYY-MM-DD");

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [headersobj] = useState(headers());
    const [minmaxVal, setMinMaxVal] = useState({});
    const [batchID, setBatchID] = useState();
    const [phaseID, setPhaseID] = useState();
    const [selectedDate, setSelectedDate] = useState(today);
    const [role] = useState(getRole());
    const columns2 = [
        {
            name: "Time",
            selector: "time",
            sortable: true,
            width: "80px"
        },
        {
            name: "Reading",
            selector: "reading",
            sortable: true,
            width: "105px"
        },
       
        {
            name: "Consumption per hr",
            selector: "diffConsumption",
            sortable: true,
            width: "200px"
        },
        {
            name: "Total Consumption (L)",
            selector: "consumption",
            sortable: true,
            width: "250px"
        },
    ]
    const columns = [
       
        {
            name: "Date Time",
            selector: "createdDate",
            sortable: true,
            width: '200px',
            cell: row => <div>{row.createdDate} </div>,
          },
        {
          name: "Temp",
          selector: "temp",
          sortable: true,
          minWidth: '50px',
          cell: row => <div>{row.temp} &nbsp;
          {row.temp<minmaxVal.tempMin
           || row.temp>minmaxVal.tempMax? <span><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i></span>: ""} </div>,
        },
        {
          name: "RH (%)",
          selector: "rh",
          sortable: true,
          cell: row => <div>{row.rh} &nbsp;
          {row.rh<minmaxVal.rhMin || row.rh>minmaxVal.rhMax? <span><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i></span>: ""} </div>,
        },
        {
            name: "CO2 (PPM)",
            selector: "co",
            sortable: true,
            minWidth: '50px',
            cell: row => <div>{row.co} &nbsp;
          {row.co>minmaxVal.coMax? <span><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i></span>: ""} </div>,
        },
        {
            name: "NH3 (PPM)",
            selector: "nh",
            sortable: true,
            cell: row => <div>{row.nh} &nbsp;
          {row.nh>minmaxVal.nhMax ?<span><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i></span>: ""} </div>,
        }
      ];
      
    const [waterReading, setWaterReadings] = useState([
        {
            time: '00.00',
            reading: '10020',
            consumption: '0.120',
            diffConsumption: '0.10'
        },
        {
            time: '01.00',
            reading: '10025',
            consumption: '0.200',
            diffConsumption: '0.80'
        },
        {
            time: '02.00',
            reading: '10050',
            consumption: '0.230',
            diffConsumption: '0.60'
        },
        {
            time: '03.00',
            reading: '12020',
            consumption: '0.100',
            diffConsumption: '0.65'
        },
        {
            time: '04.00',
            reading: '13020',
            consumption: '0.400',
            diffConsumption: '0.75'
        },
        {
            time: '05.00',
            reading: '10020',
            consumption: '0.450',
            diffConsumption: '0.85'
        },
        {
            time: '07.00',
            reading: '13020',
            consumption: '0.230',
            diffConsumption: '0.95'
        },
        {
            time: '08.00',
            reading: '15020',
            consumption: '0.145',
            diffConsumption: '0.46'
        },
        {
            time: '09.00',
            reading: '13019',
            consumption: '0.176',
            diffConsumption: '0.34'
        },
        {
            time: '10.00',
            reading: '16020',
            consumption: '0.768',
            diffConsumption: '0.23'
        }

    ]);
    const [farmData, setFarmData] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [batchInformation, setBatchInformation] = useState([]);
    const [color, setColor] = useState();
    const [readingsData, setReadingsData] = useState([]); 
    const [farmID, setFarmID] = useState(); 
    const [showDataTable, setShowDataTable] = useState(false); 
    const [showReadings, setShowreadings] = useState(false); 
    const [progress, setProgress] = useState(true);

    const [status, setStatus] = useState({});
    const [activeFarm, setActiveFarm] = useState();
    const [mortalityCond, setMortalityCond] = useState(true);
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [activeID, setActiveID] = useState();
    const getBatches = async(farmID)=>{
        try {
            const response = await axiosInstance.getListofBatches(farmID, 'active');
          
            setBatchData(response.list);
        } catch (err) {
             console.log(err);
        }
    }
    const getImeiNumber = async(batchID)=>{
        try {
            const response = await axiosInstance.getImeiNumber(batchID);
            
            setFarmID(response.list[0].deviceID);
        } catch (err) {
             console.log(err);
        }
    }
    // console.log(env.produrl+'/misc/listofbatches/');
    const onchangeHandler = (e)=> {
        setActiveFarm(e.target.value);
        setShowResults(false);
        setShowDataTable(false);
        
        getBatches(e.target.value);
        getImeiNumber(e.target.value)
        
    }
    const onSubmit = async(data, e) => {
        e.preventDefault();
        setShowResults(false)
        setBatchID(data.batchID);
        try {
            const response = await axiosInstance.getBatchOperationsData(data.batchID)
            let phaseID;
           
            if(response.list) {
               let batchData = response.list;
               
               phaseID = batchData.filter((item)=> item.date===today);
               let date = today;
               if( phaseID.length===0) {
                    phaseID = batchData.sort((a,b)=> {
                        return(b.index-a.index)
                    });
                    date = phaseID[0].date;
                } 
              //console.log("****",phaseID)  
               readings(date, phaseID[0].phase, data.batchID);
               setBatchInformation(batchData.sort((a,b)=>{return a.index - b.index}));
               setPhaseID(phaseID[0].phase);
            }
        } catch (err) {
            setShowResults(true);
            setShowDataTable(false);
            console.log(err)
            setResultMessage({
                error: true, message: err.response.data.message
            });
            // console.log(err.response.data.message);
        }
    }
    const readings = async(date, _phase, _batchID) =>{
        
        
        // console.log(farmID);
        try {
            setActiveID(date);
            if(moment(today).diff(moment(date), "days")>=0) {
                setShowreadings(true);
            } else {
                setShowreadings(false);
                return;
            }
            setShowDataTable(true);
            setSelectedDate(date);

            const response = await axiosInstance.getBatchReadings(date, _batchID);
            if(response.list) {
               //console.log(res.data.list)
               setReadingsData(response.list);
               //console.log(res.data.list)
               setProgress(false);
               //minMax()
            }
            setPhaseID(_phase);
            fetchData(_batchID, _phase);
            fetchValues(date, _batchID, _phase);
        } catch (err) {
            console.log(err.message);
            setReadingsData([]);
            setProgress(false);
        }
    }
    const fetchData = async (_batchID, _phaseID)=>{
       //console.log(_phaseID)
       try {
        const response = await axiosInstance.getThresholds(_batchID, _phaseID);
        if(response.list) {
            setMinMaxVal(response.list[0])
        }
       } catch (err) {
        console.log(err.message);
       }
    }
    const latestReadings = ()=>{
        readings(selectedDate, phaseID, batchID);
    }
    
    const [expensesData, setExpensesData] = useState([]);
    const [accumaltedWeight, setAccumalatedWeight]= useState(0);
    
    const [baccStatus, setBaccStatus]= useState(false);
    const [rate, setRate]= useState(0);
    const [totalAmount, setTotalAmount]= useState(0);
    const getFarms = async()=>{
        try {
            const response = await axiosInstance.getListofFarms_active(getUserName());
            setFarmData(response.list);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {    
        getFarms();
    },[selectedDate]);
    
    const [batchSummary, setBatchSummary] = useState({
        male: 0,
        female: 0,
        sexing: "no",
        farmID: "",
        farmName: "",
        batchName: "",
        startDateTime: "",
        closeDate: "",
        templateID: "",
        nubmerofchicks: 0,
        templateName: "",
        duration: 0,
        breedName: "",
        totalWeight: "0.00",
        feedWeight: "0.00",
        avgchickweight: "0.00",
        avgchickweightMale: 0.000,
        avgchickweightFeMale: 0.000,
        totalMortality: 0,
        totalMortality_male: 0,
        totalMortality_female: 0,
        selection: false,
        mortality: "0.00",
        livability: 0,
        pef: "0.00",
        totalBirdsAtClose: 0,
        fcr: "Infinity",
        startDate: "0"
    })
    const fetchBatchSummary = async (batchID) =>{
        try {
            const response = await axiosInstance.getBatchSummary(batchID);
            setBatchSummary(response.list[0]);
        } catch (err) {
            console.log(err.message);
        }
    }
    const getExpensesList = async (batchID) =>{
        try {
            const response = await axiosInstance.getExpensesList(batchID);
            let list = response.list;
            setExpensesData(list);
            if(list.length>0) {
                let amount = list.reduce((a,b)=>{
                    return(parseFloat(a)+parseFloat(b.amount))
                },0)
                setTotalAmount(amount)
            }
        } catch (err) {
            console.log(err.message);
            setTotalAmount(0);
        }
    }
    const getBatchWeights = async (batchID) =>{
        try {
            const response = await axiosInstance.getBatchWeights(batchID);
            setAccumalatedWeight(response.accumaltedWeight)
        } catch (err) {
            console.log(err.message);
        }
    }
    const getExpensesStatus = async (batchID) =>{
        try {
            const response = await axiosInstance.getExpensesStatus(batchID);
            let statusRecord = response.list;
                if(statusRecord.length>0) {
                    if(statusRecord[0].rate===null || statusRecord[0].rate==='') {
                        setRate(0);
                        setBaccStatus(false);
                    } else {
                        setRate(statusRecord[0].rate);
                        setBaccStatus(true);
                    }
                    
                } else {
                    setRate(0);
                }
        } catch (err) {
            console.log(err.message);
        }
    }
    const getBatchSummary = (index, label) => {
        if(index===3) {
            fetchBatchSummary(batchID)
        }

        if(index===5) {
            getExpensesList(batchID);
            getBatchWeights(batchID);
            getExpensesStatus(batchID)
        }
      }
    const [tempState, setTempState] = useState([]);
    const [xData, setXData] = useState([]);
    const [rhState, setRHState] = useState([]);
    const [coState, setCOState] = useState([]);
    const [nhState, setNHState] = useState([]);
    

    //Plots

   const initial_dbvals = {
        "mintemp": 0,
        "maxtemp": 0,
        "avgtemp": 0,
        "maxrh": 0,
        "minrh": 0,
        "avgrh": 0,
        "maxco": 0,
        "minco": 0,
        "avgco":0,
        "minnh": 0,
        "maxnh": 0,
        "avgnh": 0,
        "minhi": 0,
        "maxhi": 0,
        "lasteUpdated": ""
    };
    const initial_currvals = {
            
        "temp": 0,
        "rh": 0,
        "co": 0,
        "nh": 0,
        "hi": 0

    }
   
    const [dashboardValues, setDashboardValues]=useState(initial_dbvals);
    const [currValues, setCurrValues]=useState(initial_currvals);
    const [thresholds, setThresholds] = useState([]);
    const [addWeigtFeedStatus, setAddWeigtFeedStatus] = useState({});

    async function fetchValues (_date, _batchID, _phase){
        try {
            const response = await axiosInstance.getDashboardBatchSummary(farmID, _date, _batchID, _phase);
           
           setDashboardValues(response.dashboardValues[0])
           setTempState(response.chartData.tempData);

           setXData(response.chartData.xData);
           setRHState(response.chartData.rhData);
           setCOState(response.chartData.coData);
           setNHState(response.chartData.nhData);
           setThresholds(response.getMinMax);
           //console.log(response.getMinMax)
           if(response.dashboardValues.length>0) {
            setDashboardValues(prevState => {
                return {...prevState, ...response.dashboardValues[0]};
                
            });
            
           } else {
            setDashboardValues(prevState => {
                return {...prevState, ...initial_dbvals};
            });
           }
            if (response.currValues.length>0) {
                setCurrValues(prevState => {
                    return {...prevState, ...response.currValues[0]};
                });
            } else {
                setCurrValues(prevState => {
                    return {...prevState, ...initial_currvals};
                });
            }
        } catch (err) {
            console.log(err.message);
             setDashboardValues(prevState => {
                return {...prevState, ...initial_dbvals};
            });
            setCurrValues(prevState => {
                return {...prevState, ...initial_currvals};
            });
            setTempState([]);
            setXData([]);
            setRHState([]);
            setCOState([]);
            setNHState([]);
            setThresholds([]);
           
        }
        // axios.get(env.produrl+'/dashboard/batchSummary/'+farmID+'/'+_date+'/'+_batchID+'/'+_phase, { headers: headersobj })
        // .then(res=>{
        //    console.log(res.data);
        //    setDashboardValues(res.data.dashboardValues[0])
        //    setTempState(res.data.chartData.tempData);

        //    setXData(res.data.chartData.xData);
        //    setRHState(res.data.chartData.rhData);
        //    setCOState(res.data.chartData.coData);
        //    setNHState(res.data.chartData.nhData);
        //    setThresholds(res.data.getMinMax);
        //    console.log(res.data.getMinMax)
        //    if(res.data.dashboardValues.length>0) {
        //     setDashboardValues(prevState => {
        //         return {...prevState, ...res.data.dashboardValues[0]};
                
        //     });
            
        //    } else {
        //     setDashboardValues(prevState => {
        //         return {...prevState, ...initial_dbvals};
        //     });
        //    }
        //     if (res.data.currValues.length>0) {
        //         setCurrValues(prevState => {
        //             return {...prevState, ...res.data.currValues[0]};
        //         });
        //     } else {
        //         setCurrValues(prevState => {
        //             return {...prevState, ...initial_currvals};
        //         });
        //     }
           
        // }).catch((err) =>{
        //      console.log(err.message);
        //      setDashboardValues(prevState => {
        //         return {...prevState, ...initial_dbvals};
        //     });
        //     setCurrValues(prevState => {
        //         return {...prevState, ...initial_currvals};
        //     });
        //     setTempState([]);
        //     setXData([]);
        //     setRHState([]);
        //     setCOState([]);
        //     setNHState([]);
        //     setThresholds([]);
           
        // });
    }
    return (
        <div className="batchOperations">
             <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Batch Operations</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-12">
                            { showResults ? <Results key={Math.random()} message={resultMessage.message} error = {resultMessage.error}  /> : null }
                            </div>
                        </div>
                        <div className="row">
                            
                            <div className="col-md-4">
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
                                    {errors.famrmID && <span className="err-msg">Please select farm </span>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label>Select Batch</label>
                                    <select class="form-control" name="batchID"  key={Math.random()}
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
                                    {errors.batchID && <span className="err-msg">Please select batch</span>}
                                </div>
                            </div>
                            <div className="col-md-4 form-group">
                                <div class="spacer"></div>
                                <input type="submit"  value="Fetch Data" class="btn btn-primary" />
                            </div>
                        </div>
                    </form>
                    <div class="clearfix"></div>
                    <div className="row">
                        {showDataTable? 
                        <div className="col-md-12">
                            <div style={{marginBottom: 30, fontWeight: 700, fontSize: 18}}>Batch Days</div>

                            <ul class="days" id="daysList">
                                {
                                    
                                    batchInformation.map(item => (
                                                
                                        <li style={{position: 'relative'}}
                                        data-toggle="tooltip" data-placement="top" title={"Phase: "+item.phase+", Date: "+item.date}
                                        className={(
                                             moment(item.date).isSame(today, 'day') ? 'today-bg' 
                                            :moment(item.date).isAfter(today, 'day')  ? 'default-bg'
                                            :activeID===item.date? 'active'
                                            :'green-bg'
                                        )}><a tabindex="0" id={item.index-1} onClick =  {()=>readings(item.date, item.phase, batchID)}>{
                                            item.index-1
                                        }</a>
                                        <span style={{position: 'absolute', top:-20, fontWeight: 700}}>{item.index==1? 'DOC': ''}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        :""}
                        <div className="col-md-12">
                            {showReadings && showDataTable ? 
                            
                            <Tabs activeHeaderStyle={{}} onSelect={getBatchSummary}>
                            <Tab label="Conditions Monitoring">
                            <div className="col-md-12">
                                <h6 className="text-center">Selected Date: {selectedDate}, Phase: {phaseID} (<span className="refresh secondary" onClick = {latestReadings}>Click here to refresh</span>)</h6>
                            </div>
                            <div className="col-md-12">
                                <DataTable
                                    progressPending={progress}
                                    columns={columns}
                                    data={readingsData}
                                    defaultSortField="createdDate"
                                    defaultSortAsc = {false}
                                    pagination
                                    dense='false'
                                    compact
                                    highlightOnHover = 'true'
                                    striped
                                    paginationPerPage = {25}
                                    paginationRowsPerPageOptions = {[10, 25, 50, 100]}
                                />
                            </div>
                            </Tab>
                            <Tab label="Water Consumption">
                                
                                <WaterConsumption  batchID={batchID} selectedDate = {selectedDate} phaseID = {phaseID}></WaterConsumption>
                            </Tab>
                            
                            <Tab label="Daily Operations" key={selectedDate}>
                                <DailyOperations  date = {selectedDate} farm = {activeFarm} batchID= {batchID}></DailyOperations>
                            </Tab>
                            <Tab label="Batch Summary">
                                <div className="row">
                                    <div className="col-md-6">
                                        <table className="table table-sm table-bordered summary-table">
                                            <tr>
                                                <th>Batch</th>
                                                <td>{batchSummary.batchName}</td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Barn</th>
                                                <td>{batchSummary.farmName}</td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Template</th>
                                                <td>{batchSummary.templateName}</td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Bird Type</th>
                                                <td>{batchSummary.breedName}</td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Start Date</th>
                                                <td>{moment(batchSummary.startDateTime).format('DD-MMM-YYYY')}</td>
                                                
                                            </tr>
                                            
                                            <tr>
                                                <th>Duration</th>
                                                <td>{batchSummary.duration} days</td>
                                                
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <table className="table table-sm table-bordered summary-table">
                                        
                                            <tr>
                                                <th>Total No. of Birds at Start</th>
                                               
                                                {batchSummary.sexing=='yes'?
                                                
                                                <td>
                                                <b>Total: </b> {batchSummary.nubmerofchicks.toLocaleString()} ,&nbsp; 
                                                <b>Male:</b> {batchSummary.male.toLocaleString()} ,&nbsp;
                                                <b>Female:</b> {batchSummary.female.toLocaleString()}
                                                </td>
                                                :
                                                 <td>{batchSummary.nubmerofchicks}</td>
                                                }
                                            </tr>
                                            <tr>
                                                <th>Chick Mortality</th>
                                                {batchSummary.sexing=='yes'?
                                                <td>
                                                    <b>Total:</b> {batchSummary.mortality} <span className="font10 redcolor">({batchSummary.totalMortality_percentage} %)</span> , &nbsp;
                                                    <b>Male:</b> {batchSummary.mortality_male} <span className="font10 redcolor">({batchSummary.totalMortalityPercentage_male} %)</span> ,&nbsp;  
                                                    <b>Female:</b> {batchSummary.mortality_female} <span className="font10 redcolor">({batchSummary.totalMortalityPercentage_female} %)</span>
                                                    
                                                    
                                                </td>
                                                :
                                                 <td>{batchSummary.mortality} <span className="font10 redcolor">({batchSummary.totalMortality_percentage} %)</span></td>
                                                }
                                               
                                                
                                            </tr>
                                           
                                            <tr>
                                                <th>Natural</th>
                                                {batchSummary.sexing=='yes'?
                                               
                                                 <td>
                                                    <b>Total:</b>  {batchSummary.natural} <span className="font10 redcolor">({batchSummary.naturalPercentage} %)</span> ,&nbsp;
                                                    <b>Male:</b> {batchSummary.totalMortality_male} <span className="font10 redcolor">({batchSummary.naturalPercentage_male} %)</span> ,&nbsp;
                                                    <b>Female:</b>  {batchSummary.totalMortality_female} <span className="font10 redcolor">({batchSummary.naturalPercentage_female} %)</span>
                                                    
                                                </td>
                                                :
                                                 <td>{batchSummary.natural}</td>
                                                }
                                                
                                            </tr>
                                            <tr>
                                             <th>Culling</th>
                                                {batchSummary.sexing=='yes'?
                                                <td>
                                                    <b>Total:</b>  {batchSummary.totalCulling} <span className="font10 redcolor">({batchSummary.cullingPercentage} %)</span>, &nbsp;
                                                    <b>Male:</b> {batchSummary.totalCulling_male} <span className="font10 redcolor">({batchSummary.cullingPercentage_male} %)</span>, &nbsp;
                                                    <b>Female:</b>  {batchSummary.totalCulling_female} <span className="font10 redcolor">({batchSummary.cullingPercentage_female} %)</span>
                                                   
                                                </td>
                                                :
                                                 <td>{batchSummary.totalCulling}  <span className="font10 redcolor">({batchSummary.cullingPercentage} %)</span></td>
                                                }
                                              
                                            </tr>
                                            <tr>
                                                <th>Total No. of Birds at Harvest</th>
                                                <td>{batchSummary.totalBirdsAtClose.toLocaleString()}</td>
                                                
                                            </tr>
                                            <tr>
                                                <th>Livability (%)</th>
                                                <td>{batchSummary.livability}</td>
                                                
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="row" id="summary">
                                    <div className="col-md-12"><h5>Batch Outcome</h5></div>
                                    <div class="col-lg-4 col-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h3>{batchSummary.totalWeight} Kg</h3>
                                                        <p className="outcomeText">Total Weight</p>
                                                    </div>
                                                    <div className="col-md-6" style={{textAlign: 'center'}}>
                                                        <MaterialIcon icon='scale' size={60} color={'#4f46e5'}></MaterialIcon>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div class="small-box bg-warning">
                                        <div class="inner">
                                            <h3>{batchSummary.totalWeight} Kg</h3>

                                            <p>Total Weight</p>
                                        </div>
                                        </div> */}
                                    </div>
                                    <div class="col-lg-4 col-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h3>{(batchSummary.feedWeight)} Kg</h3>
                                                        <p className="outcomeText">Total Feed</p>
                                                    </div>
                                                    <div className="col-md-6" style={{textAlign: 'center'}}>
                                                        <img src="/dist/img/sack.png" width="60"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div class="small-box bg-info">
                                        <div class="inner">
                                            <h3>{(batchSummary.feedWeight)} Kg</h3>
                                            <p>Total Feed</p>
                                        </div>
                                        </div> */}
                                        
                                    </div>
                                    <div class="col-lg-4 col-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h3>{batchSummary.avgchickweight} Kg</h3>
                                                        <p className="outcomeText">Avg. Bird Weight</p>
                                                    </div>
                                                    <div className="col-md-6" style={{textAlign: 'center'}}>
                                                        <img src="/dist/img/logo-colored.png" width="65"></img>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div class="small-box bg-danger">
                                        <div class="inner">
                                            <h3>{batchSummary.avgchickweight} Kg</h3>
                                            
                                            <p>Avg. Bird Weight</p>
                                        </div>
                                        </div> */}
                                    </div>
                                    <div class="col-lg-4 col-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h3>{isNaN(batchSummary.fcr)?0:batchSummary.fcr}</h3>
                                                            <p className="outcomeText">Feed Conversion Ratio(FCR)</p>
                                                          
                                                        </div>
                                                        <div className="col-md-6" style={{textAlign: 'center'}}>
                                                            <MaterialIcon icon='notes' size={60} color={'#4f46e5'}></MaterialIcon>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/* <div class="small-box bg-success">
                                        <div class="inner">
                                            <h3>{isNaN(batchSummary.fcr)?0:batchSummary.fcr}</h3>
                                            <p>Feed Conversion Ratio(FCR)</p>
                                        </div>
                                        </div> */}
                                    </div>
                                    <div class="col-lg-4 col-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h3>{Math.round(batchSummary.pef)}</h3>
                                                            <p className="outcomeText">Poultry Efficiency Factor (PEF)</p>
                                                        </div>
                                                        <div className="col-md-6" style={{textAlign: 'center'}}>
                                                            <MaterialIcon icon='description' size={60} color={'#4f46e5'}></MaterialIcon>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        {/* <div class="small-box bg-primary">
                                        <div class="inner">
                                            <h3>{Math.round(batchSummary.pef)}</h3>
                                            <p>Poultry Efficiency Factor (PEF)</p>
                                        </div>
                                        </div> */}
                                    </div>
                                </div>
                            </Tab>
                            <Tab label='Plots'>
                            <div class="row mb-2">
                                <div className="col-md-12">
                                <h6 className="text-center">Selected Date: {selectedDate}, Phase: {phaseID}</h6>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header border-0">
                                            <div className="d-flex justify-content-between">
                                                
                                                <h3 className="card-title">Temperature: &nbsp;
                                                <strong>Min: </strong> {dashboardValues.mintemp} &nbsp;
                                                        <strong>Max: </strong> {dashboardValues.maxtemp} &nbsp;
                                                        <strong>Avg: </strong> {dashboardValues.avgtemp} &nbsp;
                                                </h3>
                                                
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                                            <EchartLine data={tempState} xaxis={xData} maxVal='50' color='#17a2b8' interval= {5} 
                                            max={thresholds.length>0? thresholds[0].tempMax: 0} min= {thresholds.length>0? thresholds[0].tempMin: 0}></EchartLine>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header border-0">
                                            <div className="d-flex justify-content-between">
                                                <h3 className="card-title">Relative Humidity: &nbsp;
                                                <strong>Min: </strong> {dashboardValues.minrh} &nbsp;
                                                        <strong>Max: </strong> {dashboardValues.maxrh} &nbsp;
                                                        <strong>Avg: </strong> {dashboardValues.avgrh} &nbsp;
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                                                <EchartLine data={rhState} xaxis={xData} maxVal='110' color='#dc3545' interval={10} max={thresholds.length>0? thresholds[0].rhMax: 0} min= {thresholds.length>0? thresholds[0].rhMin: 0}></EchartLine>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header border-0">
                                            <div className="d-flex justify-content-between">
                                                
                                                
                                                <h3 className="card-title">CO<sub>2</sub>: &nbsp;
                                                <strong>Min: </strong> {dashboardValues.minco} &nbsp;
                                                        <strong>Max: </strong> {dashboardValues.maxco} &nbsp;
                                                        <strong>Avg: </strong> {dashboardValues.avgco} &nbsp;
                                                </h3>
                                                    
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                                            <EchartLine data={coState} xaxis={xData} maxVal='3500' color='#28a745' interval={500} max={thresholds.length>0? thresholds[0].coMax: 0} min='null'></EchartLine>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header border-0">
                                            <div className="d-flex justify-content-between">
                                                
                                            
                                                <h3 className="card-title">NH<sub>3</sub>: &nbsp;
                                                <strong>Min: </strong> {dashboardValues.minnh} &nbsp;
                                                        <strong>Max: </strong> {dashboardValues.maxnh} &nbsp;
                                                        <strong>Avg: </strong> {dashboardValues.avgnh} &nbsp;
                                                </h3>
                                                
                                                    
                                            </div>
                                        </div>
                                        <div className="card-body nh">
                                            <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                                            <EchartLine data={nhState} xaxis={xData} maxVal='30' color='#ffc107' interval={5} max={thresholds.length>0? thresholds[0].nhMax: 0} min='null'></EchartLine>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </Tab>
                            
                            <Tab label="Batch Accounting" disabled = {role===Role.Admin || role===Role.Farmer ? false: true}>
                                <BatchAccounting key = {Math.random()} expenses ={ expensesData.length>0?expensesData:Array(1).fill(
                                    {
                                        item:'',
                                        units: '',
                                        rate: '',
                                        amount: 0
                                    }
                                ) } 
                                accumaltedWeight =  {accumaltedWeight} 
                                rate={rate} 
                                revenue = {rate*accumaltedWeight} 
                                batchID={batchID} 
                                farmID={activeFarm}
                                totalIncome = {(rate*accumaltedWeight) - totalAmount}
                                baccStatus = {baccStatus}
                                >
                                </BatchAccounting>
                            </Tab>
                            
                            </Tabs>
                            :""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}
const Results = (props) =>{
    let error, classes;
    if(props.error === false) {
        error = 'Success';
        classes = 'alert alert-success alert-dismissible fade show'
    } else {
        error = 'Error!';
        classes = 'alert alert-danger alert-dismissible fade show'
    }
    return(
       <div className="results">
            <div className={classes}>
                <strong>{error}</strong> {props.message}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
       </div>
    );
}
export default BatchOperations;