import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
const Chart = (props) => {
    let chartData = {
        
            labels  : ['9', '11', '13', '15', '17', '19', '21'],
            datasets: [{
                type                : 'line',
                data                : props.cdata,
                backgroundColor     : 'transparent',
                borderColor         : props.bcolor,
                pointBorderColor    : props.bcolor,
                pointBackgroundColor: props.bcolor,
                fill                : false
              },
                {
                  type                : 'line',
                  data                :  Array(7).fill(props.maxVal),
                  backgroundColor     : 'tansparent',
                  borderColor         : '#ced4da',
                  pointBorderColor    : '#ced4da',
                  pointBackgroundColor: '#ced4da',
                  fill                : false
                
                },
                {
                  type                : 'line',
                  data                : Array(7).fill(props.minVal),
                  backgroundColor     : 'tansparent',
                  borderColor         : '#ced4da',
                  pointBorderColor    : '#ced4da',
                  pointBackgroundColor: '#ced4da',
                  fill                : false
                }]
        }
        if(props.remove === 'true') {
            delete chartData.datasets.splice(2,1);
        }
    
    return(
        <div className="dchart">
            <Line redraw 
                    data={chartData}
                    options={{
                        
                            maintainAspectRatio: false,
                            legend : {
                                display: false
                            },
                            
                            tooltips: {
                                mode: 'label'
                            },
                            scales : {
                                yAxes: [{
                                    display: true,
                                    gridLines: {
                                      display      : true,
                                      lineWidth    : '1px',
                                      color        : 'rgba(0, 0, 0, .2)',
                                      zeroLineColor: 'transparent'
                                    },
                                    ticks    : {
                                      beginAtZero : true,
                                      suggestedMax: props.suggestedMax
                                    }
                                  }],
                                  xAxes: [{
                                    display  : true,
                                    gridLines: {
                                      display: true
                                    },
                                    ticks    : {
                                      beginAtZero : true,
                                      suggestedMax: 24
                                    }
                                  }]
                            }
                        }
                    }
                   
                />
        </div>
    );
}
export default Chart