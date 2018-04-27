import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Toolbox } from 'bdt105toolbox/dist';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    providers: []
})

export class SearchComponent extends GenericComponent{

    private toolbox: Toolbox = new Toolbox();
    private search: string;
    
    private questionnaires: any;

    public questionsSearch: any;
    public error: any;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, private activatedRoute: ActivatedRoute, public questionnaireService: QuestionnaireService){
        super(configurationService, translateService);
    }


    ngOnInit(){
        this.activatedRoute.params.subscribe(params => {
            this.getParams();
        });       
    }

    getParams (){
        if (this.activatedRoute.snapshot.params["search"]){
            this.search = this.activatedRoute.snapshot.params["search"];
            this.load();
        }
    }

    private successLoad(data: any): any {
        this.questionnaires = data;
        this.fetch()
    }

    private failureLoad(error: any): any {
        console.log(error);
    }
    
    private load(){
        this.questionnaireService.loadQuestionnaires(
            (data: any) => this.successLoad(data),
            (error: any) => this.failureLoad(error)
        );
    }

    private fetch(){
        this.questionsSearch = null;
        this.questionsSearch = [];
        if (this.questionnaires && this.search){
            this.questionsSearch = this.questionnaireService.searchInQuestionsAndAnswers(this.questionnaires, this.search);
        }
    }

    updateQuestion(question: any){
        if (question && question.questionnaireId){
            let questionnaire = this.questionnaireService.getQuestionnaireById(this.questionnaires, question.questionnaireId);
            if (questionnaire){
                this.questionnaireService.updateQuestion(questionnaire, question);
                let fake = (data: any)=>{

                }
                this.questionnaireService.saveQuestionnaire(fake, fake, questionnaire);
            }
        }
    }
}