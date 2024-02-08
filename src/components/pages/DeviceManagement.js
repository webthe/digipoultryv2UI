import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Button } from 'react-bootstrap';
import CloseBatch from './CloseBatch';
import UpdateDevice from './UpdateDevice';
import { env } from './const';
import { headers } from '../utils/common';
import { useHistory, Link, withRouter } from 'react-router-dom';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
import MaterialIcon, { colorPalette } from 'material-icons-react';
import AddNewDevice from "./AddNewDevice";
import {Tabs, Tab} from 'react-bootstrap-tabs';
import AssignDevices from "./AssignDevices";
const DeviceManagement = () => {
    const [role, setRole] = useState(getRole());
    const columns = [
        {
            name: "Device ID",
            selector: "imeiNumber",
            sortable: true,
            minWidth: '150px'
        },
        
        {
            name: "Last Used in Barn",
            selector: "farm",
            sortable: true,
            minWidth: '150px',
            cell: row => <>
            {row.farm==''?<i>-NA-</i>:row.farm}
            </>
        },
        {
            name: "Batch",
            selector: "batch",
            sortable: true,
            cell: row => <>
            {row.batch==''?<i>-NA-</i>:row.batch}
            </>
        },
        {
            name: "Status",
            sortable: true,
            maxWidth: '100px',
            cell: row => <>
            {row.status == 'Active'?
            <div>
                <span style={{color: '#28a745'}}>{row.status}</span>
            </div>
            :
            <div>
                <span style={{color: '#dc3545'}}>{row.status}</span>
            </div>
            } </>,
        },
        {
            name: "Added Date",
            selector: "createdDate",
            sortable: true
        },
        // {
        //     name: "Added By",
        //     selector: "createdBy",
        //     sortable: true
        // }
        
    ];
    const [displayData, setDisplayData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

   
    const onSearch = (event)=>{
        setSearchTerm(event.target.value)
    }
    const [headersobj] = useState(headers());
    const [selectedRows, setSelectedrows] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [devicesList, setDeviceList] = useState([]);
    
    const closeAddPopup = () => {
        setShowAddPopup(false);
        // setshowStopBatch(false);
        // setshowUpdateBatch(false);
    }
    const getDevices = ()=>{
        axios.get(env.produrl+'/mydevices/', { headers: headersobj}
        ).then(res=>{
            setDeviceList(res.data.data);
            setDisplayData(res.data.data);
        }).catch((err) =>{
            console.log(err);
        });
    }
    useEffect(() => {
        getDevices();
    }, [])
    const handleSelectedRows = (state)=>{
        setSelectedrows(state.selectedRows)
    }
    const deactivateDevice = ()=>{
        if(selectedRows.length==1) {
            //alert(JSON.stringify(selectedRows))
            const data = {
                imeinumber: selectedRows[0].imeiNumber
            }
            const userConfirmed = window.confirm('Are you sure you want to proceed?');
            if(!userConfirmed) {
                return;
            }
            axios.post(env.produrl + '/mydevices/deactivate', data, { headers: headersobj })
            .then(res => {
              alert(res.data.message);
              getDevices();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        } else if(selectedRows.length>1) {
            alert('Please select one device at a time');
        } 
        else {
            alert('Please select a device');
        }
    }
    useEffect(() => {
        if(searchTerm !=='' && searchTerm.length >2) {
          
            try{
            const filteredData = devicesList.filter(item => {
                const imeiNumber = item.imeiNumber || "";
                const farm = item.farm || "";
            
                return imeiNumber.includes(searchTerm) || farm.toLowerCase().includes(searchTerm.toLowerCase());
            });
          
                setDisplayData(filteredData)
            } catch(err) {
                alert(err)
                setDisplayData(devicesList)
            }
        } else {
            setDisplayData(devicesList)
        }
    }, [searchTerm, devicesList, displayData]); // Dependency on searchTerm and originalData
    
    const BootyCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
        <div className="custom-control custom-checkbox">
            <input
                type="checkbox"
                className="custom-control-input"
                ref={ref}   
                {...rest}
            />
            <label className="custom-control-label" onClick={onClick} />
        </div>
    ));
    return (

        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Manage Devices</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <Tabs activeHeaderStyle={{background:'transparent'}}>
                    <Tab label="List of devices">
                    <div className="row">
                        <div className="col-md-4">
                            <form>
                                <div class="input-group">
                                    <input type="search" className="form-control form-control-sm" 
                                    placeholder="Search by Device ID/Barn" 
                                    //value={searchTerm}
                                    onKeyUp={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div class="input-group-append">
                                        <div type="submit" className="btn btn-sm btn-default">
                                            <i class="fa fa-search"></i>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <br></br>
                        {/* <div className="col-md-8">
                            <ul class="controls">
                                <li><button onClick={()=>setShowAddPopup(true)}  type="button" class="btn btn-block btn-outline-success btn-sm">
                                    Add Device</button></li>
                                <li><button onClick={()=>deactivateDevice()} type="button" class="btn btn-block btn-outline-danger btn-sm">De-activate Device</button></li>
                            </ul>
                        </div> */}
                    </div>
                    <DataTable
                        columns={columns}
                        data={displayData}
                        defaultSortField="batchID"
                        pagination
                        selectableRows
                        selectableRowsComponent={BootyCheckbox}
                        onSelectedRowsChange={handleSelectedRows}
                        dense
                        selectableRowsHighlight='true'
                        compact
                        highlightOnHover='true'
                        striped
                    />
                    </Tab>
                    {role==Role.Admin?
                    
                     <Tab label="Add/remove Device">
                        <AssignDevices></AssignDevices>
                    </Tab>
                    
                    :<></>}
                </Tabs>
                  
                </div>
            </div>
            <AddNewDevice onChange={()=>closeAddPopup()} show={showAddPopup}></AddNewDevice>
        </div>

    );
}

export default DeviceManagement;