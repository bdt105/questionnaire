import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Toolbox } from 'bdt105toolbox/dist';

import { GenericComponent } from '../../components/generic.component';
import { TranslateService } from '../../services/translate.service';
import { ConfigurationService } from '../../services/configuration.service';
import { ConnexionService } from '../../services/connexion.service';
import { QuestionnaireService } from '../../services/questionnaire.service';


import { ViewEncapsulation, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: []
})

export class LoginComponent extends GenericComponent{
    loginUrl: any;
    
    private toolbox: Toolbox = new Toolbox();
    public isConnected = false;

    @Output() connected: EventEmitter<any> = new EventEmitter<any>();
    @Output() disconnected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router, 
        public configurationService: ConfigurationService, 
        public translateService: TranslateService, 
        public connexionService: ConnexionService, private sanitizer: DomSanitizer,
        public questionnaireService: QuestionnaireService) {
        super(configurationService, translateService);
        this.init();
    }

    init(){
        window.addEventListener('message', (event) => {
            if (event.data){
                if (event.data.type == "connexion"){
                    this.toolbox.writeToStorage("connexion", event.data, true);
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
        this.loginUrl = this.configurationService.get().common.loginUrl;
    }
    
    private refresh(){
        this.isConnected = this.connexionService.isConnected();
    }

    getCurrentUser(){
        return this.connexionService.getUser();
    }

    getApplicationName(){
        return this.configurationService.get().common.applicationName;
    }

}