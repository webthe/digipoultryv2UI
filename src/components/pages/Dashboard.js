import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import EchartLine from '../dashboard/echart';
import MaterialIcon, { colorPalette } from 'material-icons-react';
import { env } from './const';
import { useLoading, Bars, ThreeDots } from '@agney/react-loading';
import { faLineChart } from "@fortawesome/free-solid-svg-icons";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import moment from 'moment-timezone';
import { getRole, headers, watermeter, controls } from '../utils/common';
import { getUserName } from '../utils/common';
import DeviceConnections from "./DeviceConnections";
import * as apiInstance from '../utils/axiosinstace';
import { Role } from "../utils/role";

//import 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import 'select2';

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [role, seRole] = useState(getRole());
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [headersobj] = useState(headers());
  const [tempState, setTempState] = useState([]);

  const [xData, setXData] = useState([]);
  const [rhState, setRHState] = useState([]);
  const [coState, setCOState] = useState([]);
  const [nhState, setNHState] = useState([]);

  const [batchStatus, setBatchStatus] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  let today = moment().tz('Asia/Singapore').format("YYYY-MM-DD");
  const initial_dbvals = {
    "mintemp": 0,
    "maxtemp": 0,
    "avgtemp": 0,
    "maxrh": 0,
    "minrh": 0,
    "avgrh": 0,
    "maxco": 0,
    "minco": 0,
    "avgco": 0,
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
  const [phaseNumber, setPhaseNumber] = useState(0);
  const [currDay, setCurrDay] = useState(0);
  const [dashboardValues, setDashboardValues] = useState(initial_dbvals);
  const [currValues, setCurrValues] = useState(initial_currvals);
  const [thresholds, setThresholds] = useState(
    {
      "tempMin": 22,
      "tempMax": 32,
      "rhMin": 50,
      "rhMax": 70,
      "coMin": 0,
      "coMax": 2500,
      "nhMin": 0,
      "nhMax": 15
  }
  );
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [addWeigtFeedStatus, setAddWeigtFeedStatus] = useState({});
  const [deviceID, setDeviceID] = useState('');
  const [signalStrength, setSignalStrength] = useState(0);
  const [sexing, setSexing] = useState('no');
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [batchWeights, setBatchWeights] = useState({
    "weight": 0, "feed": 0, "mortality": 0, "idealweight": 0,
    "weightStatus": false, "feedStatus": false, "mortalityStatus": false,
    "numberofBirds": 0, "numberofLiveBirds": 0
  });

  const [waterConsumptiomn, setWaterConsumption] = useState({
    "today": 0,
    "lastHr": 0,
    "total": 0,
    "perBird_today": 0,
    "perBird_total": 0
  });

  const [farmData, setFarmData] = useState([]);
  const [fanInfo, setFanInfo] = useState([]);
  const signals = useRef(() => { });
  const devID = useRef('');
  function defaultValues() {
    setDashboardValues(prevState => {
      return { ...prevState, ...initial_dbvals };
    });
    setCurrValues(prevState => {
      return { ...prevState, ...initial_currvals };
    });
    setDeviceID('');
    setTempState([]);
    setXData([]);
    setRHState([]);
    setCOState([]);
    setNHState([]);
    setThresholds({
      tempMin: 22,
      tempMax: 32,
      rhMin: 50,
      rhMax: 70,
      coMin: 0,
      coMax: 2500,
      nhMin: 0,
      nhMax: 15
  });
    setPhaseNumber(0);
    setCurrDay(0);
    setBreedName('');
    setLastUpdatedat('');
    setBatchStatus('');
    setBatchStatus();
    setSignalStrength(0);
    setSignalStatus('gray');
    setFanInfo([]);
    setSexing('');
    setMale('');
    setFemale('');
    setWaterConsumption({
      "today": 0,
      "lastHr": 0,
      "total": 0,
      "perBird_today": 0,
      "perBird_total": 0
    });
    setBatchWeights({
      "weight": 0, "feed": 0, "mortality": 0, "idealweight": 0,
      "weightStatus": false, "feedStatus": false, "mortalityStatus": false,
      "numberofLiveBirds": 0
    })
  }
  const [breedName, setBreedName] = useState('');
  const [lastUpdated, setLastUpdatedat] = useState('');
  const fetchValues = useRef(() => { });
  const [currentDay, setCurrentDay] = useState('');
  fetchValues.current = async (farmID) => {
    let fid = '';
    
    if (farmID !== undefined) {
      fid = farmID;
    } else {
      fid = selectedFarm;
    }
    if (fid == undefined) {
      return
    }

    setShowLoader(true);
    const response = await apiInstance.getDashBoardValues(fid, today);
    try {
      const values = response;
      setShowLoader(false);
        devID.current = values.deviceID;
        signals.current();
        //alert(JSON.stringify(values))
        setCurrDay(values.day);
        setCurrentDay(values.currentDay);
        setBreedName(values.breed);
        setSexing(values.sexing);
        setMale(values.male);
        setFemale(values.female);
        setLastUpdatedat(values.lastUpdated);
        setPhaseNumber(values.phaseID);
        setTempState(values.chartData.tempData);
        setXData(values.chartData.xData);
        setRHState(values.chartData.rhData);
        setCOState(values.chartData.coData);
        setNHState(values.chartData.nhData);
        
        if(values.getMinMax.length >0) {
          setThresholds(values.getMinMax[0]);
        }
       
        setBatchWeights(values.chickWeightFeed);
        setWaterConsumption(values.waterConsumption);
        setFanInfo(values.fanInfo);
        if (values.dashboardValues.length > 0) {
          setDashboardValues(prevState => {
            return { ...prevState, ...values.dashboardValues[0] };
          });

        } else {
          setDashboardValues(prevState => {
            return { ...prevState, ...initial_dbvals };
          });
        }
        if (values.currValues.length > 0) {
          setCurrValues(prevState => {
            return { ...prevState, ...values.currValues[0] };
          });
        } else {
          setCurrValues(prevState => {
            return { ...prevState, ...initial_currvals };
          });
        }
      
      if (values.batchExceeded) {
        setCurrDay(0);
        setPhaseNumber(0);
        setBatchStatus('Batch exceeded duration');
        // devID.current = '';
        // setSignalStatus('gray');
        // devID.current = '';
        //defaultValues();
      } else {
        setBatchStatus('');
      }
    } catch (err) {
      setShowLoader(false);
      console.log(err.message);
      devID.current = '';
      defaultValues();
    }
    // axios.get(env.produrl+'/dashboard/'+fid+'/'+today, { headers: headersobj })
    // .then(res=>{
    //    console.log(res.data);
    //    setShowLoader(false);
    //    if(!res.data.batchExceeded) {
    //    devID.current = res.data.deviceID;
    //    signals.current();
    //    setCurrDay(res.data.day);
    //    setCurrentDay(res.data.currentDay);
    //    setBreedName(res.data.breed);
    //    setSexing(res.data.sexing);
    //    setMale(res.data.male);
    //    setFemale(res.data.female);
    //    setLastUpdatedat(res.data.lastUpdated);
    //    setPhaseNumber(res.data.phaseID);
    //    setTempState(res.data.chartData.tempData);
    //    setXData(res.data.chartData.xData);
    //    setRHState(res.data.chartData.rhData);
    //    setCOState(res.data.chartData.coData);
    //    setNHState(res.data.chartData.nhData);
    //    setThresholds(res.data.getMinMax);
    //    console.log(JSON.stringify(res.data.chickWeightFeed));
    //    console.log(JSON.stringify(res.data.dashboardValues))
    //    setBatchWeights(res.data.chickWeightFeed);
    //    setWaterConsumption(res.data.waterConsumption);
    //    setFanInfo(res.data.fanInfo);
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
    //     setBatchStatus('');
    // } else {
    //     setCurrDay(0);
    //     setPhaseNumber(0);
    //     setBatchStatus('Batch exceeded duration');

    //     devID.current = '';
    //     setSignalStatus('gray');
    //     devID.current = '';
    //     defaultValues();
    // }

    // }).catch((err) =>{
    //     setShowLoader(false);
    //      console.log(err.message);
    //      devID.current = '';
    //      defaultValues();
    // });
  }
  const [signalStatus, setSignalStatus] = useState('red');

  signals.current = async () => {
    try {
      const response = await apiInstance.getSignalData(devID.current);
      const _signalStrength = Math.abs(response.data.signalstrength);
      //alert(_signalStrength)
      setSignalStrength(_signalStrength);
      if (response.data.status === false) {
        setSignalStrength(0);
        setSignalStatus('gray');
        return;
      }

      if (_signalStrength === 0) {
        setSignalStatus('gray');
      } else if (_signalStrength <= 85) {
        setSignalStatus('green');
      } else if (_signalStrength > 85 && _signalStrength < 95) {
       // alert('Yellow')
        setSignalStatus('yellow');
      } else {
        setSignalStatus('red');
      }
    } catch (err) {
      // setError(err.message || 'An error occurred while adding the barn.');
      setSignalStrength(0);
      setSignalStatus('gray');
      console.log(err.message);
    } finally {
      // setLoading(false);
    }
  }

  useEffect(() => {

    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview('init');

    setInterval(() => {
      signals.current();
    }, 3 * 60 * 1000);

    setInterval(() => {
      fetchValues.current(undefined);
    }, 5 * 60 * 1000);

    axios.get(env.produrl + '/misc/listoffarmsDashboard/' + getUserName(), { headers: headersobj })
      .then(res => {
        setFarmData(res.data.list)
        if (res.data.list.length > 0 && selectedFarm == null) {
          setSelectedFarm(res.data.list[0].farmID);
          fetchValues.current(res.data.list[0].farmID);
        }
      }).catch((err) => {
        console.log(err.message);
      });

  }, [headersobj, fetchValues, signalStatus, selectedFarm])

  const onChangeHandler = (selectedItem) => {
    //alert('Hiii')
    setSelectedFarm(selectedItem);
    fetchValues.current(selectedItem)
  }
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Bars width="22" color="#333" />,
  })
  const percentage = (value, total) => (value / total) * 100;
  useEffect(() => {
    console.log("Initializing Select2");
    const select2 = $('#mySelect2').select2();
    select2.on('select2:select', (event) => {
      //alert(event.params.data.id);
      //console.log("Select2 option selected:", event.params.data.id);
      onChangeHandler(event.params.data.id)
    });
  
    return () => {
      console.log("Destroying Select2");
      select2.select2('destroy');
    };
  }, []);
  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-4 pull-right">
          <div className="row">
            <div className="col-md-4">
              <h6 style={{ marginTop: 3, marginBottom: 0, fontWeight: '700' }}>Filter by Farm: </h6>
            </div>
            <div className="col-md-7">

              <select onChange={onChangeHandler}
                style={{ width: "100%" }} id="mySelect2"
                className="form-control form-control-sm">
                {farmData.map(item => (
                  <option
                    key={item.farmID}
                    value={item.farmID}

                  >
                    {item.farmName}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-1'>
              {showLoader ?
                <section {...containerProps} style={{ "margin-top": "0px" }}>
                  {indicatorEl} {/* renders only while loading */}
                </section> : ""
              }
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <ul className="lastUpdated">
            {/* <li>
                <a className="refresh" title="Click here to refresh"><MaterialIcon icon="refresh" color={'#00933b'} size={24} /></a>
              </li> */}
            <li key={Math.random()}><span style={{ fontWeight: 700 }}>Last Updated at: </span>{lastUpdated === 'Invalid date' ? '' : lastUpdated}</li>
          </ul>
        </div>
        <div className="col-md-5 phaseDetails">
          <h6>
            <span className="purpleText">Batch: </span>  {batchWeights.batchName} &nbsp;
            <span className="purpleText">Bird Type: </span> {breedName} &nbsp;
            <span className="purpleText">Day: </span> {currentDay} &nbsp;
            <span className="purpleText">Phase: </span>  {phaseNumber} &nbsp;
            <br></br>
            <span className="redcolor">{batchStatus} &nbsp;&nbsp;</span>
            <span className="purpleText">Signal: </span>
            <span class="signal">-{signalStrength} dBm <span className={`${signalStatus}`}><i class="fa fa-wifi" aria-hidden="true"></i></span></span> &nbsp;

          </h6>
        </div>
      </div>
      <section className="tabsArea">
        <Tabs activeHeaderStyle={{ background: 'transparent' }}>
          <Tab label="Barn Monitor">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/celsius.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">Temperature</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {/* <h6>Temperature</h6> */}
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="highLevelreadings">
                              <li className="currentReading">{currValues.temp} °C</li>
                              <li>
                                <span>Day Min: </span> {dashboardValues.mintemp} °C
                              </li>
                              <li>
                                <span>Day Max: </span> {dashboardValues.maxtemp} °C
                              </li>
                            </ul>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/ammonia.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">Ammonia</div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="highLevelreadings">
                              <li className="currentReading">{currValues.nh}</li>
                              <li>
                                <span>Day Min: </span> {dashboardValues.minnh}
                              </li>
                              <li>
                                <span>Day Max: </span> {dashboardValues.maxnh}
                              </li>
                            </ul>
                          </div>
                          {/* <div className="col-md-5 imgHolder" >
                                        <img src="/dist/img/ammonia.png" width="70"></img>
                                    </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/humidity.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">Humidity</div>
                        </div>
                      </div>
                      <div className="card-body">

                        <div className="row">
                          <div className="col-md-12">
                            <ul className="highLevelreadings">
                              <li className="currentReading">{currValues.rh}%</li>
                              <li>
                                <span>Day Min: </span> {dashboardValues.minrh}%
                              </li>
                              <li>
                                <span>Day Max: </span> {dashboardValues.maxrh}%
                              </li>
                            </ul>
                          </div>
                          {/* <div className="col-md-5 imgHolder" >
                                        <img src="/dist/img/humidity.png" width="70"></img>
                                    </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/co2-cloud.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">CO2</div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="highLevelreadings">
                              <li className="currentReading">{currValues.co}</li>
                              <li>
                                <span>Day Min: </span> {dashboardValues.minco}
                              </li>
                              <li>
                                <span>Day Max: </span> {dashboardValues.maxco}
                              </li>
                            </ul>
                          </div>
                          {/* <div className="col-md-5 imgHolder" >
                                        <img src="/dist/img/co2-cloud.png" width="70"></img>
                                    </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row batchops">
                  <div className={sexing == 'yes' ? 'col-md-5' : 'col-md-6'}>
                    <div className="card section2">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/waterdrops.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">Water Consumption</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {/* <h6>
                            <img src="/dist/img/weighingscale.png" width="24"></img>&nbsp;
                              Bird Weight</h6> */}
                        {
                          watermeter() == 0 ?
                            <div className="waterMeterMessage" style={{ marginTop: 0, marginBottom: 0 }} role="alert">
                              <img src="/dist/img/lock.png" width={30}></img>
                              "Available in pro version, please contact administrator to activate"
                            </div>
                            : ''
                        }
                        <ul className="rightWidgetsData">
                          <li><span>Batch: </span>{waterConsumptiomn.total}</li>
                          <li><span>Today: </span>{waterConsumptiomn.today}</li>
                          <li><span>Last Hour: </span>{waterConsumptiomn.lastHr}</li>
                          <li><span>Per Bird<span className="font12">(Batch)</span>: </span>{waterConsumptiomn.perBird_total === 0 ? 'NA' : waterConsumptiomn.perBird_total}</li>
                          <li><span>Per Bird<span className="font12">(Today)</span>: </span>{waterConsumptiomn.perBird_today === 0 ? 'NA' : waterConsumptiomn.perBird_today}</li>
                        </ul>
                        <a href="#" className="moreBtn">More Details</a>
                      </div>
                    </div>
                  </div>
                  <div className={sexing == 'yes' ? 'col-md-7' : 'col-md-6'}>
                    <div className="card section2">
                      <div className="cardHeader row">
                        <div className="col-md-3">
                          <div className="heading-img">
                            <img src="/dist/img/chick.png"></img>
                          </div>
                        </div>
                        <div className="col-md-9">
                          <div className="heading-bg">Mortality</div>
                        </div>
                      </div>
                      <div className="card-body">
                        {/* <h6>
                            <img src="/dist/img/chick.png" width="24"></img>&nbsp;
                              Mortality</h6> */}
                        {sexing == 'no' ?
                          <ul className="rightWidgetsData">
                            <li><span>Birds at Start: </span>{batchWeights.numberofBirds}</li>
                            <li><span>Current Count: </span>{batchWeights.numberofLiveBirds}</li>
                            <li><span>Total Mortality: </span>{batchWeights.mortality} <span className="redcolor font12">({batchWeights.mortalityPercentage}%)</span></li>
                            {/* <span className="seperator"></span> */}
                            <li><span className="pad15">Natural: </span>{batchWeights.natural} <span className="redcolor font12">({batchWeights.natural_percentage}%)</span></li>
                            <li><span className="pad15">Culling: </span>{batchWeights.culling} <span className="redcolor font12">({batchWeights.culling_percentage}%)</span></li>
                            
                          </ul>
                          :
                          <>
                            <div className="row">
                              <div className="col-md-6">
                                <b>Bird Count</b>
                              </div>
                              <div className="col-md-6" style={{ textAlign: 'right' }}>
                                <b>{batchWeights.numberofLiveBirds}/{batchWeights.numberofBirds}&nbsp;
                                  {/* <span className="redcolor">({batchWeights.mortalityPercentage})%</span> */}
                                </b>
                              </div>
                            </div>

                            <div className="row subCount" style={{ marginTop: 10 }}>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-5" style={{ color: '#3d6db5' }}><b>Male: </b></div>
                                  <div className="col-md-7" style={{ textAlign: 'right', fontSize: 11 }}><b>{(male - batchWeights.mortality_male).toLocaleString()}/{male.toLocaleString()} </b></div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-5" style={{ color: '#009ec3' }}><b>Female:</b></div>
                                  <div className="col-md-7" style={{ textAlign: 'right', fontSize: 11 }}><b>{(female - batchWeights.mortality_female).toLocaleString()}/{female.toLocaleString()} </b></div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-md-6">
                                    <b>Current</b>
                                </div>
                                <div className="col-md-6" style={{textAlign: 'right'}}>
                                    <b>{batchWeights.numberofLiveBirds.toLocaleString()}</b>
                                </div>
                              </div> */}
                            {/* <div className="row subCount">
                                <div className="col-md-6">
                                  <div className="row">
                                    <div className="col-md-6" style={{ color:'#3d6db5'}}><b>Male: </b></div>
                                    <div className="col-md-6" style={{textAlign: 'right'}}><b>{(male-batchWeights.mortality_male).toLocaleString()}</b></div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="row">
                                    <div className="col-md-6" style={{ color:'#009ec3'}}><b>Female:</b></div>
                                    <div className="col-md-6" style={{textAlign: 'right'}}><b>{(female-batchWeights.mortality_female).toLocaleString()}</b></div>
                                  </div>
                                </div>
                              </div> */}
                            <div className="row" style={{ marginBottom: 15, marginTop: 15 }}>
                              <div className="col-md-6">
                                <b>Mortality</b>
                              </div>
                              <div className="col-md-6" style={{ textAlign: 'right' }}>
                                <b>{batchWeights.mortality} &nbsp; <span className="redcolor" style={{ fontSize: 11 }}>({batchWeights.mortalityPercentage}%)</span></b>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-md-6" style={{ fontSize: 12, marginTop: 0 }}>
                                <b>Natural</b>
                              </div>
                              <div className="col-md-6" style={{ textAlign: 'right', fontSize: 12 }}>
                                <b>{batchWeights.natural} &nbsp; <span className="red" style={{ fontSize: 11 }}>({batchWeights.natural_percentage}%)</span></b>
                              </div>
                            </div>
                            <div className="row subCount" style={{ marginTop: 10 }}>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6" style={{ color: '#3d6db5' }}><b>Male: </b></div>
                                  <div className="col-md-6" style={{ textAlign: 'right', fontSize: 11 }}><b>{isNaN(batchWeights.mortality_male) ? 0 : batchWeights.mortality_male}<br></br></b> <span className="redcolor">({batchWeights.mortality_male == 0 ? 0 : ((batchWeights.mortality_male / male) * 100).toFixed(2)}%)</span></div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6" style={{ color: '#009ec3' }}><b>Female:</b></div>
                                  <div className="col-md-6" style={{ textAlign: 'right', fontSize: 11 }}><b>{isNaN(batchWeights.mortality_female) ? 0 : batchWeights.mortality_female} <br></br></b><span className="redcolor">({batchWeights.mortality_female == 0 ? 0 : ((batchWeights.mortality_female / female) * 100).toFixed(2)}%)</span></div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6" style={{ fontSize: 12 }}>
                                <b>Culling</b>
                              </div>
                              <div className="col-md-6" style={{ textAlign: 'right', fontSize: 12 }}>
                                <b>{batchWeights.culling} &nbsp;<span className="red">({batchWeights.culling_percentage}%)</span>  </b>
                              </div>
                            </div>
                            <div className="row subCount" style={{ border: 0, paddingBottom: 0, marginBottom: 0 }}>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6" style={{ color: '#3d6db5' }}><b>Male: </b></div>
                                  <div className="col-md-6" style={{ textAlign: 'right', fontSize: 11 }}><b>{isNaN(batchWeights.culling_male) ? 0 : batchWeights.culling_male}<br></br></b> <span className="redcolor">({batchWeights.culling_male_percentage}%)</span></div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6" style={{ color: '#009ec3' }}><b>Female:</b></div>
                                  <div className="col-md-6" style={{ textAlign: 'right', fontSize: 11 }}><b>{isNaN(batchWeights.culling_female) ? 0 : batchWeights.culling_female} <br></br></b><span className="redcolor">({batchWeights.culling_female_percentage}%)</span></div>
                                </div>
                              </div>
                            </div>
                          </>
                        }
                        <a href="#" className="moreBtn">More Details</a>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>
                            <img src="/dist/img/feed.png" width="24"></img> &nbsp;
                              Feed</h6>
                              <ul className="rightWidgetsData">
                                <li><span>Batch: </span>18,450 Kg</li>
                                <li><span>Today: </span>1,250 Kg</li>
                                <li><span>Per Bird<span className="font12">(Batch)</span>: </span>1.97 Kg</li>
                                <li><span>Per Bird<span className="font12">(Today)</span>: </span>0.10 Kg</li>
                              </ul>
                              <a href="#" className="moreBtn">More Details</a>
                          </div>
                        </div>
                      </div> */}
                </div>
              </div>
            </div>
            <section className="area2">
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card cardHeight">
                        <div className="cardHeader row">
                          <div className="col-md-3">
                            <div className="heading-img">
                              <img src="/dist/img/weighingscale.png"></img>
                            </div>
                          </div>
                          <div className="col-md-9">
                            <div className="heading-bg">Bird Weight</div>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* <h6>
                              <img src="/dist/img/weighingscale.png" width="24"></img>&nbsp;
                                Bird Weight</h6> */}
                          <ul className="rightWidgetsData">
                            {
                              sexing == 'yes' ?
                                <>
                                  <li><span>Ideal (Male): </span>{batchWeights.idealweight_male} Kg</li>
                                  <li><span>Today (Male): </span> {batchWeights.chickWeight_male_status ? batchWeights.chickWeight_male + ' Kg' : <span className="redcolor">Not Entered</span>}</li>
                                  <li><span>Ideal (Female): </span>{batchWeights.idealweight_female} Kg</li>
                                  <li><span>Today (Female): </span> {batchWeights.chickWeight_female_status ? batchWeights.chickWeight_female + ' Kg' : <span className="redcolor">Not Entered</span>}</li>
                                  {/* <li><span>Last Recorded: </span>{batchWeights.lastUpdatedWeight==''|| batchWeights.lastUpdatedWeight == undefined ?0:batchWeights.lastUpdatedWeight} Kg</li> */}
                                  {/* <li><span>{batchWeights.lastUpdatedWeightDate==undefined?'':'('+batchWeights.lastUpdatedWeightDate+')'}</span></li> */}
                                </> :

                                <>
                                  <li><span>Ideal Weight: </span>{batchWeights.idealweight} Kg</li>
                                  <li><span>Today: </span> {batchWeights.weightStatus ? batchWeights.weight + ' Kg' : <span className="redcolor">Not Entered</span>}</li>
                                  <li><span>Last Recorded: </span>{batchWeights.lastUpdatedWeight == '' || batchWeights.lastUpdatedWeight == undefined ? 0 : batchWeights.lastUpdatedWeight} Kg</li>
                                  <li><span>{batchWeights.lastUpdatedWeightDate == undefined ? '' : '(' + batchWeights.lastUpdatedWeightDate + ')'}</span></li>
                                </>
                            }

                          </ul>
                          <a href="#" className="moreBtn">More Details</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card cardHeight">
                        <div className="cardHeader row">
                          <div className="col-md-3">
                            <div className="heading-img">
                              <img src="/dist/img/feed.png"></img>
                            </div>
                          </div>
                          <div className="col-md-9">
                            <div className="heading-bg">Feed</div>
                          </div>
                        </div>
                        <div className="card-body">

                          <ul className="rightWidgetsData">
                            <li><span>Batch: </span>{batchWeights.feed} Kg</li>
                            <li><span>Today: </span>{batchWeights.feedStatus ? batchWeights.feedToday + ' Kg' : <span className="redcolor">Not Entered</span>}</li>
                            <li><span>Per Bird<span className="font12">(Batch)</span>: </span>{batchWeights.perBird_batch == '' || batchWeights.perBird_batch == undefined ? 0 : batchWeights.perBird_batch} Kg</li>
                            <li><span>Per Bird<span className="font12">(Today)</span>: </span>{batchWeights.perBird_today == '' || batchWeights.perBird_today == undefined ? 0 : batchWeights.perBird_today} Kg</li>
                          </ul>
                          <a href="#" className="moreBtn">More Details</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="cardHeader row">
                      <div className="col-md-2">
                        <div className="heading-img">
                          <img src="/dist/img/fan.png" className="fanicon"></img>
                        </div>
                      </div>
                      <div className="col-md-10">
                        <div className="heading-bg">
                          <div className="title">Exhaust Fans</div>
                          {controls() == 1 ? (
                            <NavLink
                              exact
                              to={{
                                pathname: "/managefans",
                                farmID: selectedFarm
                              }}
                              className="rightButton"
                            >
                              Manage Fans
                            </NavLink>
                          ) : (
                            <div className="rightButton" style={{ cursor: 'not-allowed' }}>
                              Manage Fans
                            </div>
                          )}

                          <div className="clear"></div>
                        </div>

                      </div>
                    </div>
                    <div className="card-body">
                      {/* <h6>Ventilation Fans</h6> */}
                      {
                        controls() == 0 ?

                          <div className="waterMeterMessage" role="alert">
                            <img src="/dist/img/lock.png" width={30}></img>
                            "Available in pro version, please contact administrator to activate"
                          </div>
                          : ''
                      }
                      {
                        controls() == 1 && fanInfo.length === 0 ?
                          <div className="faninfo_errMsg">No Fans information found</div> : ''
                      }
                      <ul className="fans">
                        {fanInfo.map((item, index) => (
                          <li>
                            {item.swtichStatus === 'ACTIVE' ?
                              <img className='rotating' src="/dist/img/fan.png"></img>
                              : <img src="/dist/img/fan_grey.png"></img>}
                            <div className="fan-number">Fan {index + 1} {item.switchStatus}</div>
                          </li>
                        ))}
                      </ul>
                      <a href="#" className="moreBtn manageBtn">Manage</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Tab>
          <Tab label="Today's Trends">
            <div className="chartArea row clearfix">
              <section className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h6><span><img src="/dist/img/celsius.png" width="24"></img></span>&nbsp;&nbsp;
                      Temperature
                      <ul className="dayReadings">
                        <li>Current: <span className="text-bg">{currValues.temp} °C</span></li>
                        <li>Min: <span className="text-bg green-bg">{dashboardValues.mintemp} °C</span></li>
                        <li>Max: <span className="text-bg orange-bg">{dashboardValues.maxtemp} °C</span></li>
                      </ul>
                    </h6>
                    <div className="card-tools"></div>
                  </div>
                  <div className="card-body">
                    <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                      <EchartLine data={tempState} xaxis={xData} maxVal='50' color='#4f46e5' interval={5}
                        max={thresholds.tempMax} min={thresholds.tempMin}></EchartLine>
                    </div>
                  </div>
                </div>
              </section>
              <section className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h6>
                      <span><img src="/dist/img/humidity.png" width="24"></img></span>&nbsp;&nbsp; Humidity
                      <ul className="dayReadings">
                        <li>Current: <span className="text-bg">{currValues.rh}%</span></li>
                        <li>Min: <span className="text-bg green-bg">{dashboardValues.minrh}% </span></li>
                        <li>Max: <span className="text-bg orange-bg">{dashboardValues.maxrh}%</span></li>
                      </ul>
                    </h6>
                  </div>
                  <div className="card-body">

                    <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                      <EchartLine data={rhState} xaxis={xData} maxVal='110' color='#4f46e5'
                        interval={10} max={thresholds.rhMax} min={thresholds.rhMin}></EchartLine>
                    </div>
                  </div>
                </div>
              </section>
              <section className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h6><span><img src="/dist/img/co2-cloud.png" width="24"></img></span>&nbsp;&nbsp; CO2
                      <ul className="dayReadings">
                        <li>Current: <span className="text-bg">{currValues.co}</span></li>
                        <li>Min: <span className="text-bg green-bg">{dashboardValues.minco}</span></li>
                        <li>Max: <span className="text-bg orange-bg">{dashboardValues.maxco}</span></li>
                      </ul>
                    </h6>
                    <div className="card-tools"></div>
                  </div>
                  <div className="card-body">
                    <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                      <EchartLine data={coState} xaxis={xData}
                        maxVal={3500} color='#4f46e5' interval={500}
                        max={thresholds.coMax} min='null'></EchartLine>
                    </div>

                  </div>
                </div>
              </section>
              <section className="col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h6><span><img src="/dist/img/ammonia.png" width="24"></img></span>&nbsp;&nbsp; Ammonia
                      <ul className="dayReadings">
                        <li>Current: <span className="text-bg">{currValues.nh}</span></li>
                        <li>Min: <span className="text-bg green-bg">{dashboardValues.minnh}</span></li>
                        <li>Max: <span className="text-bg orange-bg">{dashboardValues.maxnh}</span></li>
                      </ul>
                    </h6>
                    <div className="card-tools"></div>
                  </div>
                  <div className="card-body">
                    <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                      <EchartLine data={nhState} xaxis={xData}
                        maxVal={30} color='#4f46e5' interval={5} max={thresholds.nhMax } min='null'></EchartLine>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Tab>
          {
            role == Role.Admin ?

              <Tab label="Device Connections">
                <DeviceConnections></DeviceConnections>
              </Tab>
              : <></>
          }
        </Tabs>
      </section>

    </div>
  );
};
export default Dashboard;
