import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { ConfigurationService } from '../services/configuration.service';

export class GenericComponent implements OnInit{

    // public canDisplay: boolean = false;
    
    // private canDisplaySuccess(data: any){
    //     this.canDisplay = (data != null);
    // }

    // private canDisplayFailure(data: any){
    //     this.canDisplay = false;
    // }

    constructor(public configurationService: ConfigurationService, public translateService: TranslateService){
        // this.configurationService.init((data: any) => this.canDisplaySuccess(data), (error: any) => this.canDisplayFailure(error));
    }

    ngOnInit(){

    }

    translate(text: string){
        return this.translateService.translate(text);
    }    
}