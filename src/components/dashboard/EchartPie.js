import React  from 'react';
import ReactEcharts  from 'echarts-for-react';
const EchartPie = (props)=>   {
    let options = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: props.name,
          type: 'pie',
          radius: ['20%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: props.data
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
export default EchartPie;