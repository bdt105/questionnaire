import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { Toolbox } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'questionnaires',
    templateUrl: './questionnaires.component.html',
    providers: []
})

export class QuestionnairesComponent extends GenericComponent {

    public bsModalRef: BsModalRef;

    public questionnaires: any;
    public error: any;

    public importQuestionnaires = false;
    public exportQuestionnaires = false;
    public overWriteImport = false;

    public questionnairesToImport: string;
    public questionnairesToExport: string;

    public filterType: string;
    public showDisabled: boolean;

    public sortKey: string ="title";

    constructor(private modalService: BsModalService, 
        public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
            super(miscellaneousService);
    }

    ngOnInit(){
        this.filterType = "questionnaire";
        this.showDisabled = false;   
        this.load();
    }

    private successLoad(data: any){
        this.questionnaires = data;
    }

    private failureLoad(error: any){
        this.error = error;
    }

    load(){  
        this.questionnaireService.loadQuestionnaires(
            (data: any) => this.successLoad(data), 
            (error: any) => this.failureLoad(error), this.filterType, this.showDisabled);
    }

    newQuestionnaire(){
        let q = this.questionnaireService.newQuestionnaire("questionnaire");
        if (!this.questionnaires){
            this.questionnaires = [];
        }
        this.questionnaires.push(q);
    }

    import(){
        this.bsModalRef = this.modalService.show(ConfirmationComponent);
        this.bsModalRef.content.modalRef = this.bsModalRef;
        this.bsModalRef.content.title = this.translate("Importing a questionnaire");
        this.bsModalRef.content.readOnly = false;
        this.bsModalRef.content.bodyMessage = this.translate("Paste json format below and import");
        this.bsModalRef.content.button2Label = this.translate("Cancel");
        this.bsModalRef.content.button1Label = this.translate("Import");
        this.bsModalRef.content.button1Click.subscribe(result => {
            let json = this.bsModalRef.content.message;
            if (this.toolbox.isJson(json)){
                let questionnaire = JSON.parse(json);
                let date = this.toolbox.dateToDbString(new Date());
                questionnaire.creationDate = date;
                questionnaire.modificationDate = date;
                questionnaire.type = "questionnaire";
                if (!questionnaire.title){
                    questionnaire.title = this.translate('Import') + " " + date;
                }
                this.questionnaires = this.questionnaireService.importQuestionnaire(questionnaire, this.questionnaires);
            }
        })
    }

    filter(type: string = null, showDisabled: boolean = null){
        this.filterType = type;
        this.showDisabled = (showDisabled == null ? true : showDisabled);
        this.load();
    }

}