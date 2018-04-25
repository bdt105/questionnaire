import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
import { ConfigurationService } from './configuration.service';
import { ConnexionService } from './connexion.service';
import { QuestionnaireService } from './questionnaire.service';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Injectable()
export class TestService {

    private toolbox: Toolbox = new Toolbox(); 
    public storageKey = "test";
    public error: any;

    constructor (private configurationService: ConfigurationService, private connexionService: ConnexionService, 
        private http: Http, private questionnaireService: QuestionnaireService){
    }

    loadFromLocal(parseJson: boolean = false){
        return this.toolbox.readFromStorage(this.storageKey, parseJson);
    }

    removeFromLocal(){
        this.toolbox.removeFromStorage(this.storageKey);
    }
    
    saveToLocal(data: any){
        this.toolbox.writeToStorage(this.storageKey, data, true);
    }

    private fileNameToDate(fileName: string){
        // 20180423074825_test.json
        let year = Number.parseInt(fileName.substr(0, 4));
        let month = Number.parseInt(fileName.substr(4, 2)) - 1;
        let day = Number.parseInt(fileName.substr(6, 2));
        let hour = Number.parseInt(fileName.substr(8, 2));
        let minute = Number.parseInt(fileName.substr(10, 2));
        let second = Number.parseInt(fileName.substr(12, 2));
        return new Date(year, month, day, hour, minute, second);
    }

    private manageData(callbackSuccess: Function, data: any){
        if (data && data._body){
            let arr = JSON.parse(data._body);
            let ret = [];
            for (var i = 0; i < arr.length; i++){
                if (arr[i] != "questionnaires.json"){
                    let r: any = {};
                    r.fileName = arr[i];
                    r.date = this.fileNameToDate(arr[i]);
                    r.dateString = this.toolbox.formatDateToLocal(r.date, true);
                    ret.push(r);
                }
            }
            this.saveToLocal(ret);
            if (callbackSuccess){
                callbackSuccess(ret);
            }
        }else{
            if (callbackSuccess){
                callbackSuccess(data);
            }                
        }
    }

    private manageError(callbackFailure: Function, error: any){
        this.error = error;
        let raw = this.loadFromLocal();
        let data = this.toolbox.parseJson(raw);
        if (!data){
            data = [];
        }
        if (callbackFailure){
            callbackFailure(data);
        }
    }

    load (callbackSuccess: Function, callbackFailure: Function, fileName: string= ""){
        let url = this.configurationService.get().common.saveApiBaseUrl;
        let user = this.connexionService.getUser();
        let directory = user.email.toUpperCase();
        console.log("data url", url);
        let body = {"directory": directory, "fileName": fileName};
        this.http.post(url, body).subscribe(
            (data: any) => this.manageData(callbackSuccess, data),
            (error: any) => this.manageError(callbackFailure, error)
        );
    }

    load1 (callbackSuccess: Function, callbackFailure: Function, fileName: string){
        let url = this.configurationService.get().common.saveApiBaseUrl;
        let user = this.connexionService.getUser();
        let directory = user.email.toUpperCase();
        console.log("data url", url);
        let body = {"directory": directory, "fileName": fileName};
        this.http.post(url, body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    public getScore(questions: any){
        var score: any = {};
        if (questions){
            score.scoreOk = 0;
            score.scoreNok = 0;
            for (var i = 0; i< questions.length; i++){
                if (questions[i].checked){
                    if (questions[i].status){
                        score.scoreOk ++;
                    }else{
                        score.scoreNok ++;
                    }
                } 
            }
            score.pourcentage = Math.round(score.scoreOk / questions.length * 100);
            score.messagePourcentage = score.scoreOk + '/' + questions.length + ' (' + score.pourcentage + '%)';
            }
        return score;
    }

    save(callbackSuccess: Function, callbackFailure: Function, test: any){
        let url = this.configurationService.get().common.saveApiBaseUrl;
        let d = new Date();
        console.log("data url", url);
        test.fileName = this.toolbox.formatDate(d, "YYYYMMDDHHmmss") + "_test.json";
        let user = this.connexionService.getUser();
        let directory = user.email.toUpperCase();
        let body = {"directory": directory, "fileName": test.fileName, "content": JSON.stringify(test)};
        this.http.put(url, body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );

    } 

    public generate(data: any, randomQuestions: boolean, jeopardy: boolean = false, nbQuestion: number = -1){
        let currentQuestions  = [];
        for (var i=0; i < data.length; i++){
            if (data[i].test){
                for (var j = 0; j < data[i].questions.length; j++){
                    let q = this.toolbox.cloneObject(data[i].questions[j]);
                    q.questionnaireTitle = data[i].title;
                    currentQuestions.push(q);
                }
            }
        }
        if (randomQuestions){
            currentQuestions = this.toolbox.shuffleArray(currentQuestions);
            if (nbQuestion != -1){
                currentQuestions = currentQuestions.splice(0, nbQuestion);
            }
        }
        if (jeopardy){
            currentQuestions = this.generateJeopardy(currentQuestions);
        }
        return currentQuestions;
    }

    private generateJeopardy(questions: any){
        let res = [];
        if (questions){
            for (var i=0; i < questions.length; i++){
                if (questions[i].answers){
                    for (var j=0; j < questions[i].answers.length; j++){
                        let q = this.toolbox.cloneObject(questions[i]);
                        if (questions[i].answers[j].answer){
                            q.question = questions[i].answers[j].answer;
                            q.answers = [];
                            let a = this.questionnaireService.newAnswer();
                            a.answer = questions[i].question;
                            q.answers.push(a);
                            res.push(q);
                        }
                    }
                }
            }
        }
        return res;
    }        
}
