import { useEffect, useState } from "react";
import {useForm } from "react-hook-form";
import React  from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Modal, Button} from 'react-bootstrap';
import CloseBatch  from './CloseBatch';
import UpdateDevice  from './UpdateDevice';
import {env} from './const';
import { headers } from '../utils/common';
import { useHistory, Link, withRouter } from 'react-router-dom';
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
const BatchHistory = (props) => {
    
    const columns = [
        
        {
          name: "Batch Name",
          selector: "batchName",
          sortable: true,
          minWidth: '150px'
        },
        {
          name: "Barn",
          selector: "farmName",
          sortable: true
        },
        {
            name: "Farmer",
            selector: "farmer",
            sortable: true
        },
        {
            name: "Device ID",
            selector: "imei",
            sortable: true,
            minWidth: '150px'
          },
        {
            name: "Template",
            selector: "templateName",
            sortable: true
        },
        {
            name: "Start Date & time",
            selector: "startDateTime",
            sortable: true,
            minWidth: '150px'
        },
        {
            name: "Status",
            selector: "status",
            sortable: true
        }
      ];
      const [headersobj] = useState(headers());
      const [selectedRows, setSelectedrows] = useState([]);
      const [data, setData] = useState([]);
      const [showUpdatePopup, setShowUpdatePopup] = useState(false);
      const [showStopBatch, setshowStopBatch] = useState(false);
      const [showUpdateBatch, setshowUpdateBatch] = useState(false);
      const [popupTitle, setPopupTitle] = useState('');
      const [batchID, setBatchID] = useState('');
      const [farmName, setFarmName] = useState('');
      const [farmID, setFarmID] = useState('');
      const [accumaltedWeight, setAccumalatedWeight] = useState(0);
     const [enableLink, setEnableLink] = useState(false);
     const [summarydata, setSummaryData] = useState('');
      const handleChange = (state) =>{
          setSelectedrows(state.selectedRows);
        //   console.log(state.selectedRows.length)
          if(state.selectedRows.length>0) {
             setEnableLink(true);
             console.log(state.selectedRows[0]);
             setSummaryData(base64_encode(JSON.stringify(state.selectedRows[0])))
          }
      }
      const startHandler = ()=>{
        if(selectedRows.length >1) {
            alert("Only one is allowed at a time");
            return;
        } else if(selectedRows.length <1){
            alert("Please select a batch");
            return;
        }
        setShowUpdatePopup(true)
        setPopupTitle(selectedRows[0].batchName);
      }
      const stopHandler = ()=>{
        if(selectedRows.length >1) {
            alert("Only one is allowed at a time");
            return;
        } else if(selectedRows.length <1){
                alert("Please select a batch");
                return;
        } else if(selectedRows[0].status==='CLOSED') {
            alert("Batch is already closed");
            return;
        }
        
        setshowStopBatch(true);
        setPopupTitle(selectedRows[0].batchName);
        setBatchID(selectedRows[0].batchID);
        setFarmName(selectedRows[0].farmName);
        setFarmID(selectedRows[0].farmID);
        axios.get(env.produrl+'/closeBatch/getWeights/'+selectedRows[0].batchID, { headers: headersobj}
        ).then(res=>{
                console.log(res.data.accumaltedWeight);
                setAccumalatedWeight(res.data.accumaltedWeight)
            }).catch((err) =>{
                console.log(err);
            });
       
      }
      const history = useHistory();
      const summaryHandler = (e)=>{
          
        if(selectedRows.length >1) {
            e.preventDefault();
            alert("Only one is allowed at a time");
            return;
        } else if(selectedRows.length <1){
            e.preventDefault();
            alert("Please select a batch");
            return;
        }
      }
      const [devicesList, setDeviceList] = useState([]);
      const updateDeviceHandler = (e)=>{
        if(selectedRows.length >1) {
            e.preventDefault();
            alert("Only one is allowed at a time");
            return;
        } else if(selectedRows.length <1){
            e.preventDefault();
            alert("Please select a batch");
            return;
        }
        
        axios.get(env.produrl+'/assigndevices/listofavailabledevices/'+selectedRows[0].farmID+'/byFarm', { headers: headersobj})
        .then(res=>{
            console.log(res);
            setDeviceList(res.data.list)
        }).catch((err) =>{
                console.log(err);
        });
        
        setPopupTitle(selectedRows[0].batchName);
        setBatchID(selectedRows[0].batchID);
        setshowUpdateBatch(true);
      }
      const closePopup = ()=>{
        setShowUpdatePopup(false);
        setshowStopBatch(false);
        setshowUpdateBatch(false);
      }
      useEffect(()=>{
        // alert(showStopBatch)
        axios.get(env.produrl+'/listofBatches/', { headers: headersobj}
        ).then(res=>{
             setData(res.data.list);
             
                console.log(res.data.list)
             }).catch((err) =>{
                  console.log(err);
             });
        if(selectedRows.length>0) {
              setEnableLink(true) 
        }
      },[setData])
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
                    const farmName = item.farmName || "";
                    const batchName  = item.batchName || "";
                    const createdDate = item.startDateTime || "";
                    const imei = item.imei || "";
                    const farmer = item.farmer || "";
                    return farmName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    imei.includes(searchTerm) ||
                    createdDate.includes(searchTerm) ||
                    farmer.toLowerCase().includes(searchTerm.toLowerCase())
                    ;
                });
                setDisplayData(filteredData);
            } else {
                setDisplayData(data);
            }
        }, [searchTerm, data]);
    return (
        <div className="batchHistory">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Batch History</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                <div className="row">
                    <div className="col-md-5">
                        <form>
                            <div class="input-group">
                                <input type="search" className="form-control form-control-sm" 
                                placeholder="Search by Farmer/Barn/Batch/Device ID/Created Date" 
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
                            
                            <li><button disabled = {getRole() === Role.Digiviewer? true: false} onClick={()=>{startHandler()}} type="button" class="btn btn-block btn-outline-success btn-sm">Start Batch</button></li>
                            <li><button disabled = {getRole() === Role.Digiviewer? true: false} onClick={stopHandler} type="button" class="btn btn-block btn-outline-primary btn-sm">Close Batch</button></li>
                        
                            <li><button disabled = {getRole() === Role.Digiviewer? true: false} onClick={updateDeviceHandler} type="button" class="btn btn-block update-btn btn-outline-warning btn-sm">Update Device</button></li>
                            {enableLink?
                            <li><Link to={{
                                pathname: 'batchSummary/'+summarydata,
                            
                            }} target="_blank" className="btn btn-block btn-secondary btn-sm" >Summary</Link></li>:
                            <li><span onClick={summaryHandler} className="btn btn-block btn-outline-secondary btn-sm">Summary</span></li>
                            }
                            {/* <li><button disabled = {getRole() === Role.Digiviewer? true: false} type="button" class="btn btn-block btn-outline-danger btn-sm">Terminate Batch</button></li> */}
                        
                        </ul>
                    </div>
                </div>
              
                <DataTable
                    columns={columns}
                    data={displayData}
                    defaultSortField="batchID"
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
            <PopupModal title={popupTitle} selectedBatch={selectedRows}  show={showUpdatePopup} key= {Math.random()} onChange={closePopup} />
            <CloseBatch key = {Math.random()}
            show = {showStopBatch} onChange={closePopup}
            batchName = {popupTitle}  batchID = { batchID } farmName = {farmName} farmID={farmID}
            accumaltedWeight = {accumaltedWeight}
            ></CloseBatch>
            <UpdateDevice
            onChange={closePopup} show = {showUpdateBatch}
            batchName = {popupTitle}  batchID = { batchID } farmName = {farmName} deviceList={devicesList}>
            </UpdateDevice>
        </div>
        
    );
}

const PopupModal = (props) => {
     
     function handleChange(){
        props.onChange (false);
     }
     const [message, setMessage] = useState('');
    //  const {register, handleSubmit, errors, control, formState} = useForm ({
    //     mode:'onChange'
    //   });
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
        const [male, setMale] = useState(0);
        const [female, setFemale] = useState(0);
        const [errorStatus, setErrorStatus] = useState(false);
     const startBatch = (data, e)=>{
            e.preventDefault();
            let batchID = props.selectedBatch[0].batchID;
            
            if(data.sexing === 'no') {
                data.male=0;
                data.female=0;
            } else {
                data.numberofBirds = parseInt(data.male)+parseInt(data.female);
            }
           
            //alert(JSON.stringify(data));
            axios.put(env.produrl+'/updateBatchWithstartDate/', null, {
                params: { batchID, numberofBirds: data.numberofBirds, male: data.male, female: data.female, sexing: data.sexing }
            })
            .then(res=>{
                console.log(res)
                setMessage(res.data.message);
                setErrorStatus(res.data.status);
            }).catch((err) =>{
                 console.log(err.response.data.message);
                 setMessage( err.response.data.message)
            });
      }
      const [sexingSelection, setSexingSelection] =useState('no');

      const onSexingSelection = (e)=>{
        setSexingSelection(e.target.value);
      }
     
    
    return(
        <div>
            <Modal show={props.show}>
                <Modal.Header>
                    <Modal.Title>
                    <FontAwesomeIcon />
                        Batch Name<b>: {props.title}</b></Modal.Title>
                </Modal.Header>
                <form onSubmit = {handleSubmit(startBatch)}>
                    <Modal.Body>
                        
                        <div className="row">
                              <div className="col-md-12">
                                  <span className={errorStatus?'text-success':'text-danger'}><strong>{message}</strong></span>
                              </div>
                              <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Sexing</label>
                                        <select class="form-control" name='sexing'
                                            {...register("sexing", {
                                                required: "Please select sexing",
                                            })}
                                            onChange={(e)=>{ onSexingSelection(e)}}
                                        >
                                            <option>-Select-</option>
                                            <option value='no'>No</option>
                                            <option value='yes'>Yes</option>
                                        </select>
                                        {errors.sexing && <span className="err-msg">{errors.sexing.message}</span>}
                                    </div> 
                               </div>
                               {sexingSelection==='yes'?
                               <div className="col-md-12" key={Math.random()}>
                                    <div className="row">
                                        <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Male Birds</label>
                                                    <input type="number" className="form-control"  placeholder="Number of male birds"
                                                    name="male"
                                                    // onKeyUp={(e)=>handleMaleChange(e)}
                                                    {...register("male", {
                                                        required: "Please enter number of male birds",
                                                        pattern: { value: /^[0-9]+$/i, message: 'Invalid Number'}
                                                    })}

                                                />
                                                    {errors.male && <span className="err-msg">{errors.male.message}</span>}
                                                </div> 
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Female Birds</label>
                                                <input type="number" className="form-control"  placeholder="Number of female birds"
                                                name="female" 
                                                //onKeyUp={(e)=>handleFemaleChange(e)}
                                                {...register("female", {
                                                    required: "Please enter number of female birds",
                                                    pattern: { value: /^[0-9]+$/i, message: 'Invalid Number'}
                                                })}

                                            />
                                                {errors.female && <span className="err-msg">{errors.female.message}</span>}
                                            </div> 
                                        </div>
                                    </div>
                               </div>
                               :<></>}
                                {
                                    sexingSelection==='yes'?<></>:
                                
                               <div className="col-md-12" key={Math.random()}>
                                    <div className="form-group">
                                        <label>Number of Birds</label>
                                        <input type="number" 
                                        className="form-control"  placeholder="Enter number of birds"
                                        name="numberofBirds" 
                                        {...register("numberofBirds", {
                                            required: "Please enter number of birds",
                                            pattern: { value: /^[0-9]+$/i, message: 'Invalid Number'}
                                        })}

                                      />
                                        {errors.numberofBirds && <span className="err-msg">{errors.numberofBirds.message}</span>}
                                    </div> 
                               </div>
                               }
                           </div>
                    </Modal.Body>
                <Modal.Footer>
                    
                    <input type="submit" value="Submit"class="btn btn-primary" />
                    <Button variant="secondary" onClick={handleChange}>Close</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </div>  
    );
}
//export default BatchHistory;
export default withRouter(BatchHistory);