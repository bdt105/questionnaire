import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { TestService } from '../../services/test.service';

@Component({
    selector: 'tests',
    templateUrl: './tests.component.html',
    providers: []
})

export class TestsComponent extends GenericComponent {


    public score: any;
    private toolbox: Toolbox = new Toolbox();

    public data: any;
    public error: any;


    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public testService: TestService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.load();
    }

    private manageData(data: any){
        this.data = data;
        this.testService.saveToLocal(this.data);
    }

    private manageError(error: any){
        this.data = error;
        this.testService.saveToLocal(this.data);
    }

    load(){        
        this.testService.load((data: any) => this.manageData(data), (error: any) => this.manageError(error));
    }

    private successLoad1(data: any, test: any){
        if (data && data._body){
            test.data = JSON.parse(data._body);
            test.score = this.testService.getScore(test.data.questions);
        }else{
            test.data = [];
        }
    }

    private failureLoad1(error: any, test: any){
        test.data = error;
    }

    toggleTest(test: any){
        test.showTest = !test.showTest;
        this.testService.load1(
            (data: any) => this.successLoad1(data, test), 
            (error: any) => this.failureLoad1(error, test), test.fileName);
    }
    
}