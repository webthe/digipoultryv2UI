import React  from 'react';
import ReactEcharts  from 'echarts-for-react';
const EchartBar = (props)=>   {
    //alert(JSON.stringify(props.booked))
    let options =    {
        // title: {
        //   text: 'Stacked Line'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          containLabel: true,
            left: 20,
            top: 20,
            right: 20,
            bottom: 20
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: props.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'No Show',
            type: 'bar',
            data: props.noshow
          },
          {
            name: 'Booked',
            type: 'bar',
            data: props.booked
          }
        ]
      };

    return(
        <div className="Temp">
            
            <ReactEcharts
                option={options}
                style={{ height: "300px", width: "100%" }}
                opts={{ renderer: "svg" }}
            /> 
        </div>
    );
}
export default EchartBar;