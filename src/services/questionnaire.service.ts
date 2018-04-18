import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuestionnaireService {

    private toolbox: Toolbox = new Toolbox(); 
    private storageKey = "data";
    public data: any;
    public error: any;

    constructor (private configurationService: ConfigurationService, private http: Http){
    }

    load(callbackSuccess: Function, callbackFailure: Function){
        let dataUrl = this.configurationService.get().common.dataUrl;
        this.http.get(dataUrl).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    get(){
        return this.data;
    }

    newQuestionnaire(title: string){
        let id = this.toolbox.uniqueId();
        let q = {
            "id": id,
            "title": title,
            "questions":
            [
            ]
        };
    
        return q;
    }

    newQuestion(questionnaire: any){
        let id = this.toolbox.uniqueId();
        let q = {
            "id": id,
            "questionLabel": "",
            "answerLabelOk": "",
            "answerLabelNok": "",
            "question": "",
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

    newAnswer(question: any){
        let id = this.toolbox.uniqueId();
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

    deleteAnswer(question: any, answer: any){

    }

}