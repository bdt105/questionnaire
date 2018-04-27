import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';

@Component({
    selector: 'questionnaires',
    templateUrl: './questionnaires.component.html',
    providers: []
})

export class QuestionnairesComponent extends GenericComponent {

    private toolbox: Toolbox = new Toolbox();

    public bsModalRef: BsModalRef;

    public questionnaires: any;
    public error: any;

    public importQuestionnaires = false;
    public exportQuestionnaires = false;
    public overWriteImport = false;

    public questionnairesToImport: string;
    public questionnairesToExport: string;

    constructor(public configurationService: ConfigurationService, private modalService: BsModalService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
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
            (error: any) => this.failureLoad(error));
    }

    newQuestion(questionnaire: any){
        this.questionnaireService.newQuestion(questionnaire);
    }

    newQuestionnaire(){
        let q = this.questionnaireService.newQuestionnaire();
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
                this.questionnaires = this.questionnaireService.importQuestionnaire(questionnaire, this.questionnaires);
            }
        })
    }


}