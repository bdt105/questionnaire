import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'inputs',
    templateUrl: './inputs.component.html',
    providers: []
})

export class InputsComponent extends GenericComponent {


    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public data: any;
    public error: any;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.questionnaireService.get();
        this.load();
    }

    private manageData(data: any){
        this.data = JSON.parse(data._body);
        this.toolbox.writeToStorage("data", this.data, true);
    }

    private manageError(error: any){
        this.error = error;
    }

    load(){        
        this.questionnaireService.load((data: any) => this.manageData(data),
        (error: any) => this.manageError(error));
    }

    newQuestion(questionnaire: any){
        this.questionnaireService.newQuestion(questionnaire);
    }

    newAnswer(question: any){
        this.questionnaireService.newAnswer(question);
    }

    deleteAnswer(question: any, answer: any){
        this.questionnaireService.deleteAnswer(question, answer);
    }
}