import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    providers: []
})

export class SearchComponent extends GenericComponent{

    public search: string;
    
    private questionnaires: any;

    public questionsSearch: any;
    public error: any;

    public filterType: string;
    public showDisabled: boolean;
    
    constructor(private activatedRoute: ActivatedRoute, public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
    }

    ngOnInit(){
        this.filterType = "questionnaire";
        this.showDisabled = false;
        
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
    
    public load(){
        this.questionnaireService.loadQuestionnaires(
            (data: any) => this.successLoad(data),
            (error: any) => this.failureLoad(error), this.filterType, this.showDisabled
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

    filter(type: string = null, showDisabled: boolean = null){
        this.filterType = type;
        this.showDisabled = (showDisabled == null ? true : showDisabled);
        this.load();
    } 
    
}