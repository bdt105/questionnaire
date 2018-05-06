import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { QuestionComponent } from './question.component';

import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';
import { MiscellaneousService } from '../../services/miscellaneous.service';

@Component({
    selector: 'questionEdit',
    templateUrl: './questionEdit.component.html',
    providers: []
})

export class QuestionEditComponent extends QuestionComponent {

    constructor(public modalService: BsModalService, 
        public questionnaireService: QuestionnaireService,
        public miscellaneousService: MiscellaneousService){
            super(modalService, questionnaireService, miscellaneousService);

    }

    ngOnInit(){
    }

}