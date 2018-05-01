import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';

export class QuestionComponent extends GenericComponent {

    public toolbox: Toolbox = new Toolbox();
    public showResults = false;
    public bsModalRef: BsModalRef;

    @Input() question: any;
    @Input() questionnaire: any;
    @Input() editable: boolean = true;
    @Input() showAnswers: boolean = false;
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configurationService: ConfigurationService, public modalService: BsModalService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, public http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
    }

    canEdit(){
        return this.question.edit && this.editable;
    }

    toggleEdit(){
        this.question.edit = !this.question.edit;
        this.question.showAnswers = this.question.edit;
    }

    newAnswer(question: any){
        this.question.showAnswers = true;      
        this.question.edit = true;      
        this.questionnaireService.newAnswer(question);  
    }

    deleteAnswer(question: any, answer: any){
        this.questionnaireService.deleteAnswer(question, answer);
        this.changed();
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

    deleteQuestion(questionnaire: any, question: any){
        this.questionnaireService.deleteQuestion(questionnaire, question);
        this.changed();        
    }

    changed(){
        this.change.emit(this.question);
    }

    newQuestion(questionnaire: any, insertAfterQuestion: any = null){
        this.questionnaireService.newQuestion(questionnaire, insertAfterQuestion);
    }    

    setFavorite(question: any, favorite: boolean){
        if (question){
            question.favorite = favorite;
            this.change.emit(this.question);
        }
    }
    
}