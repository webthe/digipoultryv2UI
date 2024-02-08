import React, { useEffect, useState, useRef } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import { getRole } from '../utils/common';
import { Role } from '../utils/role';
import  DeactivateFarm  from './DeactivateFarm';
import {Modal, Button} from 'react-bootstrap';
import * as axiosInstance from '../utils/axiosinstace';
const ListofBarns = () => {
    const [role]=useState(getRole())
    const [data, setData] = useState([])
    const columns = [
        {
          name: "Barn Name",
          selector: "farmName",
          sortable: true,
          minWidth: '150px'
        },
        // {
        //   name: "IMEI Number",
        //   selector: "deviceID",
        //   sortable: true,
        //   minWidth: '150px'
        // },
        {
            name: "Created Date",
            selector: "createdDate",
            sortable: true,
            minWidth: '80px'
        },
        {
            name: "No.of Batches",
            selector: "numberofbatches",
            sortable: true,
            minWidth: '80px'
        },
        {
            name: "Active Batch",
            selector: "runningBatch",
            minWidth: '200px',
            sortable: true,
            cell: row => <div>
           {row.runningBatch===null
           ? <span className="redbg">No Active Batch Found</span>: <span className="greenbg">{row.runningBatch}</span>} </div>
        },
        {
            name: "Network",
            selector: "",
            sortable: true,
            minWidth: '80px'
        },
        {
            name: "Status",
            selector: "status",
            sortable: true,
            minWidth: '100px'
        },
        {
            name: "Assigned Workers",
            selector: "numberofphases",
            cell:(row)=>
                <i className="fas fa-eye view-btn" onClick={clickHandler}  id={row.farmID}></i>
           
        }
      ];
    const [headersobj] = useState(headers());
    const [farmInfo, setFarmInfo] = useState({});
    if(role===Role.Admin || role===Role.Farmer) {
        columns.push({
            name: "Action",
            selector: "status",
            sortable: true,
            minWidth: '80px',
            cell:(row)=>
                <i className="fas fa-trash view-btn" style={{color: 'red'}} onClick={editFarm}  id={row.farmID}></i>
        })
    }
    const [showForm, setShowForm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const editFarm = (state)=>{
        setShowForm(true);
        let currentSelection = data.filter((obj)=>{
            return obj.farmID === parseInt(state.target.id)
        })
        setFarmInfo(currentSelection[0]);
        //console.log(currentSelection[0]);
        
    }
    const handleChange = (newValue)=>{
        setShowForm(newValue);
        console.log(newValue);
        if(!newValue) {
            loadFarmData.current();
        }
    }
    const loadFarmData = useRef(()=>{});
    loadFarmData.current = async()=>{
        try {
            const response = await axiosInstance.getFarmMasterView();
            setData(response.list)
        } catch (err) {
            console.log(err);
        }
        // axios.get(env.produrl+'/farmMaster/view', { headers: headersobj}
        // ).then(res=>{
        //     setData(res.data.list)
        //         console.log(res.data.list)
        //     }).catch((err) =>{
        //         console.log(err);
        //     });
    }
    const [usersData, setUsersData] = useState([]);
    const [farmName, setFarmName] = useState('');
    const clickHandler = async(state)=> {
        try {
            const response = await axiosInstance.getassignedusers(state.target.id);
            setUsersData(response.list)
               if(response.list.length>0) {
                setFarmName(response.list[0].farmName);
                //alert(res.data.list[0].farmName)
                setShowPopup(true);
                
               } else {
                   alert("There are no workers assigned to this farm");
               }
        } catch (err) {
            setUsersData([]);
            console.log(err);
        }

        // axios.get(env.produrl+'/misc/assignedusers/'+state.target.id, { headers: headersobj}
        // ).then(res=>{
        //        setUsersData(res.data.list)
        //        if(res.data.list.length>0) {
        //         setFarmName(res.data.list[0].farmName);
        //         //alert(res.data.list[0].farmName)
        //         setShowPopup(true);
                
        //        } else {
        //            alert("There are no workers assigned to this farm");
        //        }
        //         console.log(res.data.list)
        //     }).catch((err) =>{
        //         setUsersData([]);
        //         console.log(err);
        //     });
    }
    const closePopup = ()=>{
        setShowPopup(false);
      }
    useEffect(()=>{
        loadFarmData.current();
      },[loadFarmData])
    
    return (
        <div className="barnsList">
           
            
                <div>
                    <DataTable
                        columns={columns}
                        data={data}
                        defaultSortField="templateID"
                        pagination
                        dense
                        selectableRowsHighlight = 'true'
                        compact
                        highlightOnHover = 'true'
                    />
                </div>
            
            <DeactivateFarm key={Math.random()} onChange={handleChange} farm={farmInfo} showState = {showForm}></DeactivateFarm>
            <Modal show={showPopup} size='lg'> 
                <Modal.Header>
                    <Modal.Title>Assigned Workers - {farmName} </Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table workers table-bordered">
                                   <tr>
                                       <th className="tab-head2">Name</th>
                                       <th className="tab-head2">Status</th>
                                       <th className="tab-head2">Last updated By</th>
                                       <th className="tab-head2">Last updated Date</th>
                                   </tr>
                                   {
                                       usersData.map((item,index)=>{
                                            return(
                                                <tr>
                                                    <td>{item.name}</td>
                                                    <td>{item.status}</td>
                                                    <td>{item.lastupdatedBy}</td>
                                                    <td>{item.modifiedDate}</td>
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

export default ListofBarns;