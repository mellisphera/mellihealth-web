import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { UserloggedService } from '../../userlogged.service';
import {Router} from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls : ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
    message : string;
    username : string;
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;eza
    public lastConnexion : string;

    constructor(location: Location,  
        private element: ElementRef, 
        private data : UserloggedService,
        private router: Router, 
        private authService : AuthService,) {
        try{
            this.lastConnexion = this.authService.lastConnection.toDateString();
        }
        catch(e){}  
      this.location = location;
      this.sidebarVisible = false;
        this.username= data.currentUser().username;
        console.log("Local storage"+localStorage);
    }

    logout(){
        this.authService.isAuthenticated = false;
        sessionStorage.connexion = "false";
        sessionStorage.removeItem('currentUser');
        console.log(this.authService.connexionStatus);
        console.log(this.authService.isAuthenticated);
        console.log(sessionStorage.getItem("connexion"));
        this.authService.connexionStatus.next(false);
        this.router.navigate(['/login']);
        localStorage.removeItem('currentRucher');
        console.log("Local storage user : "+localStorage.get('currentUser'));
        console.log("Local storage rucher : "+localStorage.getItem('currentRucher'));
    }

    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
      this.data.currentMessage.subscribe(message=>this.message=message);
      console.log(this.authService.lastConnection);
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.split('/').pop();
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
  
}
