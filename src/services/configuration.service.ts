import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Http } from '@angular/http';

@Injectable()
export class ConfigurationService {

    private toolbox: Toolbox = new Toolbox(); 
    public data: any; 
    private url = './assets/configuration.json';
    private storageKey = "configuration";

    constructor (private http: Http){
        this.init();
    }

    public load(): Promise<boolean> {
        return new Promise <boolean> ((resolve) => {
            let conf = this.get(); 
            if (!conf){
                setTimeout(() => {
                    console.log('hello world');
                    resolve(true);
                }, 2000);
            }else{
                resolve(true);
            }
        });
    }    

    public get(){
        this.data = this.toolbox.readFromStorage(this.storageKey);
        if (this.data){
            return this.data; 
        }
        return null;
    }

    public init (callbackSuccess: Function = null, callbackFailure: Function = null){
        this.http.get(this.url).subscribe(
            (data: any) => this.manageData(callbackSuccess, data),
            (error: any) => this.manageError(callbackFailure, error)
        );
    }

    private manageData (callbackSuccess: Function, data: any){
        this.toolbox.log(data);
        this.data = this.toolbox.parseJson(data._body);
        this.toolbox.writeToStorage(this.storageKey, this.data, false);
        if (callbackSuccess){
            callbackSuccess(this.data);
        }
    };

    private manageError (callbackFailure: Function, error: any){
        console.log(error);
        if (callbackFailure){
            callbackFailure(error);
        }        
    };
}