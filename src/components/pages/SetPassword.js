import React, { useEffect, useState, useRef} from 'react';
import { useForm, Controller } from "react-hook-form";

import { NavLink } from "react-router-dom";
import { useParams } from 'react-router-dom';
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { useHistory } from 'react-router-dom';
import * as axiosInstance from '../utils/axiosinstace';
const SetPassword = (props) => {
    const history = useHistory();

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [propsData] = useState(JSON.parse(base64_decode(props.match.params.user)));
   
    const [showErrorMessage, setShowErroMessage] = useState(false);
    const [errorMessage, setErroMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const countdownRef = useRef(5); // Initial countdown time in seconds
    const startCountdown = () => {
        const timer = setInterval(() => {
            if (countdownRef.current > 0) {
                countdownRef.current -= 1;
            } else {
                clearInterval(timer);
                setShowSuccess(false); // Hide the countdown message
                history.push('/login'); // Redirect to the login page
            }
        }, 1000); // Update the countdown every 1 second (1000 milliseconds)
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const onSubmit = async(data) => {
        // alert(JSON.stringify(data))
        if(data.password !== data.confirmPassword) {
            //alert('error');
            setShowErroMessage(true);
            setErroMessage('Password do not match');
            return;
        }
        data.userParams = propsData;
        alert(JSON.stringify(data)); 
        try {
            const response = await axiosInstance.addCredentials(data);
            if(response.status) {
                setShowSuccess(true);
                setSuccessMessage(response.message);
                startCountdown();
                //history.push('/login');
            } else {
                setShowErroMessage(true);
                setErroMessage(response.message);
            }
        } catch (error) {
            console.log(error.message)
        }
        
    };
    // useEffect(() => {
    //   alert(JSON.stringify(propsData));
    // }, []);
    useEffect(() => {
        // startCountdown();
      }, []);
    return (

        <section className='login-page'>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-4  login-left' style={{ minHeight: '100vh' }}>
                        <div className='left-content'>
                            <div className='logo-placeholder'>
                                <span className='icon'>
                                    <img src='/dist/img/logo-white.png' width={45}></img>
                                </span>
                                <span className='logoText'>iPoultry</span>
                            </div>
                            <div className='text'>
                                <p>
                                    Welcome to iPoultry!
                                </p>
                                <p>
                                    An IoT driven Poultry Operations Management system built on our Digiterrain platform!
                                </p>
                            </div>
                            <div className='copy'>
                                <p>Copyrights 2023, Idealogic, All rights reserved</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <div className='login-placeholder'>
                            <h2><stong>Set Password</stong></h2>
                            <p style={{ color: '#989898', marginBottom: 20 }}>Please enter your credentials to continue!</p>
                            {showErrorMessage ? <span className="err-msg" style={{ textAlign: 'center', fontSize: 16 }}>{errorMessage}</span> : ""}
                            {showSuccess ? <span className="" style={{ textAlign: 'center', color: 'green', fontSize: 16 }}>{successMessage}, redirecting to login page...</span> : ""}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label>Password</label>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{ required: 'Please enter a password' }}
                                            render={({ field }) => (
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control"
                                                    placeholder="Password"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <i className="fas fa-eye-slash"></i>
                                                ) : (
                                                    <i className="fas fa-eye"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.password && (
                                        <div className="err-msg">{errors.password.message}</div>
                                    )}
                                </div>

                                <label>Confirm Password</label>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <Controller
                                            name="confirmPassword"
                                            control={control}
                                            rules={{
                                                required: 'Please confirm your password',
                                               
                                              }}
                                            render={({ field }) => (
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className="form-control"
                                                    placeholder="Confirm Password"
                                                    {...field}
                                                />
                                            )}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? (
                                                    <i className="fas fa-eye-slash"></i>
                                                ) : (
                                                    <i className="fas fa-eye"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div  className="err-msg">{errors.confirmPassword.message}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary btn-block signin">
                                            Set Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
export default SetPassword;