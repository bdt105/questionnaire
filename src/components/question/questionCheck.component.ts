import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

import { Http } from '@angular/http';

import { Toolbox, Rest } from 'bdt105toolbox/dist';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
    selector: 'questionCheck',
    templateUrl: './questionCheck.component.html',
    providers: []
})

export class QuestionCheckComponent extends GenericComponent {

    private toolbox: Toolbox = new Toolbox();
    public showResults = false;

    @Input() question: any;
    // @Output() goTo: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService, public questionnaireService: QuestionnaireService,
        public menuService: MenuService, private http: Http){
        super(configurationService, translateService);
    }

    ngOnInit(){
    }

}