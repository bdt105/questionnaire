import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';

import { TranslateService } from './translate.service';
import { ConfigurationService } from './configuration.service';
import { ConnexionService } from './connexion.service';

@Injectable()
export class UserService {

    private toolbox: Toolbox = new Toolbox(); 
    private translateData : any; 
    private currentText: string;
    private language = "FR";
    private url = './assets/translate' + this.language + '.json';
    private storageKey = "connexion";

    constructor(private http: Http, private configurationService: ConfigurationService, private translateService: TranslateService, 
        private connexionService: ConnexionService){
    }

    private successSave(callbackSuccess: Function, callbackFailure: Function, data: any, user: any){
        let dat = JSON.parse(data._body);
        if (dat.status == "ERR"){
            if (callbackFailure){
                callbackFailure(dat);
            }
        }else{
            let usr = this.toolbox.readFromStorage("connexion");
            usr.decoded = user;
            this.connexionService.saveConnexion(usr);
            if (callbackSuccess){
                callbackSuccess(dat);
            }
        }
    }

    private failureSave(callback: Function, error: any){
        if (callback){
            callback(error);
        }    
    }

    public save(callbackSuccess: Function, callbackFailure: Function, user: any){
        let token = this.connexionService.getToken();
        let usr = this.toolbox.cloneObject(user);
        delete(usr.iat);
        if (token && user){
            let body: any = {};
            body.token = token;
            body.object = usr;
            body.idFieldName = "iduser";
            console.log(JSON.stringify(body));
            this.http.put(this.configurationService.get().common.authentificationApiBaseUrl + "user", body).subscribe(
                (data: any) => this.successSave(callbackSuccess, callbackFailure, data, user),
                (error: any) => this.failureSave(callbackFailure, error)
            );
        }
    }

    public delete(callbackSuccess: Function, callbackFailure: Function, user: any){
        let token = this.connexionService.getToken();        
        if (user){
            this.http.delete(this.configurationService.get().common.authentificationApiBaseUrl + "get", user).subscribe(
                (data: any) => this.successSave(callbackSuccess, callbackFailure, data, user),
                (error: any) => this.failureSave(callbackFailure, error)
            );
        }
    }
}