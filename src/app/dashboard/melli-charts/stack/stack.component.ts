import { Component, OnInit } from '@angular/core';
import { UnitService } from '../../service/unit.service';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import * as echarts from 'echarts';
import { StackMelliChartsService } from './service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { RucheInterface } from '../../../_model/ruche';
import { RecordService } from '../../service/api/record.service';
import { Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { SERIES } from '../charts/SERIES';
import { RucheService } from '../../service/api/ruche.service';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent implements OnInit {

  public options: any;
  private subjectSeriesComplete: BehaviorSubject<number>;
  private gridIndex: Array<number>;
  constructor(private unitService: UnitService,
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private recordService: RecordService,
    private rucheService: RucheService,
    private melliDate: MelliChartsDateService) { }

  ngOnInit() {
    this.options = Object.assign({}, BASE_OPTIONS.baseOptionStack);
    this.options.yAxis = [];
    this.options.xAxis = [];
    this.gridIndex = [1, 1, 0, 2];
    this.subjectSeriesComplete = new BehaviorSubject(0);
    //log(this.options);
/*     if (this.stackService.getEchartInstance() === null) {
      this.stackService.setEchartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-stack')));
      this.setOptionForStackChart();  
    } */
    this.stackService.setEchartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-stack')));
    this.setOptionForStackChart();  

  }


  /**
   *
   *
   * @memberof StackComponent
   */
  setOptionForStackChart(): void {
    let yAxisWeight = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxisWeight.name = this.graphGlobal.weight.name;
    yAxisWeight.min = this.graphGlobal.weight.min;
    yAxisWeight.max = this.graphGlobal.weight.max;
    yAxisWeight.gridIndex = 0;
    this.options.yAxis.push(yAxisWeight);
    
    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.gridIndex = 0;
    this.options.xAxis.push(xAxis);


    let yAxisTemp = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxisTemp.name = this.graphGlobal.temp.name;
    yAxisTemp.min = this.graphGlobal.temp.min;
    yAxisTemp.max = this.graphGlobal.temp.max;
    yAxisTemp.gridIndex = 1;
    this.options.yAxis.push(yAxisTemp);

     let xAxisTemp = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxisTemp.gridIndex = 1;
    this.options.xAxis.push(xAxisTemp);


    let yAxisHum = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxisHum.name = this.graphGlobal.humidity.name;
    yAxisHum.min = this.graphGlobal.humidity.min;
    yAxisHum.gridIndex = 2;
    yAxisHum.max = this.graphGlobal.humidity.max;
    this.options.yAxis.push(yAxisHum);

    let xAxisHum = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxisHum.gridIndex = 2;
    this.options.xAxis.push(xAxisHum);

    this.stackService.getEchartInstance().setOption(this.options);
  }



  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackComponent
   */
  nextSerieComplete(): void {
    this.subjectSeriesComplete.next(+1);
    this.checkSerieIsComplete();
  }

  /**
   *
   *
   * @memberof StackComponent
   */
  resetSerieSubject(): void {
    this.subjectSeriesComplete = new BehaviorSubject(0);
  }
  /**
   *
   *
   * @memberof StackComponent
   */
  checkSerieIsComplete(): void {
    this.subjectSeriesComplete.subscribe(
      _val => {
          console.log(_val);
        if (_val === this.stackService.getHiveSelect().length) {
          this.subjectSeriesComplete.complete();
        }
      }
    )
  }


  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {number}
   * @memberof StackComponent
   */
  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt.id === hive.id);
  }
  loadAfterRangeChanged() {
      let obsArray = [];
      obsArray = this.stackService.getHiveSelect().map(_hive => {
      return  { hive: _hive, observable: [
        {type: 'TempExt', obs: this.recordService.getTempExtByHive(_hive.id, this.melliDate.getRangeForReqest())},
        {type: 'TempInt', obs: this.recordService.getTempIntByHive(_hive.id, this.melliDate.getRangeForReqest())},
        {type: 'Weight', obs: this.recordService.getWeightByHive(_hive.id, this.melliDate.getRangeForReqest())},
        {type: 'Hint', obs: this.recordService.getHintIntByHive(_hive.id, this.melliDate.getRangeForReqest())}
      ]};
    });
    obsArray.forEach((_request) => {
      Observable.forkJoin(_request.observable.map(_elt => _elt.obs)).subscribe(
        _records => {
          _records.forEach((_elt: any[], index) => {
            this.getSerieByData(_elt, _request.observable[index].type , (serieComplete: any) => {
              serieComplete.yAxisIndex = this.getIndexGridByIndex(_request.observable[index].type);
              serieComplete.xAxisIndex = this.getIndexGridByIndex(_request.observable[index].type);
               serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(_request.hive), _request.hive)
              };
              const indexSerie = this.options.series.map(_serie => _serie.name).indexOf(serieComplete.name);
              console.log(this.options.series);
              console.log(serieComplete);
              this.options.series[indexSerie] = Object.assign({}, serieComplete);
            });
            this.nextSerieComplete();
          });
        }
      );
      this.stackService.getEchartInstance().setOption(this.options);

    });
    console.log(this.options.series);
    this.subjectSeriesComplete.subscribe(() => {}, () => {}, () => {
      console.error('COMPLETE');
      this.stackService.getEchartInstance().setOption(this.options);
      this.resetSerieSubject();
    });
  }


  loadDataByHive(hive: RucheInterface) {
    const obsArray: Array<any> = [
      {type: 'TempExt', obs: this.recordService.getTempExtByHive(hive.id, this.melliDate.getRangeForReqest())},
      {type: 'TempInt', obs: this.recordService.getTempIntByHive(hive.id, this.melliDate.getRangeForReqest())},
      {type: 'Weight', obs: this.recordService.getWeightByHive(hive.id, this.melliDate.getRangeForReqest())},
      {type: 'Hint', obs: this.recordService.getHintIntByHive(hive.id, this.melliDate.getRangeForReqest())}
    ];
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _record => {
        _record.forEach((_elt, index) => {
          this.getSerieByData(_elt, obsArray[index].type, (serieComplete) => {
              serieComplete.yAxisIndex = this.getIndexGridByIndex(obsArray[index].type);
              serieComplete.xAxisIndex = this.getIndexGridByIndex(obsArray[index].type);
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive) 
              };
              console.error(this.stackService.getColorByIndex(this.getHiveIndex(hive), hive));
              this.options.series.push(serieComplete);
          });
        });
        this.stackService.getEchartInstance().setOption(this.options);
        this.resetSerieSubject();
      }
    )
  }

  /**
   *
   *
   * @param {number} index
   * @returns {number}
   * @memberof StackComponent
   */
  getIndexGridByIndex(type: string): number {
    switch(type) {
      case 'TempInt':
      case 'TempExt':
        return 1;
      case 'Weight':
        return 0;
      case 'Hint':
        return 2;
      default:
        break;
    }
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackComponent
   */
  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getEchartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.split('|')[0] === hive.name);
     if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.options.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getEchartInstance().setOption(option, true);
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

}
