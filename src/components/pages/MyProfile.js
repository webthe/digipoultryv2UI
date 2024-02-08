import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { env } from './const';
import { headers } from '../utils/common';
import { getRole } from '../utils/common';
import { Role } from '../utils/role';
import DeactivateFarm from './DeactivateFarm';
import { Modal, Button } from 'react-bootstrap';
import * as axiosInstance from '../utils/axiosinstace';
import moment from "moment";
const MyProfile = () => {
    const [role] = useState(getRole())
    const [data, setData] = useState({})
    const fetchData = async () => {
        try {
            const response = await axiosInstance.getUserProfile();
            setData(response.list);
        } catch (err) {
            alert(err)
            console.error(err);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="batchOperations">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">My Profile</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
                    <div className="row">
                        <div className="col-md-6">
                        <h4 className="profileHeaders">User Details</h4>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Organization:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.org != undefined && data.org!=''?data.org: '--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Name:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data?.farmerName}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>User Name:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data?.userName}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Role:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data?.role}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Email:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.emailID != undefined && data.emailID !=''?data.emailID:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Phone Number:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.phoneNumber !==undefined && data.phoneNumber != ''? data.phoneNumber: '--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Address Line 1:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.addressLine1 !=undefined && data.addressLine1 !=''?data.addressLine1:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Address Line 2:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.addressLine2 !=undefined && data.addressLine2 !=''?data.addressLine2:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>City:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.city !=undefined && data.city !=''?data.city:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>State:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.state !=undefined && data.state !=''?data.state:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Country:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.country !=undefined && data.country !=''?data.country:'--'}
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Registered Date:</strong>
                                </div>
                                <div className="col-md-6">
                                    {data.profileCreatedDate!=undefined && data?.profileCreatedDate !=''?moment(data?.profileCreatedDate).format('DD-MMM-YYYY'): ''}
                                </div>
                            </div>
                            {/* <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Registered By:</strong>
                                </div>
                                <div className="col-md-6">
                                {data?.createdBy}
                                </div>
                            </div> */}
                        </div>
                        <div className="col-md-6">
                            <h4 className="profileHeaders">Services</h4>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Barn Sensors:</strong>
                                </div>
                                <div className="col-md-6">
                                    <span className={data.barnsensors == 1?'activeHighlighter': 'inactiveHighlighter'}>
                                        {data.barnsensors == 1?'ACTIVE':'INACTIVE'}
                                    </span>
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Water Meter:</strong>
                                </div>
                                <div className="col-md-6">
                                    <span className={data.watermeter == 1?'activeHighlighter': 'inactiveHighlighter'}>
                                        {data.watermeter == 1?'ACTIVE':'INACTIVE'}
                                    </span>
                                </div>
                            </div>
                            <div className="row mbottom">
                                <div className="col-md-6 textRight" >
                                    <strong>Control System:</strong>
                                </div>
                                <div className="col-md-6">
                                    <span className={data.controls == 1?'activeHighlighter': 'inactiveHighlighter'}>
                                        {data.controls == 1?'ACTIVE':'INACTIVE'}
                                    </span>
                                </div>
                            </div>
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
        </div>

    );
}

export default MyProfile;