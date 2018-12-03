import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../../config';
import { DailyRecordsW } from '../../../../_model/daily-records-w';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DailyRecordsWService {


  /*
  *   Service poue les données DailyRecordsW pour le calendrier de poid
  *
  */

  dailyObs : Observable<DailyRecordsW[]>;

  dailyRec : DailyRecordsW[];
  dailyRecArray : any[];
  mergeOption : any = null;
  rangeCalendar  : any[];

  timeLine : any[];

  constructor(private http : HttpClient) { 
    this.dailyRecArray = [];
  }

  getDailyRecordsWbyIdHive(idHive : string){
    this.dailyRecArray = [];
    this.dailyRec = [];
    var start, end = null;
    this.dailyObs = this.http.get<DailyRecordsW[]>(CONFIG.URL+'/dailyRecordsW/hive/'+idHive);
    this.dailyObs.subscribe(
      (data)=>{
        //console.log(data); 
          this.rangeCalendar = [];
          try{
                start = this.convertDate(data[0].recordDate);
                end = this.convertDate(data[data.length-1].recordDate);
                console.log(this.getMonth(this.convertDate(data[0].recordDate)) - this.getMonth(data[data.length-1].recordDate));
                if((this.getMonth(this.convertDate(data[0].recordDate)) - this.getMonth(data[data.length-1].recordDate)) < -2){
                  start = this.getYear(start)+'-'+(this.getMonth(start))+'-'+'31';
                }
                else{
                  end = this.getYear(start)+'-'+(this.getMonth(start)+5) + '-30';
                }
          }
          catch(e){
            console.log("Aucune donnée");
          }
          finally{
            if(start != null){
                console.log(start+'-'+end);
                //this.rangeCalendar.push(this.convertDate(data[0].recordDate), this.convertDate(data[data.length-1].recordDate));
                this.rangeCalendar.push(start,end);
                //console.log(this.rangeCalendar);
                data.forEach((element, index)=>{
                  this.dailyRec.push({
                    recordDate : this.convertDate(element.recordDate),
                    idHive : element.idHive,
                    temp_int_min : element.temp_int_min,
                    temp_int_max : element.temp_int_max,
                    weight_min : element.weight_min,
                    weight_max : element.weight_max,
                    weight_gain : element.weight_gain,
                    weight_income_gain : element.weight_income_gain,
                    weight_foragingbees : element.weight_foragingbees,
                    weight_hive : element.weight_hive,
                    weight_colony : element.weight_colony,
                    weight_filling_rate : element.weight_filling_rate
                });
              });
                 //console.log(this.dailyRec);
                this.getArray();
                //console.log(this.dailyRecArray);
                this.updateCalendar();
              }
            }
      },
      (err)=>{
        console.log(err);
      }

    );
  }

  updateCalendar(){
    this.mergeOption = {
      calendar : [{
        range: this.rangeCalendar,
      }],
      series : [
        {
            data: this.dailyRecArray,

        },
        {
            data: this.dailyRecArray,
        },

      ]
    }
  }
  
  cleanQuery(){
    this.dailyRec = [];
    this.dailyRecArray = [];
    this.dailyObs = null;
    this.mergeOption = null;
  }

  convertDate(date : string){
    var dateIso = new Date(date);
    var jour = ''+dateIso.getDate();
    var mois = ''+(dateIso.getMonth()+1);
    var anee = dateIso.getFullYear();
    if(parseInt(jour) < 10 ){ jour = '0'+jour; }
    if(parseInt(mois) < 10 ){ mois = '0'+mois; }

    return anee + '-' +mois+'-'+ jour;
  }

  getMonth(date : string){
    return new Date(date).getMonth()+1;
  }
  getYear(date : string){
    return new Date(date).getFullYear();
}

  getArray(){
    this.timeLine = [];
    let lastMonth = null;
    this.dailyRec.forEach((element,index) =>{
      if(this.getMonth(element.recordDate) != lastMonth){
        this.timeLine.push(element.recordDate);
      }
        this.dailyRecArray.push([
          element.recordDate,
          element.weight_income_gain, 
          element.idHive,
          element.temp_int_min,
          element.temp_int_max,
          element.weight_min,
          element.weight_max,
          element.weight_gain,
          element.weight_foragingbees,
          element.weight_hive,
          element.weight_colony,
          element.weight_filling_rate
        ]);
        lastMonth = this.getMonth(element.recordDate)
    });
  }

}