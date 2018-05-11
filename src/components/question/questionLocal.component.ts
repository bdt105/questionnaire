import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';
import { QuestionComponent } from '@appSharedComponents/question.component';

export class QuestionLocalComponent extends QuestionComponent {

    public bsModalRef: BsModalRef;

    constructor(public modalService: BsModalService, 
        public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
        super(questionnaireService, miscellaneousService);
    }

    ngOnInit(){
    }

    deleteWithConfirmationQuestion(question: any) {
        if (this.questionnaireService.isQuestionEmpty(question)){
            this.deleteQuestion(this.questionnaire, question);
        }else{
            this.bsModalRef = this.modalService.show(ConfirmationComponent);
            this.bsModalRef.content.modalRef = this.bsModalRef;
            this.bsModalRef.content.title = this.translate("Deleting a questionnaire");
            this.bsModalRef.content.message = this.translate("Are you sure you want to delete question '" + question.question + "'");
            this.bsModalRef.content.button1Label = this.translate("Yes");
            this.bsModalRef.content.button2Label = this.translate("No");        
            this.bsModalRef.content.button1Click.subscribe(result => {
                this.deleteQuestion(this.questionnaire, question);
            })
        }
    }    

    deleteWithConfirmationAnswer(answer: any) {
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Deleting a answer");
        this.bsModalRef.content.message = this.translate("Are you sure you want to delete answer '" + answer.answer + "'");
        this.bsModalRef.content.button1Label = this.translate("Yes");
        this.bsModalRef.content.button2Label = this.translate("No");
        this.bsModalRef.content.button1Click.subscribe(result => {
            this.deleteAnswer(this.question, answer);
        })
    }    

    export(){
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Exporting a questionnaire");
        this.bsModalRef.content.readOnly = false;
        this.bsModalRef.content.bodyMessage = this.translate("Copy the content below");;
        
        this.bsModalRef.content.message = JSON.stringify(this.question);
    }


}