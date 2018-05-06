import { Component } from '@angular/core';
import { ConnexionTokenService } from "bdt105angularconnexionservice"

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public sidebarOpened = false;

    constructor(private connexionService: ConnexionTokenService){
    }
    
    title = 'app';
    
    public toggleSidebar(event: any) {
		this.sidebarOpened = !this.sidebarOpened;
    }
    
	sideMenuClick(){
		this.sidebarOpened = false;
	}    

    public getCurrentUser(){
        let usr = this.connexionService.getUser();
        return usr;
    }

    public isConnected(){
        return this.connexionService.isConnected();
    }
}
