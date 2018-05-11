import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

@Component({
    selector: 'tester',
    templateUrl: './tester.component.html',
    providers: []
})

export class TesterComponent extends GenericComponent {


    activatedRoute: any;
    public filterType: string;
    public showDisabled: boolean;
    public nbQuestions: number;

    public questionnaires: any;
    public questionnairesFiltered: any;

    public error: any;

    public testInProgress = false;

    public showResults = false;

    public test: any;

    public showDefinition = true;

    private id: string;

    constructor(public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
    }

    ngOnInit(){
        this.test = this.questionnaireService.newQuestionnaire("test");
        this.test.edit = false;
        this.filterType = "questionnaire";
        this.showDisabled = false;
        // this.activatedRoute.params.subscribe(params => {
        //     this.getParams();
        // });       
        this.load();
    }

    // getParams (){
    //     if (this.activatedRoute.snapshot.params["id"]){
    //         this.id = this.activatedRoute.snapshot.params["id"];
    //         this.load();
    //     }
    // }

    private successLoadQuestionnaires(data: any){
        this.questionnaires = data;
    }

    private failureLoadQuestionnaires(error: any){
        this.error = error;
        console.log("failure load", this.error);
    }

    load(){        
        this.questionnaireService.loadQuestionnaires(
            (data: any) => this.successLoadQuestionnaires(data), 
            (error: any) => this.failureLoadQuestionnaires(error), this.filterType, this.showDisabled);
    }

    private nextQuestion(){
        if (this.test && (this.test.currentQuestionIndex < this.test.questions.length - 1)){        
            this.test.currentQuestionIndex ++;
        }
        this.getScore();
    }

    private previousQuestion(){
        if (this.test.currentQuestionIndex > 0){
            this.test.currentQuestionIndex --;
        }
        this.getScore();
    }

    start(){
        this.test.currentQuestionIndex = 0;
        this.testInProgress = true;
        this.showResults = false;
        this.test.nbQuestions = this.nbQuestions;
        let questions = this.questionnaireService.generateQuestions(
            this.questionnaires, this.test.randomQuestions, this.test.jeopardy, this.test.nbQuestions, this.test.favoriteOnly);
        this.test.questions = questions;
        if (!this.test.nbQuestions){
            this.test.nbQuestions = this.test.questions.length;
        }
        this.test.startDate = this.toolbox.dateToDbString(new Date());
        this.getScore();        
    }

    checkQuestion(question: any, answer: string){
        if (this.test.currentQuestionIndex == this.test.questions.length - 1){
            this.test.endDate = this.toolbox.dateToDbString(new Date());
        }        
        this.questionnaireService.checkQuestion(question, answer, this.test.exactMatching);
        if (this.test.nextIfCorrect && this.test.questions[this.test.currentQuestionIndex].status){
            this.nextQuestion();
        }
        this.getScore();
//        this.saveTest();
    }

    private saveTest(){
        let fake = (data: any) => {}
        this.test.endDate = this.toolbox.dateToDbString(new Date());
        this.questionnaireService.saveQuestionnaire(fake, fake, this.test);
    }

    private getScore(){
        this.test.score = this.questionnaireService.getScore(this.test.questions);
    }

    private getTestTitle(){
        let title = "";
        for (var i = 0; i < this.questionnaires.length; i++){
            if (this.questionnaires[i].test){
                title += (title ? ", " : "") + this.questionnaires[i].title;
            }
        }
        return title;
    }

    selectQuestionnaire(){
        this.test.nbQuestions = null;
        this.test.defaultTitle = this.getTestTitle();
    }

    selectAll(sel: boolean){
        if (this.questionnairesFiltered){
            for (var i = 0; i < this.questionnairesFiltered.length; i++){
                this.questionnairesFiltered[i].test = sel;
            }
        }
    }

    filter(type: string = null, showDisabled: boolean = null){
        this.filterType = type;
        this.showDisabled = (showDisabled == null ? true : showDisabled);
        this.load();
    } 

    check(){
        let answer = this.test.questions[this.test.currentQuestionIndex].customAnswer;
        if (answer){
            if (answer[answer.length - 1] == "\n"){
                answer = answer.substr(0, answer.length - 1);
            }
            this.test.questions[this.test.currentQuestionIndex].customAnswer = answer;
        }
        this.checkQuestion(this.test.questions[this.test.currentQuestionIndex], this.test.questions[this.test.currentQuestionIndex].customAnswer)        
    }
}