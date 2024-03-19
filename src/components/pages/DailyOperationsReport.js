import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { env } from './const';
import { headers } from '../utils/common';
import { getRole } from '../utils/common';
import { Role } from '../utils/role';
import DeactivateFarm from './DeactivateFarm';
import { Modal, Button } from 'react-bootstrap';
import { getUserName } from '../utils/common';
import { useLoading, Bars } from '@agney/react-loading';
import * as axioInstance from '../utils/axiosinstace';
import GrowthCurveComponent from "./GrowthCurveComponent";
import { AiFillFilePdf } from "react-icons/ai";
import moment from "moment";

const DailyOperationsReport = () => {
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
    const onchangeHandler = async (e) => {

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
        status: "",
        farmer: "",
        farm: "",
        batchName: "",
        company: "",
        numberofBirds: ""
    })
    const onSubmit = async (data, e) => {
        e.preventDefault();
        setShowloader(true);
        try {
            const response = await axioInstance.getGrowthCurve(data.batchID);
            if (response.status == false) {
                setShowData(false);
                setShowloader(false);
                setErrorMessage(response.message)
                return;
            }
            if (response.data.length == 0) {
                setShowData(false);
                setShowloader(false);
                setErrorMessage(response.message);
                return;
            }
            setShowData(false);
            setData(response.data);
            setOtherInfo(response.others)
            const days = response.data.map((item) => item.day);
            setXaxis(days);
            setSexingStatus(response.others.sexing);
            let _data = response.data;
            //alert( moment(response.others.endDate).diff(moment(), 'days'))
            const daydiff = moment(response.others.endDate).diff(moment(), 'days');
            //alert(daydiff)
            if (daydiff > 0 && response.others.status == 'ACTIVE') {
                const day = response.others.batchDuration - daydiff;
                _data = _data.filter((item) => parseInt(item.day) <= day);
                //alert(JSON.stringify(_data));
            }

            setShowloader(false);
        } catch (err) {
            setShowData(false);
            setShowloader(false);
        }


    }
    const onBatchChange = (e) => {
        setShowGraph(false);
    }
    const getFarms = async () => {
        try {
            const response = await axioInstance.getListofFarms(getUserName());
            setFarmData(response.list)
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getFarms();
    }, []);
    return (

        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Daily Operations Report</h2>
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
                                    <select class="form-control" name="batchID" onChange={onBatchChange}
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
                                <input type="submit" value="Fetch" class="btn btn-primary" />
                            </div>
                            <div className='col-md-1'>
                                {showLoader ?
                                    <section {...containerProps} style={{ "margin-top": "30px" }}>
                                        {indicatorEl}
                                    </section> : ""
                                }
                            </div>
                            <div className="col-md-4">
                                {showData ?  
                                    <></>
                                :
                                <div className="downloadLink">
                                        <span><AiFillFilePdf size={28} color="red"></AiFillFilePdf></span> <span>Download PDF</span>
                                </div>
                                }
                            </div>
                        </div>
                    </form>
                    {
                        showData ?
                            <div className="row">
                                <div className="col-md-12">
                                    <p className="redColor">{errorMessage}</p>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <table className="table table-striped table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="summaryHeader">Farmer</td>
                                                    <td>{otherInfo.farmer}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Company</td>
                                                    <td>{otherInfo.company == null || otherInfo.company == '' ? '--' : otherInfo.company}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Barn</td>
                                                    <td>{otherInfo.farm}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Start Date</td>
                                                    <td>{otherInfo.startDate}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Sexing</td>
                                                    <td>{otherInfo.sexing.toLocaleUpperCase()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <table className="table table-striped table-sm">
                                            <tbody>
                                                <tr>
                                                    <td class="summaryHeader">Integrator</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader"># of Birds</td>
                                                    <td>{otherInfo.numberofBirds}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Batch</td>
                                                    <td>{otherInfo.batchName}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Close Date</td>
                                                    <td>{otherInfo.endDate}</td>
                                                </tr>
                                                <tr>
                                                    <td class="summaryHeader">Type</td>
                                                    <td>{otherInfo.breedName}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <table class="dailyOperationsTable table table-striped table-sm table-bordered">
                                            <tr>
                                                <th rowspan="2">Day</th>
                                                <th rowspan="2">Date</th>
                                                <th rowspan="2">Feed (Kg)</th>
                                                <th colspan="3">Mortality</th>
                                                <th rowspan="2">Recorded Weight (Kg)</th>
                                                <th rowspan="2">Ideal Weight (Kg)</th>
                                                <th rowspan="2">Variance (Actual vs Ideal)</th>
                                            </tr>
                                            <tr>
                                                <th class="">Natural</th>
                                                <th>Culling</th>
                                                <th>Total</th>
                                            </tr>
                                            {data.map(item => (
                                                 <tr>
                                                    <td>{item.day}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.feed}</td>
                                                    <td>{item.mortality}</td>
                                                    <td>{item.culling}</td>
                                                    <td>{item.total}</td>
                                                    <td>{item.chickweight}</td>
                                                    <td>{item.ideal}</td>
                                                    <td>{item.variance}</td>
                                                </tr>
                                            ))}  
                                        </table>
                                    </div>
                                </div>
                            </div>

                    }
                </div>
            </div>
        </div>

    );
}

export default DailyOperationsReport;