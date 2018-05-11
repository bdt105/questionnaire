import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

@Component({
    selector: 'questionCheck',
    templateUrl: './questionCheck.component.html',
    providers: []
})

export class QuestionCheckComponent extends GenericComponent {

    public showResults = false;

    @Input() question: any;

    constructor(public questionnaireService: QuestionnaireService,
        public miscellaneousService: MiscellaneousService){
            super(miscellaneousService);
    }

    ngOnInit(){
    }

}