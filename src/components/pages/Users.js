import React, { useEffect, useState } from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from 'axios';
import moment from 'moment-timezone';
import DataTable from "react-data-table-component";
import {env} from './const';
import { headers } from '../utils/common';
import * as axiosInstance from '../utils/axiosinstace'
const Users = () => {
    const [headersobj] = useState(headers());
    const [data, setData] = useState([])
    const columns = [
        {
          name: "Name",
          selector: "farmerName",
          sortable: true,
          width: '150px'
        },
        {
          name: "User Name",
          selector: "userName",
          sortable: true,
          minWidth: '200px'
        },
        {
            name: "Phone Number",
            selector: "phoneNumber",
            sortable: true,
            minWidth: '200px'
          },
        {
          name: "Email ID",
          selector: "emailID",
          sortable: true,
          minWidth: '150px'
        },
        {
            name: "Status",
            selector: "status",
            sortable: true,
            minWidth: '150px',
            cell: row => <div>
           {row.runningBatch==='INACTIVE'
           ? <span className="redbg">INACTIVE</span>: <span className="greenbg">{row.status}</span>} </div>
        }
      ];
    const getAllUsers  = async ()=>{
      try {
        const response = await axiosInstance.getAllUsers();
        //alert(JSON.stringify(response))
        setData(response.list)
      } catch (err) {
        console.log(err);
      }
    }
    useEffect(()=>{
       
        getAllUsers();
      },[setData])
    
    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">List of Users</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <DataTable
                    columns={columns}
                    data={data}
                    defaultSortField="templateID"
                    pagination
                    //selectableRows
                    // selectableRowsComponent={BootyCheckbox}
                    // onSelectedRowsChange = {handleChange}
                    dense
                    selectableRowsHighlight = 'true'
                    compact
                    highlightOnHover = 'true'
                />
                </div>
            </div>
        </div>
        
    );
}
export default Users;