import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import axios from 'axios';
import { headers } from '../utils/common';
import {Modal, Button} from 'react-bootstrap';
import {env} from './const';
import moment from 'moment';
import Datepicker from 'react-datepicker';
const AddDevice = (props) => {
    const [headersobj] = useState(headers());
    const [data, setData] = useState([{ weight: '' }]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [duration, setDuration] = useState(0);
    const { register, control, handleSubmit, reset, watch , errors, formState} = useForm({
        defaultValues: {
          weightList: data
        },
        mode:'onChange'
      });
      const watchAllFields = watch();
      //console.log("watchAllFields", watchAllFields);
      
      const { fields, append, remove } = useFieldArray(
        {
          control,
          name: "weightList"
        }
      );
      const [showPreview, setShowPreview] = useState(false);
    //   const [totalCollected, setTotalCollected] = useState(0);
    //   const [avgWeight, setAvgWeight] = useState(0);
    //   const [feedConvRatio, setFeedConvRatio] = useState(0);
    //   const [totalWeight, setTotalWeight] = useState(0);
      const [batchSummary, setBatchSummary] = useState({

      });
      let [accWeight, setAccweight] = useState(props.accumaltedWeight);
      const [accWeightUpdate, setAccWeightUpdate] = useState(false);

      const onSubmit = (data, e) => {
        e.preventDefault();
        const _totalWeight = data.weightList.reduce((a,b)=>{
            return a+parseFloat(b.weight);
        },0);
        let dataObj = {
            batchID: props.batchID,
            weight: _totalWeight
        }
        axios.post(env.produrl+'/closeBatch/addWeights/', dataObj, { headers: headersobj}
        ).then(res=>{
               // console.log(res.data.accumaltedWeight);
                setAccweight(_totalWeight+props.accumaltedWeight);
                setAccWeightUpdate(true)
                alert(res.data.message);
                reset({
                    weightList: [{ weight: ''}]
                })
            }).catch((err) =>{
                console.log(err);
                alert(err.response.data.message);
        });
      }
     
      
      const addRow = () => {
        if(fields.length >=10) {
            alert("Maximum of 10 samples is allowed");
            return;
        }
        append({ weight: ''});
        
      }
      
      const handleChange = ()=>{
          props.onChange(false);
      }
      const finalize = () => {
        
        axios.get(env.produrl+'/batchSummary/'+props.batchID, { headers: headersobj}
        ).then(res=>{
            setShowPreview(true);
            console.log(res.data.list[0])
            setBatchSummary(res.data.list[0]);
            }).catch((err) =>{
                console.log(err);
                alert(err.response.data.message);
        });
      }
      const [is_checked,set_is_checked]= useState(false);
      const closeBatch = ()=>{
        
        let closeDate = moment(selectedDate).format('YYYY-MM-DD hh:mm:ss');
       
       
        if(selectedDate===null) {
            alert("Please select close date");
            return;
        }
        if(is_checked === false) {
            alert("Please accept the note and click on close batch to proceed");
            return;
        }
        //update close batch status
        axios.put(env.produrl+'/closeBatch/update/', {farmID: props.farmID, batchID: props.batchID, closeDate: closeDate}, { headers: headersobj}
        ).then(res=>{
            alert(res.data.message);
            window.location.reload();
        }).catch((err) =>{
                console.log(err);
                alert(err.response.data.message);
        });
      }
      const dateSelector = (date)=>{
        setSelectedDate(date);
        let closeDate = moment(date).format('YYYY-MM-DD');
        setDuration(moment(closeDate).diff(moment(batchSummary.startDateTime).format('YYYY-MM-DD'), 'days')+1)
      }
      useEffect(()=>{
        if(watchAllFields.weightList.length>0) {
            let _totalWeight=0;
            _totalWeight = watchAllFields.weightList.reduce((a,b)=>{
                return parseFloat(a)+parseFloat(b.weight);
            },0);
            if(!accWeightUpdate) {
                if(!isNaN(_totalWeight)) {
                    setAccweight(_totalWeight+props.accumaltedWeight);
                }
                
            }
           
          }
       
      },[data, accWeight, watchAllFields.weightList, props.accumaltedWeight, accWeightUpdate])
    return (
        <div className="closeBatch">
            
            <Modal show={props.show} size={showPreview?'lg': ''}>
                <Modal.Header>
                    <Modal.Title>
                    {/* <FontAwesomeIcon icon={icon} color={iconColor} /> */}
                    Close Batch: <b>{props.batchName} - {props.farmName}</b></Modal.Title>
                </Modal.Header>
                {!showPreview ?
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                   
                        <p>Enter weight of each iteration below and click '+' to add next iteration.
                        Click '-' to remove any entry.</p>
                        <p><strong>Accumulated Weight: </strong>{accWeight}</p>
                            <ul className="weightList">
                                {fields.map((item, index) => {
                                return (
                                    <li key={item.id}>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="input-group mb-3">
                                           
                                                <label class="labelText control-label col-md-3">
                                                    Weight  {index+1}
                                                </label>
                                               
                                                <input
                                                    name={`weightList[${index}].weight`}
                                                    defaultValue={`${item.weight}`} // make sure to set up defaultValue
                                                    ref={register(
                                                        {
                                                            required: 'Enter Weight', 
                                                            pattern: { value: /^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/, message: 'Invalid Entry'}
                                                        }
                                                    )}
                                                    className="form-control col-md-8"
                                                    placeholder="Enter Measured weight"
                                                    
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">Kg</span>
                                                </div>
                                               
                                                
                                            </div>
                                            
                                        </div>
                                        <div className="col-md-1">
                                            <button type="button" className="btn btn-danger" onClick={() =>{
                                                if(fields.length>1) {
                                                    remove(index)
                                                }
                                            } }> - </button>
                                        </div>
                                        <div className="col-md-1">
                                            {(fields.length===index+1 )? <button type="button" className="btn btn-secondary" onClick={addRow}>+</button> : ""}
                                            
                                        </div>
                                        <div className="col-md-12">
                                        { errors.weightList? errors.weightList[index] && <span className="err-msg">
                                                    {errors.weightList[index].weight ? errors.weightList[index].weight.message: ''}</span> : null }
                                        </div>
                                       
                                       
                                    </div>
                                   
                                    </li>
                                );
                                })}
                            </ul>
                            
                            
                    </Modal.Body>
                <Modal.Footer>
                    
                    {/* <input type="submit" value="Preview" className="btn btn-primary" /> */}
                    <button type="submit"  className="btn btn-primary">Pause Operations</button> 
                    <button type="button" className="btn btn-info"
                    onClick={() =>
                        reset({
                          weightList: [{ weight: ''}]
                        })
                    }
                    >Reset</button>          
                    <Button variant="success" onClick={finalize}>Finalize</Button>
                    <Button variant="secondary" onClick={handleChange}>Exit</Button>
                </Modal.Footer>
                </form>
                : 
                <div>
                    <Modal.Body>
                    <h5>Batch Summary</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <table className="table table-sm table-bordered summary-table">
                                <tr>
                                    <th>Batch</th>
                                    <td>{batchSummary.batchName}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Farm</th>
                                    <td>{batchSummary.farmName}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Template</th>
                                    <td>{batchSummary.templateName}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Bird Type</th>
                                    <td>{batchSummary.breedName}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Start Date</th>
                                    <td>{moment(batchSummary.startDateTime).format('DD-MMM-YYYY')}</td>
                                    
                                </tr>
                                {batchSummary.selection?
                                <tr>
                                    <th>Close Date</th>
                                    <td>
                                        <Datepicker 
                                        selected={selectedDate} 
                                        onChange = {dateSelector}
                                        //showTimeSelect
                                        //setDuration(moment(closeDate).diff(batchSummary.startDate))
                                        placeholderText = "Select Close Date" 
                                        maxDate={new Date()}
                                        minDate={new Date(moment(batchSummary.startDateTime).format('YYYY-MM-DD'))}
                                        dateFormat="dd-MMM-yyyy"
                                        name="closeDate"
                                        className = "form-control"
                                        >
                                        </Datepicker>
                                        
                                    </td>
                                    
                                </tr>
                                :
                                <tr>
                                    <th>Close Date</th>
                                    <td>{moment(batchSummary.closeDate).format('DD-MMM-YYYY')}</td>
                                    
                                </tr>
                                
                                }
                                <tr>
                                    <th>Duration</th>
                                    <td>
                                        {batchSummary.selection?
                                        duration+" days": 
                                        //moment(moment(batchSummary.closeDate).format('YYYY-MM-DD')).diff(moment(batchSummary.startDateTime.format('YYYY-MM-DD'), 'days'))
                                        moment(moment(batchSummary.closeDate).format('YYYY-MM-DD')).diff(moment(batchSummary.startDateTime).format('YYYY-MM-DD'), 'days') +" days"
                                        }
                                        
                                    </td>
                                    
                                </tr>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <table className="table table-sm table-bordered summary-table">
                               
                                <tr>
                                    <th>Total No. of Birds at start</th>
                                    <td>{batchSummary.nubmerofchicks}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Chick Mortality</th>
                                    <td>{batchSummary.totalMortality}</td>
                                    
                                </tr>
                                <tr>
                                    <th>Total No. of Birds at close</th>
                                    <td>{batchSummary.totalBirdsAtClose}</td>
                                    
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row" id="summary">
                        <div className="col-md-12"><h5>Batch Outcome</h5></div>
                        <div class="col-lg-3 col-6">
                            
                            <div class="small-box bg-warning">
                            <div class="inner">
                                <h3>{batchSummary.totalWeight} Kg</h3>

                                <p>Total Weight</p>
                            </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            
                            <div class="small-box bg-info">
                            <div class="inner">
                                <h3>{(batchSummary.feedWeight)} Kg</h3>
                                <p>Total Feed</p>
                            </div>
                            </div>
                            
                        </div>
                        
                       
                        
                        <div class="col-lg-3 col-6">
                            
                            <div class="small-box bg-danger">
                            <div class="inner">
                                <h3>{batchSummary.avgchickweight} Kg</h3>
                                
                                <p>Avg. Bird Weight</p>
                            </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <div class="small-box bg-success">
                            <div class="inner">
                                <h3>{isNaN(batchSummary.fcr)?0:batchSummary.fcr}</h3>
                                <p>FCR</p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input onChange={()=>{ set_is_checked(!is_checked)}} className="custom-control-input" type="checkbox" id="customCheckbox1" />
                            <label htmlFor="customCheckbox1" className="custom-control-label">This will close this Batch &amp; you will not be able to make any changes later. Press 'Close Batch' to proceed". </label>
                        </div>

                     
                    </Modal.Body>
                    <Modal.Footer>
                        <input type="submit" value="Close Batch" onClick={closeBatch} className="btn btn-primary" />
                        <Button variant="secondary" onClick={handleChange}>Exit</Button>
                    </Modal.Footer>
                </div>
                } 
            </Modal>
           
        </div>
    )
}
export default AddDevice;
