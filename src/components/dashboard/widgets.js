import React, { useEffect, useState} from 'react';
const Widgets = (props) => {
    let feed = props.weights.feed;
    return(
                <div classname="dashboardWidgets">
                <div className="row">
                    <div className='col-md-8'>
                        <div className="row">
                        <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box">
                                <span className="info-box-icon bg-info elevation-1">
                                TEMP
                                </span>
                                <div className="info-box-content">
                                <span className="info-box-number">
                                    {props.currvals.temp} °C
                                </span>
                                <div className="daily">
                                    <span>Day Max.: </span> <span>{props.dbvals.maxtemp} °C</span><br />
                                    <span>Day Min.: </span> <span>{props.dbvals.mintemp} °C</span>
                                </div>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                            </div>
                            {/* /.col */}
                            <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-danger elevation-1">RH %</span>
                                <div className="info-box-content">
                                <span className="info-box-number">{props.currvals.rh}</span>
                                <div className="daily">
                                    <span>Day Max.: </span> <span>{props.dbvals.maxrh}</span><br />
                                    <span>Day Min.: </span> <span>{props.dbvals.minrh}</span>
                                </div>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                            </div>
                            {/* /.col */}
                            {/* fix for small devices only */}
                            <div className="clearfix hidden-md-up" />
                            <div className="col-12 col-sm-6 col-md-4">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-primary elevation-1">HI</span>
                                <div className="info-box-content">
                                <span className="info-box-number">{(props.currvals.hi)} °C</span>
                                <div className="daily">
                                    <span>Day Max.: </span> <span>{props.dbvals.maxhi} °C</span><br />
                                    <span>Day Min.: </span> <span>{props.dbvals.minhi} °C</span>
                                </div>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                            </div>
                            {/* /.col */}
                            <div className="col-12 col-sm-6 col-md-6">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-success elevation-1">CO<sub>2</sub></span>
                                <div className="info-box-content">
                                <span className="info-box-number">{props.currvals.co}</span>
                                <div className="daily">
                                    <span>Day Max.: </span> <span>{props.dbvals.maxco}</span><br />
                                    <span>Day Min.: </span> <span>{props.dbvals.minco}</span>
                                </div>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                            </div>
                            <div className="col-12 col-sm-6 col-md-6">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-warning elevation-1">NH<sub>3</sub></span>
                                <div className="info-box-content">
                                <span className="info-box-number">{props.currvals.nh}</span>
                                <div className="daily">
                                    <span>Day Max.: </span> <span>{props.dbvals.maxnh}</span><br />
                                    <span>Day Min.: </span> <span>{props.dbvals.minnh}</span>
                                </div>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className="row">
                            
                            <div className="col-md-12">
                                <div className='icon-holder'>
                                    
                                    <img src='/dist/img/feed.png' width='100%' alt="ICON" ></img>
                                </div>
                                <div className='text-holder'>
                                <span className='text'>Total Feed: </span>
                                {props.weights.feedStatus === true? 
                                <strong>{""+feed.toLocaleString()} Kg</strong>
                                : <i class="color-red">Not Added</i>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className='icon-holder'>
                                    <img src='/dist/img/mortality.png' width='100%' alt="ICON" ></img>
                                </div>
                                <div className='text-holder'>
                                <span className='text'>Total Mortality: </span>
                                {props.weights.mortalityStatus===true? 
                                <strong>{(props.weights.mortality)} </strong>
                                : <i class="color-red">Not Added</i>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className='icon-holder'>
                                    <img src='/dist/img/weight.png' width='100%' alt="ICON" ></img>
                                </div>
                                <div className='text-holder' style={{"margin-top": "0px"}}>
                                    
                                    <span className='text'>Ideal Weight: </span><strong>{(props.weights.idealweight)} Kg</strong><br />
                                    <span className='text'>Actual Weight: </span>{props.weights.weightStatus===true?
                                    <strong> { (props.weights.weight) +' Kg'}</strong>
                                     : <i class="color-red">Not Added</i>}
                                </div>
                            </div>
                        </div>
                    </div>                   
                </div>
                {/* /.row */}
            </div>
    );
}
export default Widgets;
