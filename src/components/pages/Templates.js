import React, { useEffect, useState, useMemo, useCallback  } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable, { memoize } from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import {Modal, Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom'
import * as axiosInstance from '../utils/axiosinstace';
const Templates = () => {
    const [data, setData] = useState([])
   
    const columns = [
        {
          name: "ID",
          selector: "templateID",
          sortable: true,
          width: ' 100px'
        },
        {
          name: "Template Name",
          selector: "templateName",
          sortable: true,
          minWidth: '200px'
        },
        {
          name: "Breed",
          selector: "breedname",
          sortable: true,
          minWidth: '60px'
        },
        {
            name: "Duration",
            selector: "duration",
            sortable: true,
            minWidth: '60px'
        },
        {
            name: "Frequency",
            selector: "frequency",
            sortable: true
        },
        {
            name: "Number of Phases",
            selector: "numberofphases",
            cell: row => <div>{row.numberofphases}</div>
        },
        {
            name: "Created By",
            selector: "createdBy",
            cell: row => <div>
                {row.createdBy==='digiadmin'? <span className="greenbg">{row.createdBy}</span>:<span className="bluebg">{row.createdBy}</span>}</div>
        },
        {
            name: "View Phase Details",
            selector: "numberofphases",
            cell:(row)=>
                <i className="fas fa-eye view-btn" onClick={clickHandler} id={row.templateID}></i>
           
        }
      ];
     
      const [headersobj] = useState(headers());
      const [selectedRows, setSelectedRows] = useState([]);
      const [showPopup, setShowPopup] = useState(false);
      const [tempDetails, setTempDetails] = useState({});
      const [phaseDetails, setPhaseDetails] = useState([]);
      const clickHandler = async(state) => {
        // alert(state.target.id);
       //console.log(data.filter((val)=>val.templateID===state.target.id)[0]);
        setTempDetails(data.filter((val)=>val.templateID===state.target.id)[0])
        setShowPopup(true);
        try {
            const response  = await axiosInstance.getTemplatesPhases(state.target.id);
            setPhaseDetails(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl+'/templates/phases/'+state.target.id, { headers: headersobj}
        // ).then(res=>{
        //      setPhaseDetails(res.data.list)
        //         console.log(res.data.list)
        //      }).catch((err) =>{
        //           console.log(err);
        //      });
      };
      
      const handleChangeSelectedRows = (state) =>{
        setSelectedRows(state.selectedRows)
      }
      const closePopup = ()=>{
        setShowPopup(false);
      }
      const getTemplatesData = async()=>{
        try {
            const response = await axiosInstance.getTemplates();
            setData(response.list)
           
        } catch (err) {
            console.log(err);
        }
      }
    useEffect(()=>{
        getTemplatesData();
    
      },[setData])
    
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Templates</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <DataTable
                    data={data}
                    defaultSortField="templateID"
                    pagination
                    dense
                    selectableRowsHighlight = 'true'
                    compact
                    highlightOnHover = 'true'
                    columns={columns}
                    onRowSelected={handleChangeSelectedRows}
                />
                </div>
                
            </div>
            <Modal show={showPopup} size='lg'> 
                <Modal.Header>
                    <Modal.Title>Phase Details - <strong>{tempDetails.templateName}</strong></Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table phases table-bordered table-condensed table-striped">
                                    <tr>
                                        <th valign="middle" rowSpan="2" className="tab-head1">Phase</th>
                                        <th valign="middle" rowSpan="2" className="tab-head1">Duration</th>
                                        <th colspan="2" className="tab-head1">Temp.(°C)</th>
                                        <th colspan="2" className="tab-head1">Humidity (%)</th>
                                        <th colspan="2" className="tab-head1">CO<sub>2</sub></th>
                                        <th colspan="2" className="tab-head1">NH<sub>3</sub></th>
                                    </tr>
                                    <tr>
                                        <th className="tab-head2">Min.</th>
                                        <th className="tab-head2">Max.</th>
                                        <th className="tab-head2">Min.</th>
                                        <th className="tab-head2">Max.</th>
                                        <th className="tab-head2">Min.</th>
                                        <th className="tab-head2">Max.</th>
                                        <th className="tab-head2">Min.</th>
                                        <th className="tab-head2">Max.</th>
                                    </tr>
                                   {
                                       phaseDetails.map((item,index)=>{
                                            return(
                                                <tr>
                                                    <th>{item.phaseNumber}</th>
                                                    <th>{item.days}</th>
                                                    <th>{item.tempMin}</th>
                                                    <th>{item.tempMax}</th>
                                                    <th>{item.rhMin}</th>
                                                    <th>{item.rhMax}</th>
                                                    <th>{item.coMin}</th>
                                                    <th>{item.coMax}</th>
                                                    <th>{item.nhMin}</th>
                                                    <th>{item.nhMax}</th>
                                                </tr>
                                            )
                                       })
                                   }
                                </table>
                            </div>
                        </div>
                    </Modal.Body>
                 <Modal.Footer>
                    <Button variant="secondary" onClick={closePopup}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    );
}
export default Templates;