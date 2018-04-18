import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { ActivatedRoute, Params } from '@angular/router';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Toolbox, Rest } from 'bdt105toolbox/dist';

@Component({
    selector: 'input',
    templateUrl: './input.component.html',
    providers: []
})

export class InputComponent extends GenericComponent{

    public id: string;

    private toolbox: Toolbox = new Toolbox();

    private data: any;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService,
        public menuService: MenuService, private activatedRoute: ActivatedRoute){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.data = this.toolbox.readFromStorage("data");
        this.activatedRoute.params.subscribe(params => {
            this.getParams();
        });         
    }

    getParams (){
        if (this.activatedRoute.snapshot.params["id"]){
            this.id = this.activatedRoute.snapshot.params["id"];
            this.load();
        }
    } 

    load(){
        this.toolbox
    }
}