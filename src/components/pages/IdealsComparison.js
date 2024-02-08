import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import EchartComparison from '../dashboard/idealscomparison';
import { useLoading, Bars } from '@agney/react-loading';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import IdealsComparisonByGender from "./IdealsComparisonByGender";
import * as axiosInstance from '../utils/axiosinstace';
const IdealsComparison = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="30" color="#333" />,
      });
    const [showLoader, setShowloader] = useState(false);
    const [xaxis, setXaxis] = useState([]);
    const [series, setSeries] = useState([]);
    const [headersobj] = useState(headers());
    const [data, setData] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const columns = [
        {
            name: "Day",
            selector: "day",
            sortable: true,
            width: '75px',
        },
        {
            name: "Ross",
            selector: "Broiler-Ross",
            sortable: true,
            width: '90px'
        },
        {
            name: "Cobb",
            selector: "Broiler-Cobb",
            sortable: true,
            width: '90px'
        },
        {
            name: "Arbor  Acres",
            selector: "Broiler-ArborAcres",
            sortable: true,
        },
        {
            name: "Indian River",
            selector: "Broiler-IndianRiver",
           
            sortable: true,
        },
        {
            name: "Hubbard",
            selector: "Broiler-Hubbard",
            sortable: true,
        }
      ];
    const [gender, setGender] = useState('asHatched');
    const [birdType, setBirdType] = useState([]);
    const loadData = async (_gender)=>{
        try {
            const response = await axiosInstance.getIdealComparison(_gender);
            setXaxis(response.xaxis);
            setSeries(response.series);
            setFilteredSeries(response.series);
            setData(response.data);
            const birdType = response.series.map((item)=>{ return item.name })
            setBirdType(birdType);
            setSelectedItems(birdType);
        } catch (err) {
            console.log(err.message);
            setXaxis([]);
            setSeries([]);
            setData([]);
        }
    }
    const [filteredSeries, setFilteredSeries] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);

    const options = birdType;
  
    const handleSelectAll = (e) => {
      if (e.target.checked) {
        setSelectedItems(options);
        setFilteredCols(
            columns.filter((item)=> { return options.includes(item.selector) || item.selector === "day"})
        );
        setFilteredSeries(series.filter((item)=>options.includes(item.name)));
        
      } else {
        setSelectedItems([]);
      }
    };
    const onGenderChange = (e)=>{
        loadData(e.target.value);
        setFilteredCols(columns);
    }
    const handleOptionChange = (option, e) => {
      
      if (e.target.checked) {
        const filtered = [...selectedItems, option];
        setSelectedItems(filtered);
        setFilteredCols(
            columns.filter((item)=> { return filtered.includes(item.selector) || item.selector === "day"})
        );
        setFilteredSeries(series.filter((item)=>filtered.includes(item.name)));
        
      } else {
        const filtered = selectedItems.filter((item) => item !== option);
        setSelectedItems(filtered);
        setFilteredCols(
            columns.filter((item)=> { return filtered.includes(item.selector) || item.selector === "day"})
          );
        
        setFilteredSeries(series.filter((item)=>filtered.includes(item.name)));
      }
      
      
    };
    const [filteredCols, setFilteredCols] = useState(columns);
    useEffect(() => {    
        loadData(gender);
       
     },[headersobj]);
    return (
        
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Ideals comparison by Bird Type </h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <Tabs activeHeaderStyle={{background:'transparent'}}>
                    <Tab label="Comparison by Bird Type">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group" style={{width: '90%'}}>
                                    <label htmlFor>Gender</label>
                                    <select class="form-control form-control-sm"
                                        name="gender" onChange={(e)=>onGenderChange(e)}
                                    >
                                        <option value="asHatched">As Hatched</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        </select>
                                </div>
                            </div>
                            <div className="col-md-2">
                                {/* <div className="form-group">
                                    <label htmlFor>Bird Type</label>
                                    <select class="form-control form-control-sm"
                                        name="fans"
                                    
                                    >
                                        <option value="asHatched">ALL</option>
                                        {birdType.map(item => (
                                            <option
                                                key={item.key}
                                                value={item.value}
                                            >
                                                {item.value}
                                            </option>
                                        ))}
                                        </select>
                                </div> */}
                                <div className="dropdown">
                                    <div style={{fontWeight: 'bold', marginBottom: 10}}>Bird Type</div>
                                    <button className="btn btn-sm dropdown-toggle" style={{border: '1px solid #ccc'}} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Select Bird Type
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <div className="dropdown-item">
                                        <input type="checkbox" checked={selectedItems.length === options.length} onChange={handleSelectAll} />
                                        <label className="ml-2">All</label>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    {options.map((option, index) => (
                                        <div key={index} className="dropdown-item">
                                        <input type="checkbox" checked={selectedItems.includes(option)} onChange={(e) => handleOptionChange(option, e)} />
                                        <label className="ml-2">{option}</label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                {/* <div className="mt-4">
                                    <h5>Selected Items:</h5>
                                    <ul>
                                    {selectedItems.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                    </ul>
                                </div> */}
                            </div>
                        </div>
                        <div className="row">
                            
                            <div className="col-md-7">
                                <DataTable
                                    columns={filteredCols}
                                    data={data}
                                    defaultSortField="breed"
                                    pagination
                                    dense
                                    selectableRowsHighlight = 'true'
                                    compact
                                    highlightOnHover = 'true'
                                />
                            </div>
                            <div className="col-md-5">
                                <EchartComparison key={Math.random()} xaxis={xaxis}  series={filteredSeries} max='4' ></EchartComparison>
                            </div>
                        </div>
                    </Tab>
                    <Tab label="Comparison by Gender">
                        <IdealsComparisonByGender></IdealsComparisonByGender>
                    </Tab>
                </Tabs>
                    
                </div>
            </div>
        </div>
        
    );
}

export default IdealsComparison;