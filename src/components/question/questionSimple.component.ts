import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '@appSharedServices/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';
import { QuestionLocalComponent } from '@components/question/questionLocal.component';

@Component({
    selector: 'questionSimple',
    templateUrl: './questionSimple.component.html',
    providers: []
})

export class QuestionSimpleComponent extends QuestionLocalComponent {

    constructor(public modalService: BsModalService, 
        public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){

        super(modalService, questionnaireService, miscellaneousService);
    }

    ngOnInit(){
    }

    
}