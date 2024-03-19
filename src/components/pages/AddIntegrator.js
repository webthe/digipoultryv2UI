import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import axios from 'axios';
import { headers } from '../utils/common';
import { Modal, Button } from 'react-bootstrap';
import * as axiosInstance from '../utils/axiosinstace';
const AddIntegrator = (props) => {
    const [headersobj] = useState(headers());
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [title, setTitle] = useState('Add')
    const onSubmit = async(data, e) => {
        
        e.preventDefault();
        try {
            const response = await axiosInstance.addIntegrator(data)
            console.log(response.message);
            setShowResults(true);
            setResultMessage({
                error: false, message: response.message
            });
            reset();
        } catch (err) {
            console.log(err)
                setShowResults(true)
                setResultMessage({
                    error: true, message: err.response.data.message
                });
        }
    }
    const handleChange = () => {
        props.onChange(false);
        setShowResults(false);
    }
    useEffect(()=>{
        // if(props.) {

        // }
    },[])
    return (
        <div className="updateDevice">

            <Modal show={props.show}>
                <Modal.Header>
                    <Modal.Title>
                        Add Integrator
                    </Modal.Title>
                </Modal.Header>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Body>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor>Integrator Name</label>
                                <input type="text" className="form-control" placeholder="Enter Integrator Name"
                                    name="name"
                                    {...register("name", {
                                        required: "Please enter Integrator name",
                                        minLength: { value: 3, message: 'Name is too short' },
                                        maxLength: { value: 200, message: 'Too Long for a Name' }
                                    })}
                                />
                                {errors.name && <span className="err-msg">{errors.name.message}</span>}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor>Select Status</label>
                                <select class="form-control" name="status"
                                    {...register('status', {
                                        required: 'Please select Status'

                                    })}
                                >
                                    <option value=''>-Select-</option>
                                    <option value='Active'>Active</option>
                                    <option value='Inactive'>Inactive</option>
                                </select>
                                {errors.status && <span className="err-msg">{errors.status.message}</span>}
                            </div>
                        </div>
                        {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                    </Modal.Body>
                    <Modal.Footer>

                        <input type="submit" value="Submit" className="btn btn-primary" />
                        {/* <button type="submit" className="btn btn-primary">Submit</button> */}
                        <Button variant="secondary" onClick={handleChange}>Close</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
const Results = (props) => {
    let error, classes;
    if (props.error === false) {
        error = 'Success';
        classes = 'alert alert-success alert-dismissible fade show'
    } else {
        error = 'Error!';
        classes = 'alert alert-danger alert-dismissible fade show'
    }
    return (
        <div className="results">
            <div className={classes}>
                <strong>{error}</strong> {props.message}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
            </div>
        </div>
    );
}
export default AddIntegrator;
