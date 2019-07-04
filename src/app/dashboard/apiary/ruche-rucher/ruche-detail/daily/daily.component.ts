import { Component, OnInit } from '@angular/core';
import { CalendrierTempIntService } from './service/calendrier-temp-int.service';
import { ActivatedRoute } from '@angular/router';
import { DailyRecordService } from '../../../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { RucheService } from '../../../../service/api/ruche.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit {

  message="";
  rucheId;
  rucheName : string;

  constructor(public calendrierTempInt : CalendrierTempIntService, private activatedRoute: ActivatedRoute,
    public dailyRecordThService: DailyRecordService,
    public dailyRecordWservice: DailyRecordsWService) { }

  ngOnInit() {
    /*this.rucheId = this.activatedRoute.snapshot.params.id;
    this.dailyRecordThService.getByIdHive(this.rucheId);
    this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.ruche.id);*/
  }

}
