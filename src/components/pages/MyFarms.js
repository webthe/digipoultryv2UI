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
const MyFarms = () => {
    const [role]=useState(getRole())
    const [data, setData] = useState([])
    const columns = [
        {
          name: "Barn Name",
          selector: "farmName",
          sortable: true,
          minWidth: '150px'
        },
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
    if(role===Role.Admin) {
        columns.push({
            name: "Action",
            selector: "status",
            sortable: true,
            minWidth: '80px',
            cell:(row)=>
                <i className="fas fa-edit view-btn" onClick={editFarm}  id={row.farmID}></i>
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
            setData(response.list);
            setDisplayData(response.list)
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
    const [searchTerm, setSearchTerm] = useState('');
    const [displayData, setDisplayData] = useState([]);
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
    }
    const closePopup = ()=>{
        setShowPopup(false);
      }
      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.getFarmMasterView();
                setData(response.list);
                setDisplayData(response.list);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm !== '' && searchTerm.length > 2) {
            const filteredData = data.filter(item => {
                const farmName = item.farmName || "";
                const createdDate = item.createdDate || "";
                return farmName.toLowerCase().includes(searchTerm.toLowerCase()) || createdDate.includes(searchTerm);
            });
            setDisplayData(filteredData);
        } else {
            setDisplayData(data);
        }
    }, [searchTerm, data]);

    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">List of Barns</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <div className="row">
                    <div className="col-md-5">
                        <form>
                            <div class="input-group">
                                <input type="search" className="form-control form-control-sm" 
                                placeholder="Search by Barn/Created Date" 
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
                </div>
                <br></br>
                <DataTable
                    columns={columns}
                    data={displayData}
                    defaultSortField="templateID"
                    pagination
                    dense
                    selectableRowsHighlight='true'
                    compact
                    highlightOnHover='true'
                    striped
                />
                </div>
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

export default MyFarms;