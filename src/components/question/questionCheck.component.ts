import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { QuestionnaireService } from '../../services/questionnaire.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'questionCheck',
    templateUrl: './questionCheck.component.html',
    providers: []
})

export class QuestionCheckComponent extends GenericComponent {

    public showResults = false;

    @Input() question: any;
    // @Output() goTo: EventEmitter<string> = new EventEmitter<string>();

    constructor(public questionnaireService: QuestionnaireService,
        public miscellaneousService: MiscellaneousService){
            super(miscellaneousService);
    }

    ngOnInit(){
    }

}