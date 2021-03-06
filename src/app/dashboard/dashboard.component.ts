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

import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { UserloggedService } from '../userlogged.service';
import { LoadingService } from './service/loading.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RucherService } from './service/api/rucher.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MyNotifierService } from './service/my-notifier.service';
import { MessagesService } from './service/messages.service';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoutingHistoryService } from './service/routing-history.service';
import { RucheService } from './service/api/ruche.service';
import { AlertsService } from './service/api/alerts.service';
import { FitnessService } from './service/api/fitness.service';
import { DeviceStatusService } from './service/api/device-status.service';
import { CapteurService } from './service/api/capteur.service';
import { BehaviorSubject } from 'rxjs';
import { HubService } from './service/api/hub.service';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message: string;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private homeComponent: any;
  public loading = true;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour}
  @ViewChild(NavbarComponent) public navComponent: NavbarComponent;
  constructor(public login: UserloggedService,
    public loadingService: LoadingService,
    private userService: UserloggedService,
    private rucheService: RucheService,
    private alertService: AlertsService,
    private myNotifierService: MyNotifierService,
    private routingHistory: RoutingHistoryService,
    private fitnessService: FitnessService,
    private hubService: HubService,
    private deviceStatusService: DeviceStatusService,
    private messagesService : MessagesService,
    private capteurService: CapteurService,
    public rucherService: RucherService,
    private router: Router) {
    this.message = '';
    this.myNotifierService.setLang(this.login.getCountry() ? this.login.getCountry() : 'EN');
    this.messagesService.setLang(this.login.getCountry() ? this.login.getCountry() : 'EN');
/*     this.rucherService.rucherSubject.subscribe(() => {}, () => {}, () => {
      if (this.rucherService.checkIfApiary()) {
        this.login.setFristConnection(false);
      }
    }); */
    this.rucheService.hiveSubject = new BehaviorSubject([]);
    this.rucherService.getApiaryByUser(this.userService.getIdUserLoged());
    this.alertService.callInitRequest();
    this.rucheService.callHiveRequest();
    this.deviceStatusService.callRequest(this.userService.getIdUserLoged());
    this.capteurService.getUserCapteurs();
    this.fitnessService.callRequest(this.userService.getIdUserLoged());
    this.routingHistory.loadRouting();
    this.hubService.callRequest(this.userService.getIdUserLoged());
  }

  ngOnInit() {

  }

  apiaryChange() {
    this.checkHomeComponent().then(() => {
      <HomeComponent>this.homeComponent.checkIfInfoApiaryComponent().then(
        () => {
          <HomeComponent>this.homeComponent.infoApiaryComponent.alertsComponent.initCalendar(true);
          <HomeComponent>this.homeComponent.onLockHive();
          <HomeComponent>this.homeComponent.loadAlert();
        }
      )
    }).catch(err => {
      console.log(err);
    });
  }

  setRouterPage(event) {
    if (event instanceof HomeComponent) {
      this.homeComponent = event;
    }
  }

  checkHomeComponent(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.homeComponent instanceof HomeComponent) {
        resolve(true);
      } else {
        reject(false);
      }
    })
  }

  receiveMessage($event) {
    this.message = $event;
  }

  hideCRUD(event : any){
    if(event.target.id !== 'menuCheckbox'){
      let elt : any = document.getElementById("menuCheckbox");
      elt.checked = false;
    }
    if((event.target.id !== 'menuCheckboxHome') && (/home/g.test(this.router.url))){
      let elt : any = document.getElementById("menuCheckboxHome");
      if(elt !== null){
        elt.checked = false;
      }
    }
  }
}
