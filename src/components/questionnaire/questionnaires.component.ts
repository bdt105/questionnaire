import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'questionnaires',
    templateUrl: './questionnaires.component.html',
    providers: []
})

export class QuestionnairesComponent extends GenericComponent {


    private toolbox: Toolbox = new Toolbox();
    private rest: Rest = new Rest();

    public data: any;
    public error: any;

    public importQuestionnaires = false;
    public exportQuestionnaires = false;

    public questionnairesToImport: string;
    public questionnairesToExport: string;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
        this.load();
    }

    private successLoad(data: any){
        if (data && data._body){
            this.data = this.toolbox.parseJson(data._body);
            this.questionnaireService.clearEditShow(this.data);
        }else{
            this.data = [];
        }
        this.questionnaireService.saveToLocal(this.data);
        console.log("success load", this.data);
    }

    private failureLoad(error: any){
        this.error = error;
        let raw = this.questionnaireService.loadFromLocal();
        this.data = this.toolbox.parseJson(raw);
        if (!this.data){
            this.data = [];
        }
        console.log("failure load", this.data);
    }

    load(){        
        this.questionnaireService.load(
            (data: any) => this.successLoad(data), (error: any) => this.failureLoad(error));
    }

    newQuestion(questionnaire: any){
        this.questionnaireService.newQuestion(questionnaire);
    }

    newQuestionnaire(){
        if (!this.data || this.data == "undefined"){
            this.data = [];
        }
        this.questionnaireService.newQuestionnaire(this.data);
    }

    deleteQuestionnaire(questionnaire: any){
        this.questionnaireService.deleteQuestionnaire(this.data, questionnaire);        
    }

    private successSave(data: any){
        console.log("success save", data);
    }

    private failureSave(error: any){
        console.log("failure save", error);
    }

    save(){
        this.questionnaireService.save(
            (data: any) => this.successSave(data), 
            (error: any) => this.failureSave(error), this.data);
    }

    importQuestionsCsv(questionnaire: any, importQuestions: string){
        this.questionnaireService.importQuestionsCsv(questionnaire, importQuestions);
        this.save();
    }

    importQuestionnairesJson(questionnaires: string){
        let res = this.questionnaireService.importQuestionnaires(this.data, this.questionnairesToImport);
        this.data = res;
        this.save();
    } 

    exportQuestionnairesJson(questionnaires: string){
        this.questionnairesToExport = this.toolbox.beautifyJson(JSON.stringify(this.data));
    }
}