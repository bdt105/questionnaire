import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { MiscellaneousService } from '../../services/miscellaneous.service';

declare const gapi : any;

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: []
})

export class HomeComponent extends GenericComponent{

    constructor(public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
    }

    ngOnInit(){
        gapi.load('auth2', function () {
            gapi.auth2.init()
        });
    }

    getApplicationTitle(){
        let menu = this.miscellaneousService.configuration().common.applicationName;
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