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


    public tester: any;
    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public data: any;
    public error: any;

    public nbQuestions;
    public title: string;
    public randomQuestions = false;
    public jeopardy = false;

    public testInProgress = false;

    public showResults = false;

    public currentQuestions: any;

    public currentQuestionIndex = 0;

    public nextIfCorrect = true;

    public startDate = null;
    public endDate = null;

    public showDefinition = true;
    public score:any = {};

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http, public testService: TestService){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.load();
    }

    private manageData(data: any){
        if (data && data._body){
            this.data = JSON.parse(data._body);
        }else{
            this.data = [];
        }
        this.questionnaireService.saveToLocal(this.data);
    }

    private manageError(error: any){
        this.error = error;
        let raw = this.questionnaireService.loadFromLocal();
        this.data = this.toolbox.parseJson(raw);
        if (!this.data){
            this.data = [];
        }
        console.log("failure load", this.data);
    }

    load(){        
        this.questionnaireService.load((data: any) => this.manageData(data), (error: any) => this.manageError(error));
    }

    private generateTest(jeopardy: boolean = false){
        this.currentQuestions = null;
        this.currentQuestions = [];
        this.currentQuestions = this.testService.generate(this.data, this.randomQuestions, jeopardy, this.nbQuestions);
    }

    private nextQuestion(){
        if (this.currentQuestionIndex < this.currentQuestions.length - 1){        
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
        this.tester = null;
        this.testInProgress = true;
        this.showResults = false;
        this.generateTest(this.jeopardy);
        if (!this.nbQuestions){
            this.nbQuestions = this.currentQuestions.length;
        }
        this.startDate = Date.now();
        //this.showDefinition = false;
        this.getScore();        
    }

    checkQuestion(question: any, answer: string){
        if (this.currentQuestionIndex == this.currentQuestions.length - 1){
            this.endDate = Date.now();
        }        
        this.questionnaireService.checkQuestion(question, answer);
        if (this.nextIfCorrect && this.currentQuestions[this.currentQuestionIndex].status){
            this.nextQuestion();
        }
        this.getScore();
        this.saveTest();
    }

    private saveTest(){
        if (this.currentQuestionIndex == (this.currentQuestions.length - 1)){
            let fake = (data: any) => {

            }
            let saveDate = new Date().toString();
            let questionnaires = [];
            for (var i=0; i < this.data.length - 1; i++){
                if (this.data[i].test){
                    questionnaires.push(this.data[i].title);
                }
            }
            this.tester = {"title": this.title, "questionnaires": questionnaires, "random": this.randomQuestions, "questions": this.currentQuestions, "saveDate": saveDate, "startDate": this.startDate, "endDate": this.endDate};
            this.testService.save(fake, fake, this.tester);
        }
    }

    private getScore(){
        this.score = this.testService.getScore(this.currentQuestions);
    }

    selectQuestionnaire(){
        this.nbQuestions = null;
    }

}