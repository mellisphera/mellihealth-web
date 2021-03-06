/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { type } from 'os';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphStackService {

  option: any;
  constructor() {
    this.option  =  {
      title: {
        text: 'Stack',
        x: 'center',
        top: -5
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        orient: 'horizontal',
        data :[],
        x: '5%',
        y: '2%'
      },
      toolbox: {
        orient: 'horizontal',
        //right: '0',
        left: '80%',
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: false },
         /*  magicType: { type: ['line', 'bar'] }, */
          restore: {},
          saveAsImage: {}
        }
      },
      axisPointer: {
        link: { xAxisIndex: 'all' }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 80,
          end: 100,
          bottom: 150,
          xAxisIndex: [0, 1, 2]
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          xAxisIndex: [0, 1, 2]
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          yAxisIndex: 0,
          left: 'left'
        },
        {
          type: 'inside',
          filterMode: 'empty',
          realtime: true,
          yAxisIndex: 1,
          left: 'left'
        }
      ],
      grid: [
        { x: '4%', y: '5%', width: '95%', height: '28%' },
        { x: '4%', y: '38%', width: '95%', height: '25%' },
        { x: '4%', y: '69%', width: '95%', height: '10%' },
      ],
      /*visualMap: {
        top: 10,
        right: 10,
        seriesIndex : [4,5],
        pieces: [{
            gt: 0,
            lte: 20,
            color: 'red'
        }],
        target: {
          outOfRange: {
              color: ['red'],
              symbolSize: [60, 200]
          }
      },
        },*/
      xAxis: [
        {
          //Temp
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 0,
          max: new Date(),
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        {
          //Humdity
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 1,
          max: new Date(),
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        {
          //batery
          type: 'time',
          boundaryGap: false,
          axisLine: { onZero: true },
          position: 'bottom',
          gridIndex: 2,
          max: new Date(),
          splitLine: {
            show: false
          }
        },
      ],
      yAxis: [
        {
          name: 'Temp',
          type: 'value',
          nameLocation: 'middle',
          min: 0,
          max: 40,
        },
        {
          gridIndex: 1,
          name: 'Humidity',
          type: 'value',
          nameLocation: 'middle',
          inverse: false,
          min: 0,
          max: 100
        },
        {
          gridIndex: 2,
          name: 'Batery',
          type: 'value',
          nameLocation: 'middle',
          inverse: false,
          min: 0,
          max: 100
        }
      ],
      series: [
      ]
    };
  
   }
}
