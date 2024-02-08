import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal, Button } from 'react-bootstrap';
import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import axios from 'axios';
import { render } from '@testing-library/react';
import { env } from './const';
import { headers } from '../utils/common';
import { Role } from '../utils/role';
import { getRole, controls } from '../utils/common';
import * as axiosiInstance from '../utils/axiosinstace';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import DataTable, { memoize } from "react-data-table-component";
import * as axiosInstance from '../utils/axiosinstace';
const AddVideos = (props) => {
    const [headersobj] = useState(headers());
   
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        mode: 'onChange'
    });

    const [showResults, setShowResults] = useState(false)
    const [resultMessage, setResultMessage] = useState({});
    const [videoList, setVideoList] = useState([]);
    
    const columns = [
      {
        name: '#',
        selector: row => row.index,
        sortable: true,
        cell: (row, index) => index + 1 // Add 1 because index starts from 0
      },
      {
        name: "Title",
        selector: "title",
        sortable: true,
        minWidth: '250px'
      },
      {
        name: "Description",
        selector: "description",
        sortable: true,
        minWidth: '350px'
      },
      {
          name: "Created Date",
          selector: "createdDate",
          sortable: true,
          minWidth: '120px'
      },
      {
          name: "Thumbnail",
          selector: "thumbnailLink",
          cell:(row)=>
          <i className="fas fa-eye view-btn" onClick={thumbnailHandler} id={row.id}></i>
      },
      {
          name: "Video",
          selector: "videoLink",
          cell:(row)=>
          <i className="fas fa-eye view-btn" onClick={videoHandler} id={row.id}></i>
      },
      {
          name: "Edit",
          selector: "id",
          cell:(row)=>
          <i className="fas fa-eye view-btn" onClick={editVideo} id={row.id}></i>
      },
    ];
    const thumbnailHandler = (param)=>{
      
    }
    const videoHandler = ()=>{

    }
    const editVideo = ()=>{

    }
    const onSubmit = (data)=>{
        
        const formData = new FormData();
        // Append text fields to formData
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('actionType', 'insert');
        formData.append('videoLink', data.videoLink);
        // Append file to formData
        if (data.file[0]) {
            formData.append('file', data.file[0]);
        }
        // Axios POST request
          axios.post('http://localhost:5000/api/v1/misc/videos', formData, {
            headers: headersobj
          })
            .then(response => {
                //console.log('Response:', response.data);
              
                if (response.data.status) {
                  setShowResults(true);
                  setResultMessage({
                    error: false, message: response.data.message
                  });
                 reset();
                } else {
                  setShowResults(true);
                  setResultMessage({
                    error: true, message: response.data.message
                  });
                }
          
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error (you can show error message to user)
            });
              
          }
    const getVideos = async()=>{
      try {
          const response = await axiosInstance.getVideos();
          setVideoList(response.list)
          
      } catch (err) {
          console.log(err);
      }
    }
    useEffect(() => {
      getVideos();
    }, []);
    return (
        <div className="farmMaster">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h2 class="m-0 text-dark">Application Videos</h2>
                </div>
            </div>
            <div className="card">
                <div class="card-body">
               <Tabs activeHeaderStyle={{background:'transparent'}}>
                    <Tab label="Add New Video">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='col-md-8'>
                                {showResults ? <Results key={Math.random()} message={resultMessage.message} error={resultMessage.error} /> : null}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                   
                                <div className="row">
                                    <div className="col-md-10">

                                        <div className="form-group">
                                            <label htmlFor>Title</label>
                                            <input type="text" className="form-control" placeholder="Enter Title"
                                                name="title"
                                                {...register("title", {
                                                    required: "Please Enter Title",
                                                    minLength: { value: 3, message: 'Title is too short' },
                                                    maxLength: { value: 50, message: 'Too Long for a Title' }
                                                })}
                                            />
                                            {errors.title && <span className="err-msg">{errors.title.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-10">

                                        <div className="form-group">
                                            <label htmlFor>Video Link</label>
                                            <input type="text" className="form-control" placeholder="Video Link"
                                                name="videoLink"
                                                {...register("videoLink", {
                                                  required: "Please enter a video link",
                                                  pattern: {
                                                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                                                    message: "Please enter a valid URL"
                                                  }
                                              })}
                                            />
                                            {errors.videoLink && <span className="err-msg">{errors.videoLink.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label htmlFor>Description</label>
                                            <textarea className='form-control' style={{minHeight: '150'}} name='description'
                                             {...register("description", {
                                                required: "Please enter Network Name",
                                                minLength: { value: 3, message: 'Description is too short' },
                                                maxLength: { value: 300, message: 'Too Long for a description' }
                                            })}
                                            >
                                            </textarea>
                                            {errors.description && <span className="err-msg">{errors.description.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="form-group">
                                        <label htmlFor="file">Upload Thumbnail Image(150X150)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".jpg,.png"
                                            {...register("file", {
                                            validate: {
                                                isJpgOrPng: (fileList) => {
                                                if (fileList.length === 0) return "A file is required";
                                                return (
                                                    ["image/jpeg", "image/png"].includes(fileList[0].type) ||
                                                    "Only .jpg and .png files are allowed"
                                                );
                                                }
                                            }
                                            })}
                                        />
                                        {errors.file && <span className="err-msg">{errors.file.message}</span>}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <input type="submit" value="Save" class="btn btn-primary newBtn" />
                                        <input type="reset" value="Reset" class="btn btn-secondary newBtn" />
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                               
                            </div>
                        </div>

                    </form>
                    </Tab>
                    <Tab label="List of Videos">
                        <div className='row'>
                            <div className='col-md-12'>
                                  <DataTable
                                    data={videoList}
                                    pagination
                                    dense
                                    selectableRowsHighlight = 'true'
                                    compact
                                    highlightOnHover = 'true'
                                    columns={columns}
                                    //onRowSelected={handleChangeSelectedRows}
                                />
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                </div>
            </div>

        </div>

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
export default AddVideos;