import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphRecordService {

  constructor() { }
   
  option = {
    title: {
        text: 'Weight & Temperature',
        left: 'center',
        top:'-5'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
    },
    toolbox: {
        orient : 'horizontal',
        /*right: '0',
        left : '99%',*/
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            /* magicType: {type: ['line', 'bar']}, */
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        },
        max: new Date()
    },
    legend: {
        top:30,
    },
    grid: {
        left: '3%',
        right: '4%',
        containLabel: true
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100,
        },
        {
            type: 'inside',
            realtime: true,
            filterMode: 'empty'
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'empty',
            left: 'left'
        },
        {
            type: 'slider',
            yAxisIndex: 1,
            filterMode: 'empty'
        },
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Weight (kg)',
            min: 0,
            max: 80,
            interval: 5,
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: 'Temp.(°C)',
            min: 0,
            max: 40,
            interval: 5,
            axisLabel: {
                formatter: '{value}'
            }

        }
    ],
    series: [
     ]
};

}