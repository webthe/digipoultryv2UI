import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';
import { env } from './const';
import { setUserSession } from '../utils/common';
import { NavLink } from "react-router-dom";
const Login = (props) => {
   
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [showErrorMessage, setShowErroMessage] = useState(false);
    const [errorMessage, setErroMessage] = useState('');
    const onSubmit = (data, e) => {
        console.log(data)
        e.preventDefault();
        axios.post(env.produrl + '/login', data)
            .then(res => {
                console.log(res.data.message);
                setUserSession(res.data.token, res.data.userDetails[0], res.data.browserDetails, res.data.refreshToken);
                setShowErroMessage(true);
                e.target.reset();
                if (res.status === 200) {
                    props.history.push('/dashboard');
                }

            }).catch((err) => {
                setShowErroMessage(true);
                setErroMessage(err.response.data.message);
            });

    }
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
                            <h2><stong>Welcome back!</stong></h2>
                            <p style={{ color: '#989898', marginBottom: 20 }}>Please enter your credentials to continue!</p>
                            {showErrorMessage? <span className="err-msg" style={{textAlign: 'center', fontSize: 16}}>{errorMessage}</span>: ""}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label>User Name / Email</label>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="User ID" name="username"
                                        {...register("username", { required: true })}
                                        />
                                        
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fa fa-user-circle" />
                                            </div>
                                        </div>
                                        
                                    </div>
                                    {errors.username && <div className="err-msg">Please enter User Name/Email</div>}
                                </div>
                                
                                <label>Password</label>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <input type="password" className="form-control" placeholder="Password" name="password"
                                        {...register("password", { required: true })}
                                        />
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fas fa-lock" />
                                            </div>
                                        </div>
                                    </div>
                                    {errors.password && <div className="err-msg">Please enter password</div>}
                                </div>
                                <div className="row" style={{marginBottom: 15}}>
                                    <div className="col-6">
                                    <div className="icheck-primary">
                                        <input type="checkbox" id="remember" />
                                        <label htmlFor="remember">
                                            Remember Me
                                        </label>
                                    </div>
                                    </div>
                                    <div className="col-6" style={{marginTop: 10, textAlign: 'right'}}>
                                    <NavLink exact to="/forgotpassword" className="nav-link">
                                        Forgot password?
                                    </NavLink>
                                        {/* <a href="forgotpassword" title='Click here to reset your password'>Forgot password?</a> */}
                                    </div>
                                
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary btn-block signin">Sign In</button>
                                    </div>
                                </div>

                            </form>
                            <div className='row' style={{marginTop: 20}}>
                                <div className='col-md-12'>
                                    <div style={{fontSize: 16, marginBottom: 15, fontWeight: 'bold', textAlign: 'center'}}>Mobile app available on App Store and Play Store</div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='qrHolder'>
                                        <img src='/dist/img/iPoutryAppStore.png' width={120}></img>
                                    </div>
                                    <a href='https://apps.apple.com/in/app/ipoultry/id6463606473' target='_blank'>
                                        <img src='/dist/img/appStore.png' width= {200}></img>
                                    </a>
                                </div>
                                <div className='col-md-6'>
                                    <div className='qrHolder'>
                                        <img src='/dist/img/iPoultry_playstore.png' width={120}></img>
                                    </div>
                                    <a href='https://play.google.com/store/apps/details?id=com.ipoultry&hl=en&gl=US' target='_blank'>
                                        <img src='/dist/img/playStore.png' width= {200}></img>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </section>

    );
}
export default Login;