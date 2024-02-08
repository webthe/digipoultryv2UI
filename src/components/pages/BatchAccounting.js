import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import axios from 'axios';
import { headers } from '../utils/common';
import {env} from './const';

const BatchAccouting = (props) => {
    console.log(props.rate)
    const [headersobj] = useState(headers());
    const [list, setList] = useState(props.expenses); 
   
    const { register, control, reset, handleSubmit, watch, formState: { errors } } = useForm({
      mode: 'onChange',
      defaultValues: {
        expensesList: props.expenses
      }
    });
    const {
        register: register2,
        formState: {errors: errors2},
        handleSubmit: handleSubmit2
      } = useForm({
        mode: "onChange"
      });
    const watchAllFields = watch();
    const addRow = () => {
        append({
            item:'',
            units: '',
            rate: '',
            amount: 0
        });
        
      }
     const onSubmit = (data, e)=>{
        e.preventDefault();
        
        let dataObj = {
            expenses: data.expensesList,
            batchID: props.batchID,
            farmID: props.farmID
        }
        axios.post(env.produrl+'/expenses/add/', dataObj, { headers: headersobj}
        ).then(res=>{
                alert(res.data.message);
                // reset({
                //     weightList: [{ weight: ''}]
                // })
            }).catch((err) =>{
                console.log(err);
                alert(err.response.data.message);
        });
        
     }
      
      const { fields, append, remove } = useFieldArray(
        {
          control,
          name: "expensesList"
        }
      );
      const [totalAmount, setTotalAmount] = useState([]);
      const [revenue, setRevenue]= useState(props.revenue);
      const [netIncome, setNetIncome]=useState(props.totalIncome);
      const [disable, setDisable] = useState(props.baccStatus);
      const [rate, setRate] = useState(props.rate);
      const freezeExpenses = (data, e)=>{
        e.preventDefault();
        console.log(data);
        let dataObj = {
            rate: data.rate,
            batchID: props.batchID
        }
        axios.put(env.produrl+'/expenses/freeze/', dataObj, { headers: headersobj}
        ).then(res=>{
                alert(res.data.message);
                setDisable(true);
            }).catch((err) =>{
                setDisable(false);
                console.log(err);
                alert(err.response.data.message);
        });
      }
      useEffect(()=>{
        //alert(JSON.stringify(watchAllFields.expensesList))
        console.log(watchAllFields.expensesList.length)
        if(watchAllFields.expensesList.length>0) {
            watchAllFields.expensesList.forEach((item, index)=>{
                if(item.amount==='') {
                    item.amount=0;
                } else {
                    item.amount = item.units*item.rate
                }
            })
            let _totalAmount=0;
            _totalAmount = watchAllFields.expensesList.reduce((a,b)=>{
                return parseFloat(a)+parseFloat(b.amount);
            },0);
            
            setTotalAmount(_totalAmount);
           
          }
      },[watchAllFields, totalAmount])
      
    return (
        <div className="batchAccounting">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header border-0">
                                <div className="d-flex justify-content-between">
                                    <h3 className="card-title"><strong>Expenses</strong></h3>
                                </div>
                        </div>
                        <div className="card-body nh">
                            <form onSubmit={handleSubmit(onSubmit)}>
                            
                            <p>{disable? 'Expenses Summary':'Enter expenses of each iteration below and click "+" to add next iteration. Click "-" to remove any entry.'} </p>
                                <ul className="expensesList">
                                    <li>
                                        <div className="row spanFont">
                                            <div className="col-md-4">
                                                <span>Item</span>
                                            </div>
                                            <div className="col-md-2">
                                                <span>Units</span>
                                            </div>
                                            <div className="col-md-2">
                                                <span>Rate(RM)</span>
                                            </div>
                                            <div className="col-md-2">
                                                <span>Amount</span>
                                            </div>
                                        </div>
                                    </li>
                                    {fields.map((item, index) => {
                                    return (
                                        <li key={item.id}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group input-group-sm">
                                                    {/* <label>Item</label> */}
                                                    <input type="text"
                                                    readOnly={disable? true:false}
                                                    name={`expensesList[${index}].item`}
                                                    defaultValue={item.item} // make sure to set up defaultValue
                                                    {...register(`expensesList[${index}].item` , {required: 'Required'})}
                                                    className="form-control" placeholder="Item Name" />
                                                    { errors.expensesList? errors.expensesList[index] && <span className="err-msg">
                                                    {errors.expensesList[index].item ? errors.expensesList[index].item.message: ''}</span> : null }
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group input-group-sm">
                                                    <input type="text"
                                                        readOnly={disable? true:false}
                                                        id={`expensesList[${index}].units`}
                                                        name={`expensesList[${index}].units`}
                                                        defaultValue={item.units} // make sure to set up defaultValue
                                                        control={control}
                                                        {...register(`expensesList[${index}].units`,{required: 'Required'}) }
                                                        onKeyUp = {  
                                                            (e)=>{
                                                                let rateVal = document.getElementById(`expensesList[${index}].rate`);
                                                              
                                                                if(rateVal === null || rateVal ===undefined ) {
                                                                 
                                                                  document.getElementById(`expensesList[${index}].amount`).value = 0;
                                                                } else {
                                                                 document.getElementById(`expensesList[${index}].amount`).value = e.target.value * rateVal.value;
                                                                }
                                                               
                                                            }
                                                        }
                                                        className="form-control" placeholder="Units" />
                                                     { errors.expensesList? errors.expensesList[index] && <span className="err-msg">
                                                    {errors.expensesList[index].units ? errors.expensesList[index].units.message: ''}</span> : null }
                                                </div> 
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group input-group-sm">
                                                
                                                    <input type="text"
                                                        id = {`expensesList[${index}].rate`}
                                                        readOnly={disable? true:false}
                                                        name={`expensesList[${index}].rate`}
                                                        defaultValue={`${item.rate}`} // make sure to set up defaultValue
                                                        {...register(`expensesList[${index}].rate`,{required: 'Required'})}
                                                       onKeyUp = {  
                                                           (e)=>{
                                                               let unitVal = document.getElementById(`expensesList[${index}].units`);
                                                             
                                                               if(unitVal === null || unitVal ===undefined ) {
                                                                
                                                                 document.getElementById(`expensesList[${index}].amount`).value = 0;
                                                               } else {
                                                                document.getElementById(`expensesList[${index}].amount`).value = e.target.value * unitVal.value;
                                                               }
                                                           }
                                                       }
                                                        className="form-control" placeholder="Rate" />
                                                        { errors.expensesList? errors.expensesList[index] && <span className="err-msg">
                                                    {errors.expensesList[index].rate ? errors.expensesList[index].rate.message: ''}</span> : null }
                                                </div>    
                                            </div>    
                                            <div className="col-md-2">
                                                <div className="form-group input-group-sm">
                                                   
                                                    <input type="text"
                                                        id={`expensesList[${index}].amount`}
                                                        name={`expensesList[${index}].amount`}
                                                        defaultValue={item.amount} // make sure to set up defaultValue
                                                        {...register(`expensesList[${index}].amount`,{required: 'Required'})}
                                                        // ref={register(
                                                        //     {
                                                        //         required: 'Required',
                                                        //         pattern: { value: /^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/, message: 'Invalid Entry'}
                                                        //     }
                                                        // )}
                                                        readOnly
                                                        
                                                        className="form-control" placeholder="Amount" />
                                                      
                                                </div>
                                            </div>    
                                            
                                                <div className="col-md-1">
                                                    {disable ? '' : 
                                                    <button type="button" className="btn btn-danger" onClick={() =>{
                                                        if(fields.length>1) {
                                                            remove(index)
                                                        }
                                                    } }> - </button>
                                                    }
                                                </div>
                                                <div className="col-md-1">
                                                 
                                                    {(fields.length===index+1 )&& !disable? <button type="button" className="btn btn-secondary" onClick={()=>{addRow()}}>+</button> : ""}
                                                
                                                </div>
                                        </div>
                                    
                                        </li>
                                    );
                                    })}
                                </ul>
                                <div className="col-md-10 totalBox text-right">
                                    <span>Total: </span>
                                    <span className="number" key={Math.random()}>{totalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                                </div>
                                {
                                    disable? '' : <button type="submit"  className="btn btn-primary">Save/Update</button>
                                }
                                    
                                
                                    &nbsp;&nbsp;&nbsp;
                                { disable? '' :                                   
                                    <button type="button" className="btn btn-info"
                                    onClick={() =>
                                        reset({
                                            expensesList: props.expenses
                                        })
                                    } >Undo changes
                                    </button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header border-0">
                                <div className="d-flex justify-content-between">
                                    <h3 className="card-title"><strong>Income</strong></h3>
                                </div>
                        </div>
                        <div className="card-body nh">
                            
                            <p>{disable? 'Income Summary':'Enter Rate per Kg to generate Revenue and Income'} </p>
                            <form onSubmit={handleSubmit2(freezeExpenses)}>
                                <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-group mb-3">
                                                <label class="labelText control-label col-md-3">
                                                    Total Weight
                                                </label>
                                                <input
                                                    className="form-control col-md-8"
                                                    placeholder="Enter Measured weight"
                                                    readOnly
                                                    value={props.accumaltedWeight.toLocaleString(undefined, {maximumFractionDigits:2})}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">Kg</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-group mb-3">
                                            
                                                <label class="labelText control-label col-md-3">
                                                    Rate per Kg
                                                    
                                                </label>
                                                
                                                <input
                                                    defaultValue={rate===0 ? '' : rate}
                                                    name='rate'
                                                    readOnly={disable? true:false}
                                                    className="form-control col-md-8"
                                                    placeholder="Enter Rate per Kg"
                                                    
                                                    {...register2('rate',
                                                        {
                                                            required: 'Required',
                                                            pattern: { value: /^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/, message: 'Invalid Entry'},
                                                            onChange :
                                                              (e)=>{
                                                                  setRevenue((e.target.value*props.accumaltedWeight).toLocaleString(undefined, {maximumFractionDigits:2}));
                                                                  setNetIncome(((e.target.value*props.accumaltedWeight)-totalAmount))
                                                              }
                                                          
                                                        }
                                                    )}
                                                />
                                                
                                                <div className="input-group-append">
                                                    <span className="input-group-text">RM</span>
                                                </div>
                                                <div className="col-md-8 offset-3">
                                                  {errors2.rate && <span className="err-msg">{errors2.rate.message}</span>}
                                                </div>
                                            </div>
                                          
                                        </div>
                                       
                                        <div className="col-md-12">
                                            <div className="input-group mb-3">
                                                <label class="labelText control-label col-md-3">
                                                    Revenue
                                                </label>
                                                <input
                                                    name="revenue"
                                                    className="form-control col-md-8"
                                                    placeholder="Enter Revenue"
                                                    value={revenue.toLocaleString(undefined, { maximumFractionDigits: 2})}
                                                    readOnly
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">RM</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-group mb-3">
                                                <label class="labelText control-label col-md-3">
                                                    Net Income
                                                </label>
                                                <input
                                                    name='netIncoome'
                                                    className="form-control col-md-8"
                                                    placeholder="Enter Measured weight"
                                                    readOnly
                                                    value={ //netIncome
                                                    //    
                                                    isNaN(netIncome) ? 0 : netIncome.toLocaleString(undefined, {maximumFractionDigits: 2})
                                                    }
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">RM</span>
                                                </div>
                                            </div>
                                        </div>
                                         
                                        <div className="col-md-12">
                                            {disable? '':
                                            <div className="custom-control custom-checkbox">
                                                <input name="agree" 
                                                {...register2('agree',
                                                    {
                                                        required: 'Required'
                                                    }
                                                )}
                                                className="custom-control-input" type="checkbox" id="customCheckbox1" />
                                                <label htmlFor="customCheckbox1" style={{fontWeight: "normal"}} className="custom-control-label">This will freeze the expenses entry &amp; you will not be able to make any changes later. Press 'Freeze' to proceed". </label>
                                                {errors2.agree && <span className="err-msg" >{errors2.agree.message}</span>}
                                            </div>
                                            }
                                        </div>
                                               
                                    </div>
                                
                                    {disable? '':
                                        <button type="submit"  className="btn btn-primary">Freeze</button>
                                    }
                                   
                                </form>
                        </div>
                    </div>
                </div>
            </div>
            
           
        </div>
    )
}
export default BatchAccouting;
