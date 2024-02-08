import React  from 'react';
import ReactEcharts  from 'echarts-for-react';
const EchartLine = (props)=>   {
    let options =    {
        color: ["#009C95","#21ba45"],
        tooltip : {
            trigger: 'axis'
        },
        calculable : true,
        grid: {
            left: 40,
            top: 10,
            right: 35,
            bottom: 80
        },
        xAxis : [
            {
                type: 'category',
                boundaryGap:false,
                data:props.xaxis,
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                
            }
        ],
        yAxis : [
           {
            type: 'value',
            max: props.maxVal,
            boundaryGap: [0, '100%'],
            interval: props.interval,
            show: true,
            splitLine: {
                lineStyle: {
                    color: '#eee'
                }
            },
           }
        ],
        
        series : [
            {
                name:'Reading',
                type:'line',
                smooth:true,
                data:props.data,
                lineStyle: {
                    color: props.color
                },
                markLine: {
                    data: [{name: 'Maximum temp', yAxis: props.max,
                    lineStyle: {
                        color: '#f00'
                    }
                }, {name: 'Maximum temp', yAxis: props.min,
                lineStyle: {
                    color: '#f00'
                }}],
               }
            }
        ],
        dataZoom: [{
            type: 'slider',
            //startValue: '2018-08-15T10:14:13.914Z'
        }, {
           
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%'
            
        }],
    }

    return(
        <div className="Temp">
            {props.data.length>0 ?
            <ReactEcharts
                option={options}
                style={{ height: "300px", width: "100%" }}
                opts={{ renderer: "svg" }}
            /> : <div className="text-center">No Data Found</div>
            }
        </div>
    );
}
export default EchartLine;