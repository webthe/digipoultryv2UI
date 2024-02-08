import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdInfo } from 'react-icons/md';
import * as axiosInstance from '../utils/axiosinstace';
import { useLoading, Bars } from '@agney/react-loading';
const ForgotPassword = (props) => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Bars width="20" color="#fff" />,
      });
    const { register, control, handleSubmit, watch, formState: { errors }, reset } = useForm({
        mode: 'onChange'
    });
    const [showLoader, setShowloader] = useState(false);
    // const [showErrorMessage, setShowErroMessage] = useState(false);
    // const [errorMessage, setErroMessage] = useState('');
    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [disable, setDisable] = useState(false);

    const [otpTimer, setOtpTimer] = useState(60); // Initial OTP timer value in seconds
    const [circleColor, setCircleColor] = useState('blue'); // Initial circle color
    const [otpExpired, setOtpExpired] = useState(false); // State to track OTP expiration
    const onSubmit = async(data, e) => {

        try {
            console.log(data.username)
            e.preventDefault();
            setShowloader(true);
            if(!disable) {
                const response = await axiosInstance.getEmailValidation(data.username)
                if(response.status) {
                    // setShowResults(true);
                    // setResultMessage({
                    //     error: false, message: 'Please enter OTP recived on your email and set new password'
                    // });
                    setDisable(true);
                    setShowloader(false);
                    setShowOTP(true); // Show OTP input
                } else {
                    setShowResults(true);
                    setResultMessage({
                        error: true, message: response.message
                    });
                    setShowloader(false);
                }
            } else {
                
                const response = await axiosInstance.udpatePassword(data);
                if(response.status) {
                    setShowResults(true);
                    setResultMessage({
                        error: false, message: response.message
                    });
                    setShowloader(false);
                    setDisable(false);
                    setOtpExpired(false);
                    setShowOTP(false);
                    reset();
                } else {
                    setShowResults(true);
                    setResultMessage({
                        error: true, message: response.message
                    });
                    setShowloader(false);
                }
            }
        
        } catch (err) {
            console.log(err.message);
            setShowResults(true);
            setResultMessage({
                error: true, message: err.message
            });
            setShowloader(false);
        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleOTPVisibility = () => {
        setShowOTP(!showOTP);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const PasswordStrengthValidator = (password) => {
        // Minimum length 8, maximum length 20
        const lengthRegex = /^.{8,20}$/;
        // At least one special character
        const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
        // At least one uppercase letter
        const uppercaseRegex = /[A-Z]/;
        return (
            lengthRegex.test(password) &&
            specialCharRegex.test(password) &&
            uppercaseRegex.test(password)
        );
    };
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    useEffect(() => {
        let otpInterval;
    
        // Start the OTP countdown when showOTP is true
        if (showOTP && otpTimer > 0) {
          otpInterval = setInterval(() => {
            setOtpTimer((prevTimer) => prevTimer - 1);
    
            // Change circle color based on timer value
            if (otpTimer <= 5) {
              setCircleColor('grey');
            }
    
            // Stop the timer and set OTP expired when it reaches 0
            if (otpTimer === 0) {
              console.log(otpExpired)
              clearInterval(otpInterval);
              setCircleColor('transparent'); // Hide the circle when expired
              setOtpExpired(true); // OTP has expired
              setShowOTP(false);
            }
          }, 1000);
        }
        // Cleanup the interval when component unmounts or when OTP is no longer shown
        return () => {
          clearInterval(otpInterval);
        };
        
      }, [showOTP, otpTimer, otpExpired]);
    
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
                            <h2><stong>Forgot Password?</stong></h2>
                            <p style={{ color: '#989898', marginBottom: 20 }}>Please enter your registered email address, we will be sending an OTP. </p>
                            <div className='row'>
                                <div className='col-md-12'>
                                    {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : <></>}
                                </div>
                            </div>
                            {showOTP && (
                                <div className="otp-timer">
                                    {otpTimer === 0 ? (
                                    <div className="otp-expired">
                                        <p className='redcolor'>OTP has expired. Please try again.</p>
                                    </div>
                                    ) : (
                                    <div className="circle" 
                                    style={{
                                        borderColor: circleColor,
                                        animation: otpTimer > 0 ? `progress ${otpTimer}s linear` : 'none',
                                      }}
                                    >
                                        OTP expires in {otpTimer}s
                                    </div>
                                    )}
                                </div>
                            )}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label>Email</label>
                                <div className='mb-3'>
                                    <div className="input-group">
                                        <input type="text"
                                            disabled={disable}
                                            className="form-control" placeholder="Your Email Address" name="username"
                                            {...register("username", { required: true,
                                                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  message: 'Invalid Email Address'}
                                            })}
                                        />

                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fa fa-envelope" />
                                            </div>
                                        </div>

                                    </div>
                                    {errors.username && <div className="err-msg">Please enter User Name/Email</div>}
                                </div>
                                {
                                    disable ?
                                        <div className='setPassword'>
                                            <label>OTP</label>
                                            <div className='mb-3'>
                                                <div className="input-group">
                                                    <Controller
                                                        name="otp"
                                                        control={control}
                                                        rules={{
                                                            required: 'Invalid OTP',
                                                            pattern: {
                                                                value: /^[0-9]{6}$/, // Use a regex pattern for 6 numeric characters
                                                                message: 'OTP must be exactly 6 numeric characters',
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <input
                                                                type={showOTP ? 'number' : 'password'}
                                                                className="form-control"
                                                                placeholder="Enter OTP"
                                                                {...field}
                                                            />
                                                        )}
                                                    />

                                                    <div className="input-group-append">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={toggleOTPVisibility}
                                                        >
                                                            {showOTP ? (
                                                                <i className="fas fa-eye-slash"></i>
                                                            ) : (
                                                                <i className="fas fa-eye"></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                {errors.otp && (
                                                    <div className="err-msg">{errors.otp.message}</div>
                                                )}
                                            </div>
                                            <div className="password-label">
                                                <label data-tooltip-id="my-tooltip-2">Password &nbsp;
                                                    <MdInfo size={20} color='#3d6db5' />
                                                </label>
                                                <ReactTooltip
                                                    id="my-tooltip-2"
                                                    place="top"
                                                    variant="info"
                                                    content="Password must be 8-20 characters, contain at least one special character, and one uppercase letter."
                                                    style={{zIndex: 10000, cursor: 'pointer'}}
                                                    multiline={true}
                                                    
                                                />
                                                   
                                            </div>
                                            <div className='mb-3'>
                                                <div className="input-group">
                                                    <Controller
                                                        name="password"
                                                        control={control}
                                                        rules={{
                                                            required: 'Please enter a password',
                                                            validate: (value) =>
                                                                PasswordStrengthValidator(value) ||
                                                                'Password must meet the strength requirements',
                                                        }}
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
                                                            validate: (value) =>
                                                            value === password || 'Passwords do not match',
                                                        
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
                                                    <div className="err-msg">{errors.confirmPassword.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        : <></>
                                }
                                <div className="row">
                                    <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block signin">
                                        {disable && !showLoader ? 'Set Password' : !disable && !showLoader ? 'Send' : ''}
                                        {showLoader && (
                                            <section {...containerProps} style={{ display: 'inline-block' }}>
                                            {indicatorEl}
                                            </section>
                                        )}
                                    </button>
                                    </div>
                                </div>
                                <div style={{textAlign: 'center', marginTop: 20}}>
                                    <a href='/login' style={{fontSize:14, marginTop: 20, 
                                        textAlign:'center', fontWeight: 'bold'
                                
                                    }}>Back to Login</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
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
export default ForgotPassword;