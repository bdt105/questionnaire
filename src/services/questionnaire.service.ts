import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuestionnaireService {

    private toolbox: Toolbox = new Toolbox(); 
    public storageKey = "data";
    public error: any;

    constructor (private configurationService: ConfigurationService, private http: Http){
    }

    load(callbackSuccess: Function, callbackFailure: Function, name: string){
        let url = this.configurationService.get().common.saveApiBaseUrl;
        console.log("data url", url);
        let body = {"directory": name, "fileName": "questionnaires.json"};
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
            ]
        };
        if (!data){
            data = [];
        }
        data.push(q);
        return q;
    }

    newQuestion(questionnaire: any = null){
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
            "point": 1
        };
        if (questionnaire){
            if (!questionnaire.questions){
                questionnaire.questions = [];
            }
            questionnaire.questions.push(q);
        }
        return q;
    }

    newAnswer(question: any = null){
        let id = this.toolbox.getUniqueId();
        let a =  {
            "id": (question ? question.id + "_" : "") + id,
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

    save(callbackSuccess: Function, callbackFailure: Function, data: any, name: string){
        this.saveToLocal(data);
        let url = this.configurationService.get().common.saveApiBaseUrl;
        console.log("data url", url);
        let body = {"directory": name, "fileName": "questionnaires.json", "content": JSON.stringify(data)};
        this.http.put(url, body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    loadFromLocal(parseJson: boolean = false){
        return this.toolbox.readFromStorage(this.storageKey, parseJson);
    }

    importQuestions(questionnaire: any, questionsToImport: string){
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
                if (answer == question.answers[i].answer){
                    question.status = true;
                    break;
                }
            }
        }
        question.checked = true;
    }

}