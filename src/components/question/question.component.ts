import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'question',
    templateUrl: './question.component.html',
    providers: []
})

export class QuestionComponent extends GenericComponent {

    private toolbox: Toolbox = new Toolbox();
    public showResults = false;

    @Input() question: any;
    @Input() questionnaire: any;
    @Input() editable: boolean = true;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
    }

    canEdit(){
        return this.question.edit && this.editable;
    }

    toggleEdit(){
        this.question.edit = !this.question.edit;
        this.question.showAnwsers = this.question.edit;
    }

    newAnswer(question: any){
        this.questionnaireService.newAnswer(question);        
    }

    deleteAnswer(question: any, answer: any){
        this.questionnaireService.deleteAnswer(question, answer);
        this.changed();
    }

    deleteQuestion(questionnaire: any, question: any){
        this.questionnaireService.deleteQuestion(questionnaire, question);
        this.changed();        
    }

    changed(){
        this.change.emit(this.question);
    }

    newQuestion(questionnaire: any, insertAfterQuestion: any = null){
        this.questionnaireService.newQuestion(questionnaire, insertAfterQuestion);
    }    
    
}