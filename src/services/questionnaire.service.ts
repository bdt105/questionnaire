import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
import { ConfigurationService } from './configuration.service';
import { ConnexionService } from './connexion.service';

@Injectable()
export class QuestionnaireService {

    private toolbox: Toolbox = new Toolbox(); 
    public storageKey = "data";
    public error: any;

    constructor (private configurationService: ConfigurationService, private connexionService: ConnexionService, private http: Http){
    }

    load(callbackSuccess: Function, callbackFailure: Function){
        let url = this.configurationService.get().common.saveApiBaseUrl;
        let user = this.connexionService.getUser();
        let directory = user.email.toUpperCase();
        console.log("data url", url);
        let body = {"directory": directory, "fileName": "questionnaires.json"};
        this.http.post(url, body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    newQuestionnaire(data: any){
        let id = this.toolbox.getUniqueId();
        let q = {
            "id": id,
            "title": "",
            "questions":
            [
            ],
            "edit": true,
            "showQuestions": true
        };
        if (!data){
            data = [];
        }
        data.push(q);
        return q;
    }

    getQuestionIndex(questionnaire: any, question: any){
        if (questionnaire){
            for (var i = 0; i< questionnaire.questions.length; i++){
                if (question.id == questionnaire.questions[i].id){
                    return i;
                }
            }
        }
        return -1;
    }

    newQuestion(questionnaire: any = null, insertAfterQuestion: any = null){
        let id = this.toolbox.getUniqueId();
        let q = {
            "id": (questionnaire ? questionnaire.id + "_" : "") + id,
            "questionLabel": "",
            "answerLabelOk": "",
            "answerLabelNok": "",
            "question": "",
            "detail": "",
            "answers":
            [
            ],
            "point": 1,
            "edit": true,
            "showAnswers": true
        };
        let a = this.newAnswer(q);
        if (questionnaire){
            if (!questionnaire.questions){
                questionnaire.questions = [];
            }
            if (!insertAfterQuestion){
                questionnaire.questions.push(q);
            }else{
                let index = this.getQuestionIndex(questionnaire, insertAfterQuestion);
                if (index >= 0){
                    questionnaire.questions.splice(index + 1, 0, q);
                }
            }
        }
        return q;
    }

    newAnswer(question: any = null){
        let id = this.toolbox.getUniqueId();
        let a =  {
            "id": id,
            "answer": "",
            "correctDistance": 0,
            "point": 1
        };
        if (question){
            if (!question.answers){
                question.answers = [];
            }
            question.answers.push(a);
        }
        return a;
    }

    deleteQuestion(questionnaire: any, question: any){
        if (questionnaire.questions){
            for (var i=0; i < questionnaire.questions.length; i++){
                if (questionnaire.questions[i].id == question.id){
                    questionnaire.questions.splice(i, 1);
                }
            }
        }
    }

    deleteQuestionnaire(data: any, questionnaire: any){
        if (data && data.length > 0){
            for (var i=0; i < data.length; i++){
                if (data[i].id == questionnaire.id){
                    data.splice(i, 1);
                }
            }
        }
    }

    deleteAnswer(question: any, answer: any){
        if (question.answers){
            for (var i=0; i < question.answers.length; i++){
                if (question.answers[i].id == answer.id){
                    question.answers.splice(i, 1);
                }
            }
        }
    }

    saveToLocal(data: any){
        this.toolbox.writeToStorage(this.storageKey, data, true);
    }

    clearEditShow(data: any){
        for (var i=0 ; i< data.length; i++){
            delete(data[i].edit);
            delete(data[i].showQuestions);
            if (data[i].questions){
                for (var j=0; j< data[i].questions.length;j++){
                    delete(data[i].questions[j].edit);
                    delete(data[i].questions[j].showAnswers);
                }
            }
        }
    }

    clearImports(data: any){
        for (var i=0 ; i< data.length; i++){
            delete(data[i].qestionsToImport);
        }
    }
    
    save(callbackSuccess: Function, callbackFailure: Function, data: any){
        this.clearImports(data);
        this.saveToLocal(data);
        let url = this.configurationService.get().common.saveApiBaseUrl;
        console.log("data url", url);
        let user = this.connexionService.getUser();
        let directory = user.email.toUpperCase();
        let body = {"directory": directory, "fileName": "questionnaires.json", "content": JSON.stringify(data)};
        this.http.put(url, body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    loadFromLocal(parseJson: boolean = false){
        return this.toolbox.readFromStorage(this.storageKey, parseJson);
    }

    removeFromLocal(){
        this.toolbox.removeFromStorage(this.storageKey);
    }

    importQuestionsCsv(questionnaire: any, questionsToImport: string){
        // Format questionLabel|answerLabelOk|answerLabelNok|detail|question1|answer1|answer2|answerN|..|
        if (questionsToImport && questionsToImport.length > 0){
            let lines = questionsToImport.split("\n");
            for (var l = 0 ; l < lines.length ; l++){
                var qs = lines[l].split("|");
                let q = this.newQuestion();
                q.questionLabel = qs[0];
                q.answerLabelOk = qs[1];
                q.answerLabelNok = qs[2];
                q.detail = qs[3];
                q.question = qs[4];
                for (var i = 5; i < qs.length; i++){
                    if (qs[i]){
                        let a = this.newAnswer();
                        a.answer = qs[i];
                        q.answers.push(a);
                    }
                }
                questionnaire.questions.push(q);
            }
        }
    }

    checkQuestion(question: any, answer: string){
        question.status = false;
        for (var i=0; i < question.answers.length; i++){
            if (!question.correctDistance || question.correctDistance == 0){
                if (answer){
                    if (answer == question.answers[i].answer || answer.toUpperCase() == question.answers[i].answer.toUpperCase()){
                        question.status = true;
                        break;
                    }
                }else{
                    if (answer == question.answers[i].answer){
                        question.status = true;
                        break;
                    }                    
                }
            }
        }
        question.checked = true;
    }

    public getScore(questions: any){
        var score: any = {};
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
        return score;
    }
    

    importQuestionnaires(data: any, questionnaires: string){
        let temp = this.toolbox.cloneObject(data);
        if (!temp){
            temp = [];
        }
        if (questionnaires){
            if (this.toolbox.isJson(questionnaires)){
                let ques = this.toolbox.parseJson(questionnaires);
                this.setIds(ques);
                let data2 = temp.concat(ques);
                return data2;
            }
        }
        return temp;
    }

    setIds(data: any){
        if (data){
            for (var i = 0 ; i< data.length; i++){
                data[i].id = this.toolbox.getUniqueId();
                if (data[i].questions){
                    for (var j=0; j< data[i].questions.length;j++){
                        data[i].questions[j].id = this.toolbox.getUniqueId();
                        if (data[i].questions[j].answers){
                            for (var k = 0; k < data[i].questions[j].answers.length; k++){
                                data[i].questions[j].answers[k].id = this.toolbox.getUniqueId();
                            }
                        }
                    }
                }
            }   
        }
    }

    searchInQuestionsAndAnswers(data: any, search: string){
        let ret = [];
        if (data && search){
            for (var i = 0 ; i< data.length; i++){
                if (data[i].questions){
                    for (var j=0; j< data[i].questions.length;j++){
                        if (data[i].questions[j].question && data[i].questions[j].question.toUpperCase().includes(search.toUpperCase())){
                            let q = this.toolbox.cloneObject(data[i].questions[j]);
                            q.foundType = "question";
                            q.questionnaireTitle = data[i].title;
                            ret.push(q);                        }
                        if (data[i].questions[j].questionLabel && data[i].questions[j].questionLabel.toUpperCase().includes(search.toUpperCase())){
                            let q = this.toolbox.cloneObject(data[i].questions[j]);
                            q.questionnaireTitle = data[i].title;
                            q.foundType = "questionLabel";
                            ret.push(q);
                        }
                        if (data[i].questions[j].answers){
                            for (var k = 0; k < data[i].questions[j].answers.length; k++){
                                if (data[i].questions[j].question && data[i].questions[j].answers[k].answer.toUpperCase().includes(search.toUpperCase())){
                                    let q = this.toolbox.cloneObject(data[i].questions[j]);
                                    q.questionnaireTitle = data[i].title;
                                    q.foundType = "answer";
                                    ret.push(q);
                                }
                            }
                        }
                    }
                }
            }   
        }   
        return ret;
    }

    updateQuestion(data: any, question: any){
        if (data && question && question.id){
            for (var i = 0 ; i < data.length; i++){
                if (data[i].questions){
                    for (var j=0; j< data[i].questions.length;j++){
                        if (data[i].questions[j].id == question.id){
                            data[i].questions.splice(j, 1, question);
                            return;
                        }
                    }
                }
            }
        }
    }
}