import { useEffect, useState } from "react";
import {useForm } from "react-hook-form";
import React  from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';

import {env} from './const';
import { headers } from '../utils/common';
import AddIntegrator from "./AddIntegrator";
import * as axiosInstance from '../utils/axiosinstace';
import moment from "moment";
const Integrators = (props) => {
    const columns = [
        {
            name: "#",
            selector: "id",
            sortable: true,
            minWidth: '50px'
          },
        {
          name: "Name",
          selector: "name",
          sortable: true,
          minWidth: '250px'
        },
        {
            name: "Created Date",
            selector: "createdDate",
            sortable: true,
            minWidth: '150px',
            cell: row => <div>
           {row.createdDate !=='' || row.createdDate !== undefined
           ? moment(row.createdDate).format('DD-MMM-YYYY'):''}</div>
        },
        {
            name: "Last Modified",
            selector: "modifiedDate",
            sortable: true,
            minWidth: '150px',
            cell: row => <div>
           {row.modifiedDate !=='' || row.modifiedDate !== undefined
           ? moment(row.modifiedDate).format('DD-MMM-YYYY'):''}</div>
        },
        {
            name: "Status",
            selector: "status",
            sortable: true,
            minWidth: '150px',
            cell: row => <div>
           {row.runningBatch==='INACTIVE'
           ? <span className="redbg">INACTIVE</span>: <span className="greenbg">{row.status}</span>} </div>
        },
        {
            name: "Edit",
            selector: "id",
            cell:(row)=>
                <i className="fas fa-eye view-btn" onClick={addIntegrator} id={row.id}></i>
           
        }
      ];
      const [headersobj] = useState(headers());
      const [selectedRows, setSelectedrows] = useState([]);
      const [data, setData] = useState([]);
     
      const [showAddIntegrator, setShowAddIntegrator] = useState(false);
      
      const addIntegrator = ()=>{
        setShowAddIntegrator(true)
      }
     
      const getListOfIntegrators = async()=>{
        try {
            const response = await axiosInstance.getIntegratorsList();
            setData(response.list);
        } catch (err) {
            console.log(err.message);
        }
      }
      //load list of integrators
      useEffect(()=>{
        getListOfIntegrators();
      },[])
      const [searchTerm, setSearchTerm] = useState('');
      const [displayData, setDisplayData] = useState([]);

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
        useEffect(() => {
            if (searchTerm !== '' && searchTerm.length > 2) {

                const filteredData = data.filter(item => {
                    const name = item.name || "";
                    const status  = item.status || "";
                  
                    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    status.toLowerCase().includes(searchTerm.toLowerCase()) 
                    ;
                });
                setDisplayData(filteredData);
            } else {
                setDisplayData(data);
            }
        }, [searchTerm, data]);
        const closePopup = ()=>{
            setShowAddIntegrator(false);
        }
        const handleChange = (state) =>{
            setSelectedrows(state.selectedRows);
        }
    return (
        <div className="batchHistory">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Integrators</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <div className="row">
                    <div className="col-md-5">
                        <form>
                            <div class="input-group">
                                <input type="search" className="form-control form-control-sm" 
                                placeholder="Search by Name/Status" 
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
                    <div className="col-md-7">
                        <ul class="controls">
                            <li><button  onClick={()=>{addIntegrator()}} type="button" class="btn btn-block btn-outline-success btn-sm">Add New</button></li>
                            <li><button  type="button" class="btn btn-block btn-outline-primary btn-sm">Modify</button></li>
                        </ul>
                    </div>
                </div>
              
                <DataTable
                    columns={columns}
                    data={displayData}
                    defaultSortField="#"
                    pagination
                    selectableRows
                    selectableRowsComponent={BootyCheckbox}
                    onSelectedRowsChange = {handleChange}
                    dense
                    selectableRowsHighlight = 'true'
                    compact
                    highlightOnHover = 'true'
                    striped
                />
                </div>
            </div>
          
            <AddIntegrator onChange={closePopup} show = {showAddIntegrator}>
            </AddIntegrator>
        </div>
        
    );
}

export default Integrators;