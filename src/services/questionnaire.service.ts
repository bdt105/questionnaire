import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class QuestionnaireService {

    private toolbox: Toolbox = new Toolbox(); 
    public storageKey = "data";
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

    deleteAnswer(question: any, answer: any){
        if (question.answers){
            for (var i=0; i < question.answers.length; i++){
                if (question.answers[i].id == answer.id){
                    question.answers.splice(i, 1);
                }
            }
        }
    }

    save(data: any){
        this.toolbox.writeToStorage(this.storageKey, this.data, true);
    }

    importQuestions(questionnaire: any, questionsToImport: string){
        // Format questionLabel|answerLabelOk|answerLabelNok|question1|answer1|answer2|answerN|..|
        if (questionsToImport && questionsToImport.length > 0){
            let lines = questionsToImport.split("\n");
            for (var l = 0 ; l < lines.length ; l++){
                var qs = lines[l].split("|");
                let q = this.newQuestion();
                q.questionLabel = qs[0];
                q.answerLabelOk = qs[1];
                q.answerLabelNok = qs[2];
                q.question = qs[3];
                for (var i = 4; i < qs.length; i++){
                    let a = this.newAnswer();
                    a.answer = qs[i];
                    q.answers.push(a);
                }
                questionnaire.questions.push(q);
            }
        }
    }

}