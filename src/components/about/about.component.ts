import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    providers: []
})

export class AboutComponent extends GenericComponent{

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService){
        super(configurationService, translateService);
    }


    ngOnInit(){
        
    }


}