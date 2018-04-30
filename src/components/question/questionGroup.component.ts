import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { QuestionComponent } from './question.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationComponent } from '../standard/confirmation.component';

@Component({
    selector: 'questionGroup',
    templateUrl: './questionGroup.component.html',
    providers: []
})

export class QuestionGroupComponent extends QuestionComponent {

    constructor(public configurationService: ConfigurationService, public modalService: BsModalService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, public http: Http){

        super(configurationService, modalService, translateService, questionnaireService, menuService, http);
    }

    ngOnInit(){
    }

}