import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'questionnaires',
    templateUrl: './questionnaires.component.html',
    providers: []
})

export class QuestionnairesComponent extends GenericComponent {


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
        this.load();
    }

    private successLoad(data: any){
        if (data && data._body){
            this.data = this.toolbox.parseJson(data._body);
        }else{
            this.data = [];
        }
        this.questionnaireService.saveToLocal(this.data);
        console.log("success load", this.data);
    }

    private failureLoad(error: any){
        this.error = error;
        let raw = this.questionnaireService.loadFromLocal();
        this.data = this.toolbox.parseJson(raw);
        if (!this.data){
            this.data = [];
        }
        console.log("failure load", this.data);
    }

    load(){        
        this.questionnaireService.load(
            (data: any) => this.successLoad(data), (error: any) => this.failureLoad(error));
    }

    newQuestion(questionnaire: any){
        this.questionnaireService.newQuestion(questionnaire);
    }

    newQuestionnaire(){
        if (!this.data || this.data == "undefined"){
            this.data = [];
        }
        this.questionnaireService.newQuestionnaire(this.data);
    }

    newAnswer(question: any){
        this.questionnaireService.newAnswer(question);
    }

    deleteAnswer(question: any, answer: any){
        this.questionnaireService.deleteAnswer(question, answer);
    }

    deleteQuestion(questionnaire: any, question: any){
        this.questionnaireService.deleteQuestion(questionnaire, question);
    }

    deleteQuestionnaire(questionnaire: any){
        this.questionnaireService.deleteQuestionnaire(this.data, questionnaire);        
    }

    private successSave(data: any){
        console.log("success save", data);
    }

    private failureSave(error: any){
        console.log("failure save", error);
    }

    save(){
        this.questionnaireService.save(
            (data: any) => this.successSave(data), 
            (error: any) => this.failureSave(error), this.data);
    }

    importQuestions(questionnaire: any, importQuestions: string){
        this.questionnaireService.importQuestions(questionnaire, importQuestions);
        this.questionnaireService.saveToLocal(this.data);
    }
}