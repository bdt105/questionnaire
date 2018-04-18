import { Component } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { ConnexionService } from '../services/connexion.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public sidebarOpened = false;

    constructor(private translateService: TranslateService, private connexionService: ConnexionService){

    }
    
    title = 'app';
    
    public toggleSidebar(event: any) {
		this.sidebarOpened = !this.sidebarOpened;
    }
    
    public translate(text: string){
        return this.translateService.translate(text);
    }

    public getCurrentUser(){
        let usr = this.connexionService.getUser();
        return usr;
    }

    public isConnected(){
        return this.connexionService.isConnected();
    }
}
