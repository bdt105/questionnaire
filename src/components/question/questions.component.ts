import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'questions',
    templateUrl: './questions.component.html',
    providers: []
})

export class QuestionsComponent extends GenericComponent {

    private toolbox: Toolbox = new Toolbox();
    public showResults = false;
    private __favoriteOnly: boolean = false;
    private __questions: any;
    private __questionsFiltered: any;

    @Input() set favoriteOnly(value: boolean){
        this.__favoriteOnly = value;
        if (this.__favoriteOnly){
            this.__questionsFiltered = this.toolbox.filterArrayOfObjects(this.__questions, "favorite", true);        
        }else{
            this.__questionsFiltered = this.__questions;        
        }
    }

    @Input() questionnaire: any;
    @Input() editable: boolean = true;
    @Input() group: boolean = false;

    @Input() set questions(value: any){
        this.__questions = value;
        this.__questionsFiltered = this.__questions;        
    }

    get questions():any{
        return this.__questionsFiltered;
    }

    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
    }

    changed(){
        // // To trigger a refresh of the pipe
        // let questions  = this.toolbox.cloneObject(this.__questions);
        // this.questions = null;
        // this.questions = questions;
        // // this.__questions = questions;

        this.change.emit(this.questions);
    }
    
}