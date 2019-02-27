import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CONFIG } from '../../../../../config';
import { Record } from '../../../../_model/record';
import { Observable, BehaviorSubject } from 'rxjs';
import { RangeData } from 'src/app/_model/range-data';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  recArray: Record[];
  recordObs: Observable<Record[]>;
  loading: boolean;
  recArrrayTint: any[];
  recArrayText: any[];
  recArrayWeight: any[];
  recArrayDateExt: any[];
  recArrayDateInt: any[];
  recArrayHint: any[];
  recArrayHext: any[];
  recArrayBatteryInt: any[];
  recArrayBatteryExt: any[];
  mergeOptionHourly: any = null;
  currentIdHive: string;
  private rangeSubject: BehaviorSubject<RangeData>;
  mergeOptionStack: any = null;

  constructor(private http: HttpClient) {
    this.currentIdHive = null;
    this.loading = false;
    this.rangeSubject = new BehaviorSubject({scale: 15, type: 'day'});
  }

  getRecordByIdHive(idHive: string, range?: Date[]) {
    this.loading = false;
    this.currentIdHive = idHive;
    this.recArray = [];
    this.recordObs = this.http.post<Record[]>(CONFIG.URL + 'records/hive/' + idHive, range, httpOptions );
    this.recordObs.subscribe(
      (data)=>{
        this.recArray = data;
        this.sortRecordByTemp();
        this.updateMerge();
        this.loading = !this.loading;
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  getRangeObs(): Observable<RangeData> {
    return this.rangeSubject.asObservable();
  }

  setRangeObs(scale: RangeData): void {
    this.rangeSubject.next(scale);
  }

  updateMerge() {
    this.mergeOptionHourly = {
      series: [
        {
          data : this.recArrayWeight
        },
        {
          data : this.recArrrayTint
        },
        {
          data : this.recArrayText
        }
      ]
    };
    this.mergeOptionStack = {
      series :[
        {
          data : this.recArrrayTint
        },
        {
          data : this.recArrayText
        },
        {
         data : this.recArrayHint
        },
        {
          data : this.recArrayHext
        },
        {
          data : this.recArrayBatteryInt
        },
        {
          data : this.recArrayBatteryExt
        }
      ]
    }
  }
  sortRecordByTemp(){
    this.recArrrayTint = [];
    this.recArrayText = [];
    this.recArrayDateInt = [];
    this.recArrayWeight = [];
    this.recArrayDateExt = [];
    this.recArrayBatteryExt = [];
    this.recArrayBatteryInt = [];
    this.recArrayHext = [];
    this.recArrayHint = [];
    this.recArray.forEach((element,index)=>{
      if(element.temp_ext != null){
        this.recArrayText.push({name : element.recordDate, value : [
          element.recordDate , element.temp_ext
        ]});
        this.recArrayWeight.push({name : element.recordDate,value :[
          element.recordDate,element.weight
        ]});
        this.recArrayBatteryExt.push({name : element.recordDate, value : [
          element.recordDate, element.battery_ext
        ]});
        this.recArrayHext.push({name : element.recordDate, value : [
          element.recordDate , element.humidity_ext
        ]});
       // this.recArrayDateExt.push(element.recordDate,element.recordDate);
      }
      else if(element.temp_int != null){
        this.recArrrayTint.push({ name : element.recordDate, value : [
          element.recordDate, element.temp_int
        ]});
        this.recArrayBatteryInt.push({name : element.recordDate, value : [
          element.recordDate, element.battery_int
        ]});
        this.recArrayHint.push({name : element.recordDate, value : [
          element.recordDate , element.humidity_int
        ]});
        //this.recArrayDateInt.push(element.recordDate);
      
      }
    });
  }
}
