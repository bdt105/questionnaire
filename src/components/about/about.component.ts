import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';

import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

import {} from '@'

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    providers: []
})

export class AboutComponent extends GenericComponent{

    constructor(public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);    
    }


    ngOnInit(){
        
    }

    getApplicationTitle(){
        let menu = this.miscellaneousService.configuration().common.applic
        if (menu){
            return menu.title;
        }
        return null;
    }

}