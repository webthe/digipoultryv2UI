import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';
class LineChart extends React.Component {
    
    constructor (props) {
        super();
        console.log("*****",props.input.array)
        this.state = {
            chartData :{
                labels  : ['9', '11', '13', '15', '17', '19', '21'],
                datasets: [{
                    type                : 'line',
                    data                : props.input.array,
                    backgroundColor     : 'transparent',
                    borderColor         : props.input.bcolor,
                    pointBorderColor    : props.input.bcolor,
                    pointBackgroundColor: props.input.bcolor,
                    fill                : false
                  },
                    {
                      type                : 'line',
                      data                :  Array(7).fill(props.input.maxVal),
                      backgroundColor     : 'tansparent',
                      borderColor         : '#ced4da',
                      pointBorderColor    : '#ced4da',
                      pointBackgroundColor: '#ced4da',
                      fill                : false
                    
                    },
                    {
                      type                : 'line',
                      data                : Array(7).fill(props.input.minVal),
                      backgroundColor     : 'tansparent',
                      borderColor         : '#ced4da',
                      pointBorderColor    : '#ced4da',
                      pointBackgroundColor: '#ced4da',
                      fill                : false
                    }]
            }
        }
    }
    componentWillMount() {
        if(this.props.input.remove) {
            const stateObj = this.state;
            stateObj.chartData.datasets.splice(2,1);
            this.setState(stateObj);
        }
    }
    render() {
        
        return(
           <div className="temp">
              
                <Line
                    data={this.state.chartData}
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
                                      suggestedMax: this.props.input.suggestedMax
                                    }
                                  }],
                                  xAxes: [{
                                    display  : true,
                                    gridLines: {
                                      display: true
                                    }
                                  }]
                            }
                        }
                    }
                   
                />
           </div>
        );
    }
}   
export default LineChart;