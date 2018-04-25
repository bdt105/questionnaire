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
    selector: 'test',
    templateUrl: './test.component.html',
    providers: []
})

export class TestComponent extends GenericComponent {

    public __fileName: string;

    @Input() set fileName(value: string){
        this.__fileName = value;
        this.load();
    };

    get fileName(): string{
        return this.__fileName;
    };

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
    }

    private manageData(data: any){
        if (data){
            this.data = JSON.parse(data._body);
            this.data.score = this.testService.getScore(this.data.questions);
            this.data.startDateString = this.toolbox.formatDateToLocal(new Date(this.data.startDate), true);
            this.data.endDateString = this.toolbox.formatDateToLocal(new Date(this.data.endDate), true);;
        }
    }

    private manageError(error: any){
        this.data = error;
    }

    load(){        
        this.testService.load1(
            (data: any) => this.manageData(data), 
            (error: any) => this.manageError(error), this.__fileName);
    }
    
}