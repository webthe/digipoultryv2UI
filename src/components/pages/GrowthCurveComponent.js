import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import EchartComparison from '../dashboard/idealscomparison';
import * as axiosInstance from '../utils/axiosinstace';
import moment from "moment";
const GrowthCurveComponent = (props) => {
    const columns_male = [
        {
            name: "Day",
            selector: "day",
            sortable: true,
           
        },
        {
            name: "Weight",
            selector: "male",
            sortable: true,
            
        },
        {
            name: "Ideal Weight",
            selector: "ideal_male",
            sortable: true,
        }
      ];
      const columns_female = [
        {
            name: "Day",
            selector: "day",
            sortable: true,
           
        },
        {
            name: "Weight",
            selector: "female",
            sortable: true,
            
        },
        {
            name: "Ideal Weight",
            selector: "ideal_female",
            sortable: true,
        }
      ];
      const columns = [
        {
            name: "Day",
            selector: "day",
            sortable: true,
           
        },
        {
            name: "Weight",
            selector: "chickweight",
            sortable: true,
            
        },
        {
            name: "Ideal Weight",
            selector: "ideal",
            sortable: true,
        }
      ];
    
    useEffect(() => {  
      
     },[]);
    return (
        
        <div className="growthCurve">
            {
                props.sexing =='yes'?
                <div>
                    <div className="row" style={{paddingTop: 20, paddingBottom: 20}}>
                        <div className="col-md-3">
                            <h3>Bird Growth - Male</h3>
                        </div>
                        <div className="col-md-9">
                            <ul className="batchInfo">
                                <li><b>Batch Status: </b><span className="textHiglighter"
                                style={{background: props.otherInfo.status=='ACTIVE'? '#218838': '#444'}}
                                >
                                    {props.otherInfo.status}
                                </span></li>
                                <li><b>Start Date: </b>{moment(props.otherInfo.startDate).format('DD-MMM-YYYY')}</li>
                                <li><b>End Date: </b>{moment(props.otherInfo.endDate).format('DD-MMM-YYYY')}</li>
                                <li><b>Duration: </b>{props.otherInfo.batchDuration} Days</li>
                            </ul>
                        </div>
                    </div>
                     <div className="row">
                        
                        <div className="col-md-6">
                            <DataTable
                                columns={columns_male}
                                data={props.data}
                                defaultSortField="Day"
                                pagination
                                dense
                                selectableRowsHighlight = 'true'
                                compact
                                highlightOnHover = 'true'
                            />
                        </div>
                        <div className="col-md-6">
                            <EchartComparison key={Math.random()} xaxis={props.xaxis} legends = {props.maleLegends}  series={props.maleseries} max='5' ></EchartComparison>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <h3>Bird Growth - female</h3>
                        </div>
                        <div className="col-md-7">
                            <DataTable
                                columns={columns_female}
                                data={props.data}
                                defaultSortField="Day"
                                pagination
                                dense
                                selectableRowsHighlight = 'true'
                                compact
                                highlightOnHover = 'true'
                            />
                        </div>
                        <div className="col-md-5">
                            <EchartComparison key={Math.random()} xaxis={props.xaxis} legends = {props.femaleLegends}  series={props.femaleseries} max='5' ></EchartComparison>
                        </div>
                    </div>
                </div>
                :
                <div>
                     <div className="row" style={{paddingTop: 20, paddingBottom: 20}}>
                        <div className="col-md-3">
                            <h3>Bird Growth</h3>
                        </div>
                        <div className="col-md-9">
                            <ul className="batchInfo">
                                <li><b>Batch Status: </b><span className="textHiglighter"
                                style={{background: props.otherInfo.status=='ACTIVE'? '#218838': '#444'}}
                                >
                                    {props.otherInfo.status}
                                </span></li>
                                <li><b>Start Date: </b>{moment(props.otherInfo.startDate).format('DD-MMM-YYYY')}</li>
                                <li><b>End Date: </b>{moment(props.otherInfo.endDate).format('DD-MMM-YYYY')}</li>
                                <li><b>Duration: </b>{props.otherInfo.batchDuration} Days</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                      
                        <div className="col-md-6">
                        
                            <DataTable
                                columns={columns}
                                data={props.data}
                                defaultSortField="Day"
                                pagination
                                dense
                                selectableRowsHighlight = 'true'
                                compact
                                highlightOnHover = 'true'
                            />
                        </div>
                        <div className="col-md-6">
                            <EchartComparison key={Math.random()} xaxis={props.xaxis} legends = {props.chickLegends}  series={props.asHatchedSeries} max='5' ></EchartComparison>
                        </div>
                    </div>
                </div>
            }
           
        </div>
        
    );
}

export default GrowthCurveComponent;