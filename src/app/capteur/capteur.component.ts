import { Component, OnInit } from '@angular/core';
import { CapteurService } from './capteur.service';
import { FormGroup, FormBuilder, Validators,FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RucherService } from '../ruche-rucher/rucher.service';
import { UserloggedService } from '../userlogged.service';

import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { selectedRucherService } from '../accueil/_shared-services/selected-rucher.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-capteur',
  templateUrl: './capteur.component.html',
  styleUrls: ['./capteur.component.scss']
})
export class CapteurComponent implements OnInit {

  username: string;

  editCapteurCheckbox : boolean;

  //variable to store ruches
  ruches: any [] = [];
  //for new sensor
  newCapteurForm : FormGroup;
  //to edit a sensor
  editCapteurForm : FormGroup;
  capteurSearch : string;

  message="";
  editedSensorMsg :boolean;
  editedSensorMsgE : boolean;
  public errorMsg;
    
    constructor(
        private data : UserloggedService,
        private _router : Router,
        private formBuilder: FormBuilder,
        public rucherService : RucherService,
        public capteurService : CapteurService,
        private _selectedRucherService : selectedRucherService, ) { 

        this.username = data.currentUser().username;
        this.initForm();
        
    }


    ngOnInit() {
    }

    onChangeCapteur($event){
        this.capteurService.capteur = $event.target.value;
    }
    selectCapteur(capteur){
        this.capteurService.capteur = capteur;
        /* Assigne les données du capteurs au formulaire pour modification*/
        let donnee = {
            checkbox: '',
            description: this.capteurService.capteur.description,
        };
        this.editCapteurForm.setValue(donnee);
        this.editCapteurCheckbox = !(this.capteurService.capteur.idHive == null || this.capteurService.capteur.idApiary == null);
        if(this.editCapteurCheckbox) { // Si le capteur n'était pas en stock
            this.rucherService.findRucherById(this.capteurService.capteur.idApiary);
            this.rucherService.rucheService.findRucheById(this.capteurService.capteur.idHive);
        }

    }

    receiveMessage($event) {
        this.message = $event;
    }

    onchange(event) {
        this.editCapteurCheckbox = (event.target.value === 'ruche');
    } 

   //CREATE CAPTEUR
    createCapteur() {
        const formValue = this.newCapteurForm.value;
        let tempType = this.capteurService.capteur.type;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if(formValue.checkbox != "stock"){
            this.capteurService.capteur.idHive = this.rucherService.rucheService.ruche.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucher.id;
            this.capteurService.capteur.apiaryName = this.rucherService.rucher.name;
            this.capteurService.capteur.hiveName = this.rucherService.rucheService.ruche.name;
        }
        else{
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.username = this.username;
        this.capteurService.capteur.reference = formValue.reference;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.createCapteur();
    }  
    getTypeAffectation(){
        return this.newCapteurForm.get('checkbox');
    }
    getTypeAffectationFormUpdate(){
        return this.editCapteurForm.get('checkbox');
    }
    getSensorRef(){
        return this.newCapteurForm.get('reference');
    }

    //DELETE CAPTEUR

    deleteCapteur(capteur){
       this.capteurService.capteur = capteur;
       this.capteurService.deleteCapteur();
     
    }

    updateCapteur() {
        const formValue = this.editCapteurForm.value;
        let tempType = this.capteurService.capteur.type;
        let idTemp = this.capteurService.capteur.id;
        this.capteurService.initCapteur();
        //this.capteurService.capteur = formValue;
        if(formValue.checkbox != "stock"){
            this.capteurService.capteur.idHive = this.rucherService.rucheService.rucheUpdate.id;
            this.capteurService.capteur.idApiary = this.rucherService.rucherUpdate.id;
            this.capteurService.capteur.apiaryName = this.rucherService.rucherUpdate.name;
            this.capteurService.capteur.hiveName = this.rucherService.rucheService.rucheUpdate.name;
        }
        else {
            this.capteurService.capteur.idHive = null;
            this.capteurService.capteur.idApiary = null;
            this.capteurService.capteur.apiaryName = null;
            this.capteurService.capteur.hiveName = null;
        }
        this.capteurService.capteur.description = formValue.description;
        this.capteurService.capteur.id = idTemp;
        this.capteurService.capteur.type = tempType;
        this.initForm();
        this.capteurService.updateCapteur();
    }

    onSelectRucher(){
        this.rucherService.rucheService.getRucheByApiary(this.username, this.rucherService.rucherUpdate.id);
    }

    initForm(){
        this.newCapteurForm = this.formBuilder.group({
            'reference': [null,Validators.compose([Validators.required,Validators.minLength(1), Validators.maxLength(20)])],
            'description': [null],
            'checkbox':'',
        });

        this.editCapteurForm = this.formBuilder.group({
            'description': [null],
            'checkbox':''
        });
    }
 
}