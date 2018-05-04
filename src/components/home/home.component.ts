import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';

import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

declare const gapi : any;

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [MenuService]
})

export class HomeComponent extends GenericComponent{

    constructor(public configurationService: ConfigurationService, 
        public translateService: TranslateService,
        public menuService: MenuService){
        super(configurationService, translateService);
    }

    ngOnInit(){
        gapi.load('auth2', function () {
            gapi.auth2.init()
        });
    }

    getApplicationTitle(){
        let menu = this.menuService.getMenu();
        if (menu){
            return menu.title;
        }
        return null;
    }


    googleLogin() {
        let googleAuth = gapi.auth2.getAuthInstance();
        googleAuth.then(() => {
           googleAuth.signIn({scope: 'profile email'}).then(googleUser => {
              console.log(googleUser.getBasicProfile());
           });
        });
     }
}