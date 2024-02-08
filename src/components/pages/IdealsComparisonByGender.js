import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import EchartComparison from '../dashboard/idealscomparison';
import { useLoading, Bars } from '@agney/react-loading';
import * as axiosInstance from '../utils/axiosinstace';
const IdealsComparisonByGender = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
    const [showLoader, setShowloader] = useState(false);
    const [xaxis, setXaxis] = useState([]);
    const [series, setSeries] = useState([]);
    const [headersobj] = useState(headers());
    const [data, setData] = useState([]);
    const columns = [
        {
            name: "Day",
            selector: "day",
            sortable: true,
           
        },
        {
            name: "Male",
            selector: "male_weight",
            sortable: true,
            
        },
        {
            name: "Female",
            selector: "female_weight",
            sortable: true,
            
        }
      ];
    const [gender, setGender] = useState('asHatched');
    const [birdType, setBirdType] = useState([]);
    const [legends, setLegends] = useState([]);
    const loadData = async(_gender)=>{
        try {
            const response = await axiosInstance.getIdealscomparisonbygender(_gender)
            setData(response.data);
            setXaxis(response.xaxis);
            setSeries(response.series);
        } catch (err) {
            console.log(err.message);
            setXaxis([]);
            setSeries([]);
            setData([]);
            setLegends([]);
        }
    }
    const [breeds, setBreeds] = useState([]);
    const loadBreeds = async()=>{
        try {
            const response = await axiosInstance.getBreeds(); 
            setBreeds(response.list);
            loadData(response.list[0].id);
            
        } catch (err) {
             console.log(err.message);
             setBreeds([])
        }
    }
    const onBreedChange = (e)=>{
        setData([]);
        loadData(e.target.value);
    }
    useEffect(() => {  
        loadBreeds();  
        
     },[headersobj]);
    return (
        
        <div className="idealsByGender">
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Bird Type</label>
                        <select class="form-control form-control-sm" name="farmer"
                           onChange={(e)=>onBreedChange(e)}
                        >
                            {breeds.map(item => (
                                <option
                                    key={item.IdealsComparisonByGender}
                                    value={item.id}
                                >
                                    {item.breed}
                                </option>
                            ))}
                        </select>
                       
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-7">
                    <DataTable
                        columns={columns}
                        data={data}
                        defaultSortField="Day"
                        pagination
                        dense
                        selectableRowsHighlight = 'true'
                        compact
                        highlightOnHover = 'true'f
                    />
                </div>
                <div className="col-md-5">
                    <EchartComparison key={Math.random()} xaxis={xaxis} legends = {legends}  series={series} max='4' ></EchartComparison>
                </div>
            </div>
        </div>
        
    );
}

export default IdealsComparisonByGender;