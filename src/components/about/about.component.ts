import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    providers: [MenuService]
})

export class AboutComponent extends GenericComponent{

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService,
        public menuService: MenuService){
        super(configurationService, translateService);
    }


    ngOnInit(){
        
    }

    getApplicationTitle(){
        let menu = this.menuService.getMenu();
        if (menu){
            return menu.title;
        }
        return null;
    }

}