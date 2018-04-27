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
    selector: 'tester',
    templateUrl: './tester.component.html',
    providers: []
})

export class TesterComponent extends GenericComponent {


    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public questionnaires: any;
    public error: any;

    public nbQuestions;
    public title: string;
    public randomQuestions = false;
    public jeopardy = false;

    public testInProgress = false;

    public showResults = false;

    public test: any;

    public currentQuestionIndex = 0;

    public nextIfCorrect = true;

    public showDefinition = true;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http, public testService: TestService){
        super(configurationService, translateService);
    }

    ngOnInit(){
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
        this.test = this.testService.generate(this.questionnaires, this.randomQuestions, this.jeopardy, this.nbQuestions);
        if (!this.nbQuestions){
            this.nbQuestions = this.test.questions.length;
        }
        this.test.startDate = this.toolbox.dateToDbString(new Date());
        this.getScore();        
    }

    checkQuestion(question: any, answer: string){
        if (this.currentQuestionIndex == this.test.questions.length - 1){
            this.test.endDate = this.toolbox.dateToDbString(new Date());
        }        
        this.questionnaireService.checkQuestion(question, answer);
        if (this.nextIfCorrect && this.test.questions[this.currentQuestionIndex].status){
            this.nextQuestion();
        }
        this.getScore();
        this.saveTest();
    }

    private saveTest(){
        let fake = (data: any) => {}
        this.test.endDate = this.toolbox.dateToDbString(new Date());
        this.testService.save(fake, fake, this.test);
    }

    private getScore(){
        this.test.score = this.testService.getScore(this.test.questions);
    }

    selectQuestionnaire(){
        this.nbQuestions = null;
    }

}