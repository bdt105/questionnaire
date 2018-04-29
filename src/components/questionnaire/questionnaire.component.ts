import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { ConfirmationComponent } from '../standard/confirmation.component';

@Component({
    selector: 'questionnaire',
    templateUrl: './questionnaire.component.html',
    providers: []
})

export class QuestionnaireComponent extends GenericComponent {

    public bsModalRef: BsModalRef;

    private toolbox: Toolbox = new Toolbox();

    public error: any;

    private __questionnaire: any;
    private __id: any;

    @Input() questionnaires: any;

    @Input() set questionnaire(value: any){
        this.__questionnaire = value;
        this.__id = this.__questionnaire.id;
    };

    @Input() set id(value: string){
        this.__id = value;
    };

    get questionnaire(): any{
        return this.__questionnaire;
    };    

    get id(): string{
        return this.__id;
    };    

    @Output() deleted: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configurationService: ConfigurationService, private modalService: BsModalService,
        public translateService: TranslateService, public questionnaireService: QuestionnaireService, private http: Http){
        super(configurationService, translateService);
    }

    private getFileName(){
        if (this.__questionnaire){
            return this.__questionnaire.id + ".json";
        }else{
            return null;
        }
    }

    ngOnInit(){
    }

    deleteWithConfirmation() {
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Deleting a questionnaire");
        this.bsModalRef.content.message = this.translate("Are you sure you want to delete questionnaire '" + 
            (this.questionnaire.title ? this.questionnaire.title : this.questionnaire.defaultTitle) + "'");
        this.bsModalRef.content.button1Label = this.translate("Yes");
        this.bsModalRef.content.button2Label = this.translate("No");
        this.bsModalRef.content.button1Click.subscribe(result => {
            this.delete(this.__questionnaire);
        })
    }
        
    private successLoad(data: any){
        if (data && data._body){
            this.__questionnaire = this.toolbox.parseJson(data._body);
            this.questionnaireService.cleanQuestionnaire(this.__questionnaire);
        }else{
            this.__questionnaire = [];
        }
    }

    private failureLoad(error: any){
        this.error = error;
    }

    load(id: string){
        let fileName = id + ".json";
        this.questionnaireService.loadQuestionnaire(
            (data: any) => this.successLoad(data), 
            (error: any) => this.failureLoad(error), id);
    }

    newQuestion(questionnaire: any){
        this.questionnaireService.newQuestion(questionnaire);
        this.questionnaire.showQuestions = true;
    }

    private successSave(data: any){
        console.log("success save", data);
    }

    private failureSave(error: any){
        console.log("failure save", error);
    }

    save(){
        this.questionnaireService.saveQuestionnaire(
            (data: any) => this.successSave(data), 
            (error: any) => this.failureSave(error), this.__questionnaire);
    }

    importQuestionsCsv(questionnaire: any, importQuestions: string){
        this.questionnaireService.importQuestionsCsv(questionnaire, importQuestions);
        this.save();
    }

    edit(questionnaire: any){
        questionnaire.edit = !questionnaire.edit;
        //questionnaire.showQuestions = questionnaire.edit;
    }

    delete(questionnaire: any){
        this.questionnaireService.deleteQuestionnaire(this.questionnaires, questionnaire);  
        this.deleted.emit(questionnaire); 
    }    

    export(){
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Exporting a questionnaire");
        this.bsModalRef.content.readOnly = false;
        this.bsModalRef.content.bodyMessage = this.translate("Copy the content below");;
        
        this.bsModalRef.content.message = JSON.stringify(this.questionnaire);
    }
}