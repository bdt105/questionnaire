import { Injectable } from "@angular/core";

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { ConfigurationService } from './configuration.service';
import { Toolbox } from "bdt105toolbox/dist";
import { ConnexionService } from './connexion.service';

@Injectable()
export class AuthGuard implements CanActivate{

    private toolbox: Toolbox = new Toolbox();
    
    constructor(private router: Router, private configurationService: ConfigurationService, public connexionService: ConnexionService){

    }

    canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let conn = this.connexionService.isConnected();
        if (!conn){
            this.toolbox.writeToStorage("redirectUrl", state.url, true);
            let url = this.toolbox.readFromStorage("redirectUrl");
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

}