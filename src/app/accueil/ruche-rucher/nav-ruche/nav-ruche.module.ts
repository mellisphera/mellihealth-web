import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from '../ruche-detail/daily/daily.component';
import { HourlyComponent } from '../ruche-detail/hourly/hourly.component';
import { StockComponent } from '../ruche-detail/stock/stock.component';
import { HealthComponent } from '../ruche-detail/health/health.component';
import { NavRucheRoutingModule } from './nav-ruche-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ObservationComponent } from '../ruche-detail/observation/observation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendrierPoidsService } from '../ruche-detail/stock/service/calendrier-poids.service';
import { DailyRecordsWService } from '../ruche-detail/service/daily-records-w.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { DailyStockHoneyService } from '../ruche-detail/service/daily-stock-honey.service';
import { GrapheReserveMielService } from '../ruche-detail/stock/service/graphe-reserve-miel.service';
import { GraphRecordService } from '../ruche-detail/hourly/service/graph-record.service';
import { RecordService } from '../ruche-detail/service/Record/record.service';
import { CalendrierHealthService } from '../ruche-detail/health/service/calendrier-health.service';
import {  EChartOption } from 'echarts';

@NgModule({
  imports: [
    CommonModule,
    NavRucheRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEchartsModule

  ],
  declarations: [
    DailyComponent,
    HourlyComponent,
    StockComponent,
    HealthComponent,
    ObservationComponent
  ],
  providers:[
    CalendrierPoidsService,
    DailyRecordsWService,
    DailyStockHoneyService,
    GrapheReserveMielService,
    GraphRecordService,
    RecordService,
    CalendrierHealthService

    

  ]
})
export class NavRucheModule { }
