import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import EchartComparison from '../dashboard/idealscomparison';
import { useLoading, Bars } from '@agney/react-loading';
import {Tabs, Tab} from 'react-bootstrap-tabs';
const MortalityComparison = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
    const [showLoader, setShowloader] = useState(false);
    const [headersobj] = useState(headers());
    const loadData = ()=>{
       
    }
   
    useEffect(() => {    
        loadData();
     },[headersobj]);
    return (
        
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Batch Comparison</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <div className="row">
                    <form>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="waterMeterMessage" role="alert">
                                    <img src="/dist/img/lock.png" width="30"></img>
                                    "Available in pro version, please contact administrator to activate"
                                </div>
                            </div>
                        </div>
                </form>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default MortalityComparison;