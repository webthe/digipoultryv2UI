import React, { useState }  from 'react';
import ReactEcharts  from 'echarts-for-react';
import { useEffect } from 'react';
const EchartBar = (props)=>   {
    const [yseries, setYseries] = useState([]);
    useEffect(()=>{
        if(props.data.sexing=='yes') {
            let obj = [
                {
                    name: 'Male Mortality',
                    type: 'bar',
                    barWidth: '30%',
                    data: props.data.yAxis,
                    
                },
                {
                    name: 'Female Mortality',
                    type: 'bar',
                    barWidth: '30%',
                    data: props.data.yAxis2, 
                }
            ]
            setYseries(obj);
        } else {
            let obj = [
                // {
                //     name: 'Chick Mortality',
                //     type: 'line',
                //     lineStyle: {color: '#4f46e5'},
                //     data: props.data.yAxis
                // },
                // {
                //     name: props.category,
                //     type: 'line',
                //     barWidth: '30%',
                //     data: props.data.yAxis
                // },
                {
                    name: props.category,
                    type: 'bar',
                    barWidth: '30%',
                    data: props.data.yAxis
                }
            ]
            setYseries(obj)
        }
    })
    let options = {
        //color: ['#8079f4'],
        //color:[props.color],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            
                type: 'shadow' 
            }
        },
        grid: {
            
                left: 40,
                top: 10,
                right: 35,
                bottom: 60,
                containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: props.data.xAxis,
                axisTick: {
                    alignWithLabel: true
                },
                name: 'Date',
                nameLocation: 'middle',
                nameGap: 30
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: props.ylabel,
                nameLocation: 'middle',
                nameGap: 50,

            }
        ],
        series: yseries,
        // series: [
        //     {
        //         name: 'Male Natural',
        //         type: 'bar',
        //         stack: 'Male',
        //         label: {
        //             show: true
        //         },
        //         data: [320, 302, 301]
        //     },
        //     {
        //         name: 'Male Culling',
        //         type: 'bar',
        //         stack: 'Male',
        //         label: {
        //             show: true
        //         },
        //         data: [120, 132, 101]
        //     },
        //     {
        //         name: 'Female Natural',
        //         type: 'bar',
        //         stack: 'Female',
        //         label: {
        //             show: true
        //         },
        //         data: [320, 302, 301]
        //     },
        //     {
        //         name: 'Female Culling',
        //         type: 'bar',
        //         stack: 'Female',
        //         label: {
        //             show: true
        //         },
        //         data: [120, 132, 101]
        //     }
        // ], 
        
        dataZoom: [{
            type: 'slider',
            //startValue: '2018-08-15T10:14:13.914Z'
        }, {
           
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%'
            
        }]
    };
    return(
        <div className="Temp">
            {props.data.xAxis.length>0 ?
            <ReactEcharts
                option={options}
                style={{ height: "300px", width: "100%" }}
                opts={{ renderer: "svg" }}
            /> : <div className="text-center">No Data Found</div>
            }
           
        </div>
    );
}
export default EchartBar;