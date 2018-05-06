import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { ActivatedRoute } from '@angular/router';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'questionnaireOne',
    templateUrl: './questionnaireOne.component.html',
    providers: []
})

export class QuestionnaireOneComponent extends GenericComponent {

    public __questionnaire: any;
    private __id: any;

    public error: any;

    @Input() set questionnaire(value: any){
        this.__questionnaire = value;
        this.__id = this.__questionnaire.id;
    };

    private id: string;

    constructor(public configurationService: ConfigurationService, public modalService: BsModalService, 
        private activatedRoute: ActivatedRoute, public questionnaireService: QuestionnaireService,
        public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
      
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe(params => {
            this.getParams();
        });
    }

    getParams (){
        if (this.activatedRoute.snapshot.params["id"]){
            this.id = this.activatedRoute.snapshot.params["id"];
            this.load(this.id);
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

    public load(id: string){
        let fileName = id + ".json";
        this.questionnaireService.loadQuestionnaire(
            (data: any) => this.successLoad(data), 
            (error: any) => this.failureLoad(error), id);
    }
    
    
}