import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { QuestionnaireService } from '../../services/questionnaire.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'questions',
    templateUrl: './questions.component.html',
    providers: []
})

export class QuestionsComponent extends GenericComponent {

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

    constructor(public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
            super(miscellaneousService);
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