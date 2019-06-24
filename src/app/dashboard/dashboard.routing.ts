import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { RucheRucherComponent } from './apiary/ruche-rucher/ruche.rucher.component';
import { RapportComponent } from './rapport/rapport.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { MeteoComponent } from './meteo/meteo.component';
import { AdminComponent } from './admin/admin.component';
import { StackApiaryComponent } from './apiary/stack-apiary/stack-apiary.component';
import { CapteurComponent } from './capteur/capteur.component';
import { MelliChartsComponent } from './melli-charts/melli-charts.component';
import { Erreur404ComponentComponent } from '../erreur404-component/erreur404-component.component';
import { PreferenceConfigComponent } from './preference-config/preference-config.component';
import { ApiaryNotesComponent } from './apiary/apiary-notes/apiary-notes.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
            { path: 'ruche-et-rucher', component: RucheRucherComponent, canActivate: [AuthGuardService]},
            { path: 'ruche-detail', loadChildren: './apiary/ruche-rucher/ruche-detail/ruche.module#RucheModule'},
            { path: 'rapport', component: RapportComponent, canActivate: [AuthGuardService]},
            { path: 'fleurs-floraison', component: FleursFloraisonComponent, canLoad: [AuthGuardService]},
            { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
            { path: 'admin', loadChildren : './admin/admin.module#AdminModule', canLoad: [AuthGuardService]},
            { path: 'stack-apiary', component: StackApiaryComponent, canActivate: [AuthGuardService]},
            { path: 'capteurs', component: CapteurComponent},
            { path: 'apiary-notes', component: ApiaryNotesComponent, canActivate: [AuthGuardService]},
            { path: 'melli-charts', component: MelliChartsComponent, canActivate: [AuthGuardService]},
            { path: 'preferences', component: PreferenceConfigComponent, canActivate: [AuthGuardService]},
            { path: 'melli-charts', loadChildren: './melli-charts/melli-charts#MelliChartsModule', canLoad: [AuthGuardService]}


        ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class DasboardRoutingModule { }