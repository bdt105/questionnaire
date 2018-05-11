import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

@Component({
    selector: 'questionnaire',
    templateUrl: './questionnaire.component.html',
    providers: []
})

export class QuestionnaireComponent extends GenericComponent {

    public bsModalRef: BsModalRef;

    public error: any;

    public __questionnaire: any;
    private __id: any;
    private __searchTerm: string;

    public showSearch = false;

    @Input() questionnaires: any;
    @Input() showQuestions: boolean;

    @Input() set questionnaire(value: any){
        this.__questionnaire = value;
        if(this.__questionnaire){
            this.__id = this.__questionnaire.id;
        }
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

    constructor(private modalService: BsModalService, public router: Router,
        public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
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
        if (this.questionnaireService.isQuestionnaireEmpty(this.__questionnaire)){
            this.delete(this.__questionnaire);
        }else{
            this.bsModalRef = this.modalService.show(ConfirmationComponent);
            this.bsModalRef.content.modalRef = this.bsModalRef;
            this.bsModalRef.content.title = this.translate("Deleting a questionnaire");
            this.bsModalRef.content.message = this.translate("Are you sure you want to delete " + this.questionnaire.type + " '" + 
                (this.questionnaire.title ? this.questionnaire.title : this.questionnaire.defaultTitle) + "'");
            this.bsModalRef.content.button1Label = this.translate("Yes");
            this.bsModalRef.content.button2Label = this.translate("No");
            this.bsModalRef.content.button1Click.subscribe(result => {
                this.delete(this.__questionnaire);
            });
        }
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
        this.showQuestions = true;
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

    // importQuestionsCsv(questionnaire: any, importQuestions: string){
    //     this.questionnaireService.importQuestionsCsv(questionnaire, importQuestions);
    //     this.save();
    // }

    importQuestion(){
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Importing a question");
        this.bsModalRef.content.readOnly = false;
        this.bsModalRef.content.bodyMessage = this.translate("Paste json format below and import");
        this.bsModalRef.content.button2Label = this.translate("Cancel");
        this.bsModalRef.content.button1Label = this.translate("Import");
        this.bsModalRef.content.button1Click.subscribe(result => {
            let json = this.bsModalRef.content.message;
            this.questionnaireService.importQuestion(json, this.questionnaire, 0);
        })
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

    seeSeparatly(){
        this.router.navigate(["/questionnaire/" + this.__questionnaire.id]);
    }

    toggleGroup(){
        this.__questionnaire.showGroup = !this.__questionnaire.showGroup;
        this.save();
    }

    toggleFavorite(){
        this.__questionnaire.favoriteQuestions = !this.__questionnaire.favoriteQuestions;
        this.save();
    }
    
}