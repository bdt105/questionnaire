import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GenericComponent } from '../../components/generic.component';
import { ConnexionTokenService } from 'bdt105angularconnexionservice';
import { QuestionnaireService } from '../../services/questionnaire.service';

import { ViewEncapsulation, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: []
})

export class LoginComponent extends GenericComponent{
    loginUrl: any;
    
    public isConnected = false;
    public loadComplete = false;

    @Output() connected: EventEmitter<any> = new EventEmitter<any>();
    @Output() disconnected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router, 
        public connexionService: ConnexionTokenService, private sanitizer: DomSanitizer,
        public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
            super(miscellaneousService);
    }

    init(){
//        this.loadComplete = this.miscellaneousService.configuration() && this.miscellaneousService.translation();
        if (!this.loadComplete){
            let load = this.miscellaneousService.getConfigurationPromise().
            then(()=>{
                this.loadComplete = true;
                console.log("load is complete");
                this.loginUrl = this.miscellaneousService.configuration().common.loginUrl;                
            });
        }
        window.addEventListener('message', (event) => {
            if (event.data){
                if (event.data.type == "connexion"){
                    this.toolbox.writeToStorage("connexion", event.data, false);
                    this.router.navigate(["/home"]);
                    this.refresh();
                }
            }else{
                this.toolbox.removeFromStorage("connexion");
                this.refresh();                
            }
        }, false);  

    }

    ngOnInit(){
        this.init();        
    }
    
    private refresh(){
        this.isConnected = this.connexionService.isConnected();
    }

    getCurrentUser(){
        return this.connexionService.getUser();
    }

    getApplicationName(){
        return this.miscellaneousService.configuration().common.applicationName;
    }

}