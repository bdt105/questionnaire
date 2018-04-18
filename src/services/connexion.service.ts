import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';

import { TranslateService } from './translate.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ConnexionService {

    private toolbox: Toolbox = new Toolbox(); 
    private translateData : any; 
    private currentText: string;
    private language = "FR";
    private url = './assets/translate' + this.language + '.json';
    private storageKey = "connexion";

    constructor(private http: Http, private configurationService: ConfigurationService, private translateService: TranslateService){
    }

    public connect (callbackSuccess: Function, callbackFailure: Function, log: string, passwd: string, forever: boolean = false){
        let body: any = {};
        body.login = log;
        body.password = passwd;
        this.http.post(this.configurationService.get().common.authentificationApiBaseUrl + "get", body).subscribe(
            (data: any) => this.connexionSuccess(callbackSuccess, data, forever),
            (error: any) => this.connexionFailure(callbackFailure, error)
        );
        // Fake connexion
        // let fakeUser = this.getFakeUser();
    }

    private getFakeUser(){
        return {
            "iduser": 1,
            "lastName": "fake",
            "firstName": "fake"
        }
    }

    private connexionSuccess(callback: Function, data: any, forever: boolean){
        let dat = JSON.parse(data._body);
        this.saveConnexion(data._body, forever);
        if (callback){
            callback(data._body);
        }
    }

    private connexionFailure(callback: Function, error: any){
        if (callback){
            callback(error);
        }    
    }

    public disconnect(){
        this.removeConnexion();
    }

    public isConnected(){
        let conn = this.get();
        if (conn){
            return conn.decoded != null;
        }else{
            return false;
        }
    }

    public get(){
        return this.toolbox.readFromStorage(this.storageKey);
    }

    public getToken(){
        let conn = this.get();
        if (conn){
            return conn.token;
        }
        return null;
    }

    public saveConnexion(connexion: any, forever: boolean = null){
        this.toolbox.writeToStorage(this.storageKey, connexion, forever);
    }
    
    public removeConnexion(){
        this.toolbox.removeFromStorage(this.storageKey);
    }

    public getUser(){
        let conn = this.get();
        if (conn && conn.decoded){
            return conn.decoded;
        }
        return null;
    }

}