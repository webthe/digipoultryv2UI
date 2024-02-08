
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'
import * as axiosInstance from '../utils/axiosinstace';
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ErrorModal from '../misc/ErrorModal';
import { env } from './const';
import { headers } from '../utils/common';
const AddTemplates = () => {
    const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
        mode: 'onChange',
    });
    const [phases, setPhases] = useState(0);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "phases"
    });
    const [errorModal, setErrorModal] = useState({
        show: false, message: '', estatus: false
    })
    const [headersobj] = useState(headers());
    let handleChange = (newVal) => {

        setErrorModal({
            show: newVal, message: '', estatus: false
        })
    }


    const onSubmit = (data, e) => {
        e.preventDefault();
       // alert(JSON.stringify(data));
        axios.post(`${env.produrl}/templateMaster`, data, { headers: headersobj })
            .then(res => {
                setErrorModal(prevErrorModal => ({
                    ...prevErrorModal,
                    show: true, message: res.data.message, estatus: false,
                }));
                e.target.reset();
            })
            .catch(err => {
                setErrorModal(prevErrorModal => ({
                    ...prevErrorModal,
                    show: true, message: err.response.data.message, estatus: true,
                }));
            });
    };

    const onchangeHandler = (e) => {
        const newPhaseCount = parseInt(e.target.value, 10);
        setPhases(newPhaseCount);
    };
    
    useEffect(() => {
        // Clear existing fields
        for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
        }
    
        // Append fields based on the selected number of phases
        const newFields = Array.from({ length: phases }, (_, i) => ({ id: i }));
        append(newFields);
    }, [phases, append, remove]);

    return (
        <div className="batchOperations">
            <div className="row mb-2">
                <div className="col-sm-6">
                    <h2 className="m-0 text-dark">Batch Setup</h2>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Template Name</label>
                                        <input type="text" className="form-control" {...register('templateName', { required: "Template Name Required", minLength: 3, maxLength: 20 })} />
                                        {errors.templateName && <span className="err-msg">{errors.templateName.message}</span>}
                                    </div>
                                </div>
                                <div className="form-group col-md-2">
                                    <label>Frequency</label>
                                    <input type="text" className="form-control" {...register('frequency', { required: 'Enter Frequency', pattern: /^[0-9]+$/i })} />
                                    {errors.frequency && <span className="err-msg">{errors.frequency.message}</span>}
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Description</label>
                                    <input type="text" className="form-control" {...register('description', { required: 'Enter Description', minLength: 3, maxLength: 150 })} />
                                    {errors.description && <span className="err-msg">{errors.description.message}</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-2">
                                    <label>Duration (in Days)</label>
                                    <input type="text" className="form-control" {...register('duration', { required: 'Enter Duration', pattern: /^[0-9]+$/i })} />
                                    {errors.duration && <span className="err-msg">{errors.duration.message}</span>}
                                </div>
                                <div className="form-group col-md-2">
                                    <label>No. of Phases</label>
                                    <select className="form-control" {...register('numberOfPhases', { required: 'Select Number of Phases' })} onChange={onchangeHandler}>
                                        <option value=''>-Select-</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                    {errors.numberOfPhases && <span className="err-msg">{errors.numberOfPhases.message}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Select Breed</label>
                                    <select className="form-control" {...register('breed', { required: 'Select Breed' })}>
                                        <option value=''>-Select-</option>
                                        <option value="1">Broiler - Cobb</option>
                                        <option value="2">Broiler - Ross</option>
                                        <option value="3">Broiler - Arbor Acres</option>
                                        <option value="4">Broiler - Indian River</option>
                                        <option value="5">Broiler - Hubbard</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                {fields.map((field, index) => (
                                    <div className="col-md-4 mb-2" key={field.id}>
                                        <h4>Phase {index + 1}</h4>
                                        <table className='dynamicForm'>
                                            <tbody>
                                                <tr>
                                                    <td valign='top' style={{ width: 100 }}>Duration</td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].days`, { required: 'Duration is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.days && <span className="err-msg">{errors.phases[index].days.message}</span>}

                                                    </td>
                                                    <td valign='top'> Days</td>
                                                </tr>
                                                <tr>
                                                    <td valign='top' style={{ width: 100 }}>Temp. (°C)</td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].tmin`, { required: 'Minimum temperature is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.tmin && <span className="err-msg">{errors.phases[index].tmin.message}</span>}
                                                    </td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].tmax`, { required: 'Maximum temperature is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.tmax && <span className="err-msg">{errors.phases[index].tmax.message}</span>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign='top' style={{ width: 100 }}>RH (%)</td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].rmin`, { required: 'Minimum RH is required', max: 100 })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.rmin && <span className="err-msg">{errors.phases[index].rmin.message}</span>}
                                                    </td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].rmax`, { required: 'Maximum RH is required', max: 100 })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.rmax && <span className="err-msg">{errors.phases[index].rmax.message}</span>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign='top' style={{ width: 100 }}>CO<sub>2</sub> (ppm)</td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].cmin`, { required: 'Minimum CO2 level is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.cmin && <span className="err-msg">{errors.phases[index].cmin.message}</span>}
                                                    </td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].cmax`, { required: 'Maximum CO2 level is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.cmax && <span className="err-msg">{errors.phases[index].cmax.message}</span>}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign='top' style={{ width: 100 }}>NH<sub>3</sub> (ppm)</td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].nmin`, { required: 'Minimum NH3 level is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.nmin && <span className="err-msg">{errors.phases[index].nmin.message}</span>}
                                                    </td>
                                                    <td valign='top'>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            {...register(`phases[${index}].nmax`, { required: 'Maximum NH3 level is required' })}
                                                        />
                                                        {errors.phases && errors.phases[index]?.nmax && <span className="err-msg">{errors.phases[index].nmax.message}</span>}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>

                            <div className='row'>
                                <div className="form-group col-md-4">
                                    <input type="submit"  value="Save Template" className="btn btn-primary" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ErrorModal key={Math.random()} onChange={handleChange} estatus={errorModal.estatus} show={errorModal.show} message={errorModal.message}></ErrorModal>
        </div>

    );
}
export default AddTemplates;