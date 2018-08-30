import { Component, OnInit} from '@angular/core';
import { Requete } from './Service/Requete';
import { JsonRequete } from './Service/JsonRequete';
import * as echarts from '../../../../assets/echarts';
import { Calendrier } from './calendrier';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { Rucher } from '../../ruche-rucher/rucher';
import { Meteo } from "./Service/Meteo";

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit {

  constructor(private rucherService : RucherService, private calendrier : Calendrier, private requete : Requete, private json : JsonRequete, private login : UserloggedService) { }

  calendrierInit : any = null;;
  meteo : any = null;
  tabRucher : Rucher[];
  idRucher : string;
  username: string;
  cityRucher : string;
  tabMeteo : Meteo[];
  ngOnInit() {
    this.username = this.login.currentUser().username;
    this.getRucherByUser();
    setTimeout(
      ()=>{
        this.cityRucher = this.tabRucher[0].codePostal;
        this.getWeatherByCity();
        setTimeout(()=>{
          console.log(this.meteo);
          this.json.setJsonWeather(this.meteo);
          this.json.sortProcess();
          this.tabMeteo=this.json.getResultat();
          this.showCalendar();
        },300)
      },300
    );
  }
//(change)="onChange($event)
  /* Recupéere la méteo pour un rucher */
  getWeatherByCity(){
    this.requete.getWeather(this.cityRucher).subscribe(
      (data)=>{
        this.meteo = data
      },
      (err)=>{
        console.log(err);
      }
    );
  }
  /* affiche le calendrier avec le tableau récupèrer */
  showCalendar(){
    if(this.calendrierInit != null){
      this.calendrierInit.dispose("#main");
      this.calendrierInit = null;
    }
    this.calendrierInit = echarts.init(document.getElementById('main'));
    this.calendrier.options.series[0].data = this.tabMeteo;
    this.calendrierInit.setOption(this.calendrier.options);
  }

  getRucherByUser() {
    this.rucherService.getUserRuchers(this.username).subscribe(
      (data) => {
        this.tabRucher = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChange(id){
    this
    this.idRucher = id.target.value;
    console.log(this.tabRucher[this.idRucher]);
    this.cityRucher = this.tabRucher[this.idRucher].ville;
    console.log(this.cityRucher);
    this.getWeatherByCity();
    setTimeout(()=>{
      this.json.setJsonWeather(this.meteo);
      this.json.sortProcess();
      this.tabMeteo=this.json.getResultat();
      this.showCalendar();
    },300)
  }

}
