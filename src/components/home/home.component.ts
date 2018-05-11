import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericComponent } from '@sharedComponents/generic.component';
import { MiscellaneousService } from '@sharedServices/miscellaneous.service';

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