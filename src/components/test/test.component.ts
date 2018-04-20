import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'test',
    templateUrl: './test.component.html',
    providers: []
})

export class TestComponent extends GenericComponent {


    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public data: any;
    public error: any;

    public nbQuestions;
    public randomQuestions = false;

    public testInProgress = false;

    public showResults = false;

    public currentQuestions: any;

    public currentQuestionIndex = 0;

    public nextIfCorrect = true;

    private name = "name";

    public startDate = null;
    public endDate = null;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
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
        this.questionnaireService.load((data: any) => this.manageData(data), (error: any) => this.manageError(error), this.name);
    }

    private generateTest(){
        this.currentQuestions = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        for (var i=0; i < this.data.length; i++){
            if (this.data[i].test){
                for (var j = 0; j < this.data[i].questions.length; j++){
                    let q = this.toolbox.cloneObject(this.data[i].questions[j]);
                    q.questionnaireTitle = this.data[i].title;
                    this.currentQuestions.push(q);
                }
            }
        }
        if (this.randomQuestions){
            this.currentQuestions = this.toolbox.shuffleArray(this.currentQuestions);
        }

    }

    private nextQuestion(){
        if (this.currentQuestionIndex < this.currentQuestions.length - 1){        
            this.currentQuestionIndex ++;
        }

    }

    private previousQuestion(){
        if (this.currentQuestionIndex > 0){
            this.currentQuestionIndex --;
        }
    }

    start(){
        this.testInProgress = true;
        this.showResults = false;
        this.generateTest();
        if (!this.nbQuestions){
            this.nbQuestions = this.currentQuestions.length;
        }
        this.startDate = Date.now();
    }

    checkQuestion(question: any, answer: string){
        if (this.currentQuestionIndex == this.currentQuestions.length - 1){
            this.endDate = Date.now();
        }        
        this.questionnaireService.checkQuestion(question, answer);
        if (this.nextIfCorrect && this.currentQuestions[this.currentQuestionIndex].status){
            this.nextQuestion();
        }
    }

    getScore(){
        var score = {"score": 0, "pourcentage": 0};
        for (var i=0; i< this.currentQuestions.length; i++){
            if (this.currentQuestions[i].status){
                score.score ++;
            }
        }
        score.pourcentage = Math.round(score.score / this.currentQuestions.length * 100);
        return score;
    }

    selectQuestionnaire(){
        this.nbQuestions = null;
    }

}