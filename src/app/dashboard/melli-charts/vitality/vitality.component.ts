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

import { Component, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { Observable } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { SERIES } from '../charts/SERIES';
import { RucheService } from '../../service/api/ruche.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';
import { InspApiaryService } from '../../service/api/insp-apiary.service';
import { InspHiveService } from '../../service/api/insp-hive.service';
import * as moment from 'moment';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { UserPref } from '../../../_model/user-pref';

import { InspHive } from './../../../_model/inspHive';
import { TranslateService } from '@ngx-translate/core';

const INSPECT_IMG_PATH = '../../../../assets/icons/inspect/';
const ALERT_IMG_PATH = '../../../../assets/icons/ui/';

class InspHiveItem{
    name: string;
    insp: InspHive[];
}

@Component({
  selector: 'app-vitality',
  templateUrl: './vitality.component.html',
  styleUrls: ['./vitality.component.css']
})
export class VitalityComponent implements OnInit, OnDestroy {

  private inspHives: InspHiveItem[];
  public user_pref : UserPref;

  private option: {
    baseOption: any,
    media: any[]
  };
  constructor(
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyThService: DailyRecordService,
    private tokenService: AtokenStorageService,
    private adminService: AdminService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    private userPrefsService: UserParamsService,
    private translate : TranslateService
    ){
    this.option = {
      baseOption : JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionHourly)),
      media: [
        {
          option: {
            grid:{
              width: '85%'
            },
            toolbox: {
              show: true,
              right: 2,
            }
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 1100,
          },
          option: {// 这里写此规则满足下的option
/*             toolbox: {
              show: true,
              right: -20,
            } */
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 400,
          },
          option: {// 这里写此规则满足下的option
            grid:[{
              width: '97%'
            }],
            toolbox: {
              show: false
            }
          }
        },
      ]
    };
  }

  ngOnInit() {

    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {}
    );
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    }
    elt.classList.add('apiary-group-brood');
    this.stackService.setBroodChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-brood')));
    this.option.baseOption.series = [];
    this.setOptionForStackChart();
    if (this.stackService.getHiveSelect().length >= 1) {
      this.loadAllHiveAfterRangeChange((options: any) => {
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }
  setOptionForStackChart(): void {
    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[0]);
    yAxis.name = this.graphGlobal.brood.name;
    yAxis.min = 0;
    yAxis.max = 100;
    yAxis.interval = 20;
    this.option.baseOption.yAxis.push(yAxis);

    let serieMarkBrood = JSON.parse(JSON.stringify(SERIES.serieMarkPourcent));
    serieMarkBrood.markArea.data[0][0].name = this.graphGlobal.getNameZoneByGraph('BROOD');
    serieMarkBrood.markArea.data[0][0].yAxis = 80;
    serieMarkBrood.markArea.data[0][1].yAxis = 100;
    this.option.baseOption.series.push(serieMarkBrood);

    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };

    this.option.baseOption.tooltip.formatter = (params) => {
      let words = params.seriesName.split(' | ');
      if(words.includes('inspection') || words.includes('event')){
        if(words.includes('inspection')){
          this.option.baseOption.tooltip.backgroundColor = 'rgba(0, 0, 60, 0.7)';
        }
        if(words.includes('event')){
          this.option.baseOption.tooltip.backgroundColor = 'rgba(0, 60, 0, 0.7)';
        }
        this.stackService.getBroodChartInstance().setOption(this.option);
        let indexSerie = this.option.baseOption.series.findIndex(_s => _s.name === params.seriesName);
        let indexHiveInspItem = this.inspHives.findIndex(_insp => _insp.name === words[0]);
        let indexHiveInsp = this.inspHives[indexHiveInspItem].insp.findIndex(_insp => new Date(_insp.date).getTime() === new Date(params.name).getTime());
        return this.getInspTooltipFormatter(words[0], indexSerie, indexHiveInspItem, indexHiveInsp);
      }
      else{
        this.option.baseOption.tooltip.backgroundColor = 'rgba(50,50,50,0.7)';
        this.stackService.getBroodChartInstance().setOption(this.option);
        return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data.name), new Array(
          {
            name: params.seriesName,
            value: this.unitService.getValRound(params.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Brood')
          }
        ));
      }
    }
    this.option.baseOption.xAxis.push(xAxis);
    this.stackService.getBroodChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getBroodChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getSerieByData(data: Array<any>, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef] };
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getBroodChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getBroodChartInstance().setOption(option, true);
    let index = this.inspHives.findIndex(_elt => _elt.name === hive.name);
    this.inspHives.splice(index, 1);
  }


  loadAllHiveAfterRangeChange(next: Function): void {
    let new_series = [];
    this.option.baseOption.series.length = 1;
    const obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyThService.getBroodOldMethod(_hive._id, this.melliDateService.getRangeForReqest())}
    });
    this.inspHives = [];
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _broods => {
        _broods.forEach((_elt, index) => {
          this.getSerieByData(_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            serieComplete.showSymbol = true;
            serieComplete.symbol = 'emptyCircle';
            serieComplete.type = 'line';
            const indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            if (indexSerie !== -1) {
              this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
            } else {
              this.option.baseOption.series.push(Object.assign({}, serieComplete));
            }
            this.inspHiveService.getInspHiveByHiveIdAndDateBetween(obs[index].hive._id, this.melliDateService.getRangeForReqest()).subscribe(
              _hive_insp => {
                let item : InspHiveItem = {name: obs[index].hive.name, insp: [..._hive_insp]};
                this.inspHives.push(item);
                _hive_insp.forEach(insp => {
                  if(insp.obs.length > 0){
                    let d1 : Date = new Date(insp.date);
                    d1.setHours(12 - (d1.getTimezoneOffset()/60));
                    d1.setMinutes(0);
                    d1.setSeconds(0);
                    let insp_index = serieComplete.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
                    if(insp_index != -1){
                      let new_item = {
                        name:insp.date,
                        value:[insp.date, serieComplete.data[insp_index].value[1], serieComplete.data[insp_index].value[2]]
                      };
                      let data = [
                        new_item
                      ];
                      if(insp.inspId != null){
                        let seriesIndex = new_series.findIndex( s => s.name === serieComplete.name + ' | inspection');
                        if(seriesIndex !== -1){
                          new_series[seriesIndex].data.push(new_item);
                        }
                        else{
                          let newSerie = {
                            name: serieComplete.name + ' | inspection',
                            type:'custom',
                            itemStyle:{
                              opacity: 1,
                            },
                            //id: 'swarm',
                            renderItem: (param, api) => {
                              let point = api.coord([api.value(0), api.value(1)]);
                              return {
                                type: 'image',
                                style: {
                                  image: INSPECT_IMG_PATH + '4_tool_jhook.png',
                                  x: -25 / 2,
                                  y: -40 / 2,
                                  width: 25,
                                  height: 25,
                                },
                                position:point,
                              }
                            },
                            data: data,
                            z: 10,
                          }
                          new_series.push(newSerie);
                        }
                      }
                      else{
                        let seriesIndex = new_series.findIndex( s => s.name === serieComplete.name + ' | event');
                        if(seriesIndex !== -1){
                          new_series[seriesIndex].data.push(new_item);
                        }
                        else{
                          let newSerie = {
                            name: serieComplete.name + ' | event',
                            type:'custom',
                            itemStyle:{
                              opacity: 1,
                            },
                            //id: 'swarm',
                            renderItem: (param, api) => {
                              let point = api.coord([api.value(0), api.value(1)]);
                              return {
                                type: 'image',
                                style: {
                                  image: ALERT_IMG_PATH + 'alert-icon.png',
                                  x: -20 / 2,
                                  y: -30 / 2,
                                  width: 20,
                                  height: 20,
                                },
                                position:point,
                              }
                            },
                            data: data,
                            z: 10,
                          }
                          new_series.push(newSerie);
                        }
                      }
                      //this.stackService.getBroodChartInstance().setOption(this.option);
                    }
                  }
                })
              },
              () => {},
              () => {
                new_series.forEach(s =>{
                  let indexSerie = this.option.baseOption.series.findIndex(e => e.name === s.name);
                  if (indexSerie !== -1) {
                    this.option.baseOption.series[indexSerie] = Object.assign({}, s);
                  } else {
                    this.option.baseOption.series.push(Object.assign({}, s));
                  }
                });
                this.stackService.getBroodChartInstance().setOption(this.option);
              }
            );
          });
        })
      },
      () => {},
      () => {
        next(this.option);
      }
    )
  }

  /*loadEventsByHiveAfterRangeChange(): void{
    console.log(this.stackService.getHiveSelect());
    this.stackService.getHiveSelect().forEach(_elt => {

    })
  }*/

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof VitalityComponent
   */
  loadDataByHive(hive: RucheInterface): void{
    let serie;
    this.stackService.getBroodChartInstance().showLoading();
    this.dailyThService.getBroodOldMethod(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _brood => {
        this.getSerieByData(_brood, hive.name, (serieComplete: any) => {
          serie = Object.assign({}, serieComplete);
          serieComplete.itemStyle = {
            color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
          };
          serieComplete.showSymbol = true;
          serieComplete.symbol = 'emptyCircle';
          serieComplete.type = 'line';
          this.option.baseOption.series.push(serieComplete);
          this.stackService.getBroodChartInstance().setOption(this.option);
        })
      },
      () => {},
      () => {
        this.loadEventsByHive(hive, serie);
      }
    )
  }

  loadEventsByHive(hive: RucheInterface, serie:any): void{
    let data = [];
    let new_series = [];
    this.inspHiveService.getInspHiveByHiveIdAndDateBetween(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _hive_insp => {
        let item : InspHiveItem = {name: hive.name, insp: [..._hive_insp]};
        this.inspHives.push(item);
        _hive_insp.forEach( insp => {
          if(insp.obs.length > 0){
            let d1 : Date = new Date(insp.date);
            d1.setHours(12 - (d1.getTimezoneOffset()/60));
            d1.setMinutes(0);
            d1.setSeconds(0);
            let index = serie.data.findIndex(e => new Date(e.name).getTime() === d1.getTime());
            if(index != -1){
              let new_item = {
                name:insp.date,
                value:[insp.date, serie.data[index].value[1], serie.data[index].value[2]]
              };
              data = [
                new_item
              ];
              if(insp.inspId != null){
                let seriesIndex = new_series.findIndex( s => s.name === serie.name + ' | inspection');
                if(seriesIndex !== -1){
                  new_series[seriesIndex].data.push(new_item);
                }
                else{
                  let newSerie = {
                    name: serie.name + ' | inspection',
                    type:'custom',
                    itemStyle:{
                      opacity: 1,
                    },
                    //id: 'swarm',
                    renderItem: (param, api) => {
                      let point = api.coord([api.value(0), api.value(1)]);
                      return {
                        type: 'image',
                        style: {
                          image: INSPECT_IMG_PATH + '4_tool_jhook.png',
                          x: -25 / 2,
                          y: -50 /2,
                          width: 25,
                          height: 25,
                        },
                        position:point,
                      }
                    },
                    data: data,
                    z: 10,
                  }
                  new_series.push(newSerie);
                }
              }
              else{
                let seriesIndex = new_series.findIndex( s => s.name === serie.name + ' | event');
                if(seriesIndex !== -1){
                  new_series[seriesIndex].data.push(new_item);
                }
                else{
                  let newSerie = {
                    name: serie.name + ' | event',
                    type:'custom',
                    itemStyle:{
                      opacity: 1,
                    },
                    //id: 'swarm',
                    renderItem: (param, api) => {
                      let point = api.coord([api.value(0), api.value(1)]);
                      return {
                        type: 'image',
                        style: {
                          image: ALERT_IMG_PATH + 'alert-icon.png',
                          x: -20 / 2,
                          y: -30 /2,
                          width: 20,
                          height: 20,
                        },
                        position:point,
                      }
                    },
                    data: data,
                    z: 10,
                  }
                  new_series.push(newSerie);
                }
              }
              //console.log(newSerie);
              //this.option.baseOption.series.push(newSerie);
              //this.stackService.getBroodChartInstance().setOption(this.option);
            }
          }
        });
      },
      () => {},
      () => {
        new_series.forEach(s =>{
          this.option.baseOption.series.push(s);
        });
        this.stackService.getBroodChartInstance().setOption(this.option);
        this.stackService.getBroodChartInstance().hideLoading();
      }
    );
  }

  /**
   *
   * @param markerSerie
   * @param date
   * @param series
   */
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B> {R}';
    let tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
    }).join('');

    return tooltipGlobal;
  }

  getInspTooltipFormatter(hiveName: string, indexSerie: number, indexHiveInspItem: number, indexHiveInsp: number): string{
    //console.log(params);
    //let item : InspHiveItem = this.inspHives[indexHiveInspItem];
    let insp : InspHive = this.inspHives[indexHiveInspItem].insp[indexHiveInsp];
    let date : Date = new Date(insp.date);
    if(insp.inspId != null){
      let test = date.getTimezoneOffset();
      date.setHours(date.getHours() + (test / 60));
    }
    console.log(date);
    let res =
    `<div>` +
    `<h5>${hiveName} | ${this.unitService.getHourlyDate(date)} </h5>` +
    `<div>`;
    insp.obs.forEach( o => {
      let name = this.translate.instant('MELLICHARTS.BROOD.TOOLTIP.'+ o.name.toUpperCase());
      res += `<div style="display:flex; width:100%; justify-content:center; align-items:center; margin-left: 5px;">`;
      res += `<div style="width:25px; height:25px; margin-top:-5px; background-image:url('${INSPECT_IMG_PATH + o.img}'); background-repeat:no-repeat; background-size:25px; background-position: center;"></div>`;
      res += `<div style="height:32px; display:flex; margin-left:10px; margin-top:5px; align-items:center;">${name}</div>`
      res += `</div>`;
    });
    res += `</div>`;

    res += `<div style="margin-top: 10px;">`;
    if(insp.notes != null){
      res += `<div style="margin-left: 5px; display:flex; width:100%; justify-content:center; align-items:center;">${insp.notes}</div>`;
    }
    res += `</div>`;

    res += `<div style="margin-top: 10px;">`;
    if(insp.todo != null){
      res += `<div style="margin-left: 5px; display:flex; width:100%; justify-content:center; align-items:center;">${insp.todo}</div>`;
    }
    res += `</div>`;

    return res;
  }

  insertNewEvent(): void{

  }

  deleteEvent(): void{

  }

  applyFilters(): void{

  }

  ngOnDestroy(): void {
   //this.stackService.cleanSlectedHives();
   //this.stackService.getBroodChartInstance().dispose();
  }
}
