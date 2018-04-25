import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Toolbox } from 'bdt105toolbox/dist';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    providers: []
})

export class SearchComponent extends GenericComponent{

    private toolbox: Toolbox = new Toolbox();
    private search: string;
    
    public data: any;
    public dataSearch: any;
    public error: any;

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, private activatedRoute: ActivatedRoute, public questionnaireService: QuestionnaireService){
        super(configurationService, translateService);
    }


    ngOnInit(){
        this.activatedRoute.params.subscribe(params => {
            this.getParams();
        });       
    }

    private successLoad(data: any){
        if (data && data._body){
            this.data = this.toolbox.parseJson(data._body);
            this.questionnaireService.cleanQuestionnaires(this.data);
            this.dataSearch = this.questionnaireService.searchInQuestionsAndAnswers(this.data, this.search);
        }else{
            this.data = [];
        }
        console.log("success load", this.data);
    }

    private failureLoad(error: any){
        this.error = error;
        let raw = this.questionnaireService.loadFromLocal();
        this.data = this.toolbox.parseJson(raw);
        if (!this.data){
            this.data = [];
        }
        this.dataSearch = this.questionnaireService.searchInQuestionsAndAnswers(this.data, this.search);
        console.log("failure load", this.data);
    }

    getParams (){
        if (this.activatedRoute.snapshot.params["search"]){
            this.search = this.activatedRoute.snapshot.params["search"];
            this.load();
        }
    }

    load(){        
        this.questionnaireService.load(
            (data: any) => this.successLoad(data), (error: any) => this.failureLoad(error));
    }    

    updateQuestion(question: any){
        if (question){
            this.questionnaireService.updateQuestion(this.data, question);
            let fake = (data: any)=>{

            }
            this.questionnaireService.save(fake, fake, this.data);
        }
    }
}