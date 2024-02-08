import React, { useEffect, useState, useRef } from 'react';

import moment from 'moment';
import axios from 'axios';
import { env } from './const';
import { headers, watermeter } from '../utils/common';
import EchartLineWater from "../dashboard/echartWater";
import DataTable from "react-data-table-component";
const WaterConsumption = (props) => {
    const [headersobj] = useState(headers());
    const [dayStart, setDayStart] = useState('');
    const [current, setCurrent] = useState('');
    const [consumption, setConsumption] = useState('');
    const [waterPerBird, setWaterPerBird] = useState('');
    const [feedToday, setFeedToday] = useState('');
    const [watertoFeedRatio, setWatertoFeedRatio] = useState('');
    const [xaxis, setXaxis] = useState([]);
    const [yaxis, setYaxis] = useState([]);
    const [tableDate, setTableData] = useState([]);
    const overlayStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',  // This provides the opacity effect
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '1.5em',
        zIndex: 10,  // This makes sure the overlay is on top of other content
        
      };
    const columns = [
        {
          name: "Hour",
          selector: "hour_part",
          sortable: true,
         
        },
      
        {
            name: "Consumption",
            selector: "aggregated_value",
            sortable: true,
           
        },
        {
            name: "Reading",
            selector: "totalRateHr",
            sortable: true,
           
        },
       
      ];
    useEffect(() => {
       
        axios.get(env.produrl+'/batchOperations/watermeterreadings/'+props.batchID+'/'+props.selectedDate, { headers: headersobj })
        .then(res=>{
            setDayStart(res.data.data.dayStart);
            setCurrent(res.data.data.current);
            setConsumption(res.data.data.consumption);
            setWaterPerBird(res.data.data.waterPerBird);
            setFeedToday(res.data.data.feedToday)
            setWatertoFeedRatio(res.data.data.watertoFeedRatio);
            setTableData(res.data.hourlyConsumption);
            setXaxis(res.data.hourlyConsumption.map((item)=>item.hour_part))
            setYaxis(res.data.hourlyConsumption.map((item)=>item.aggregated_value))
        }).catch((err) =>{
             console.log(err.message);
        });
    },[]);
    return (
        <div className="WaterConsumption">
             
            <div className="row">
                <div className="col-md-12">
                    <h6 className="text-center">Selected Date: {props.selectedDate}, Phase: {props.phaseID}</h6>
                </div>
            </div>
           <div style={{position: 'relative'}}>
               
                {
                    watermeter()==0?
                        <div style={overlayStyles}>
                            <div className="" role="alert" style={{color: '#000'}}>
                            <img src="/dist/img/lock.png" width="65" class="center-image"></img>
                                "Available in pro version, please contact administrator to activate"
                            </div>
                        </div>
                        :''
                }
           
            <div className="row">
           
                <div class="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row waterMeter-widget">
                                <h3 className="col-md-12">Water Meter (L)</h3>
                                <div className="col-md-6">

                                    <p><strong>Day Start: </strong>{dayStart}</p>
                                    <p><strong>Current: </strong>{current}</p>
                                    <p><strong>Consumption today: </strong>{consumption}</p>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'center' }}>
                                    <img src="/dist/img/water.png" width="65"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row waterMeter-widget">
                                <h3 className="col-md-12">Water per Bird</h3>
                                <div className="col-md-6">
                                    <p><strong>Day Start: </strong>{dayStart}</p>
                                    <p className="bigText">{waterPerBird} ml</p>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'center' }}>
                                    <img src="/dist/img/logo-colored.png" width="65"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="row waterMeter-widget">
                                <h3 className="col-md-12">Water to Feed Ratio</h3>
                                <div className="col-md-6">

                                    <p><strong>Feed Today: </strong>{
                                        feedToday===''?<i className='redcolor' style={{fontSize:12}}>Not Entered</i>: feedToday+' Kg'
                                    }</p>
                                    <p className="bigText green">{watertoFeedRatio}</p>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'center' }}>
                                    <img src="/dist/img/feedratio.png" width="65"></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <DataTable
                                columns={columns}
                                data={tableDate}
                                defaultSortAsc={false}
                                pagination
                                dense='true'
                                compact
                                highlightOnHover='true'
                                striped
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="position-relative mb-4"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div className /></div><div className="chartjs-size-monitor-shrink"><div className /></div></div>
                                <EchartLineWater data={yaxis}
                                    xaxis={xaxis} color={'#1ea5dd'}>

                                </EchartLineWater>
                                {/* <EchartLine data={tempState} xaxis={xData} maxVal='50' color='#17a2b8' interval= {5} 
                                                max={thresholds.length>0? thresholds[0].tempMax: 0} min= {thresholds.length>0? thresholds[0].tempMin: 0}></EchartLine> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

    );
}

export default WaterConsumption;