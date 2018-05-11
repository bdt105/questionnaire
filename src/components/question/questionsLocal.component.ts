import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';
import { QuestionsComponent } from '@appSharedComponents/questions.component';

@Component({
    selector: 'questionsLocal',
    templateUrl: './questionsLocal.component.html',
    providers: []
})

export class QuestionsLocalComponent extends QuestionsComponent {


    constructor(public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
            super(questionnaireService, miscellaneousService);
    }

    ngOnInit(){
    }
    
}