import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'tester',
    templateUrl: './tester.component.html',
    providers: []
})

export class TesterComponent extends GenericComponent {


    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public questionnaires: any;
    public error: any;

    public testInProgress = false;

    public showResults = false;

    public test: any;

    public currentQuestionIndex = 0;

    public showDefinition = true;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.test = this.questionnaireService.newQuestionnaire("test");
        this.load();
    }

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
            (error: any) => this.failureLoadQuestionnaires(error));
    }

    private nextQuestion(){
        if (this.test && (this.currentQuestionIndex < this.test.questions.length - 1)){        
            this.currentQuestionIndex ++;
        }
        this.getScore();
    }

    private previousQuestion(){
        if (this.currentQuestionIndex > 0){
            this.currentQuestionIndex --;
        }
        this.getScore();
    }

    start(){
        this.testInProgress = true;
        this.showResults = false;
        let questions = this.questionnaireService.generateQuestions(this.questionnaires, this.test.randomQuestions, this.test.jeopardy, this.test.nbQuestions);
        this.test.questions = questions;
        if (!this.test.nbQuestions){
            this.test.nbQuestions = this.test.questions.length;
        }
        this.test.startDate = this.toolbox.dateToDbString(new Date());
        this.getScore();        
    }

    checkQuestion(question: any, answer: string){
        if (this.currentQuestionIndex == this.test.questions.length - 1){
            this.test.endDate = this.toolbox.dateToDbString(new Date());
        }        
        this.questionnaireService.checkQuestion(question, answer);
        if (this.test.nextIfCorrect && this.test.questions[this.currentQuestionIndex].status){
            this.nextQuestion();
        }
        this.getScore();
        this.saveTest();
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

}