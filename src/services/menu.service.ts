import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class MenuService {
    menu: any[];

    private toolbox: Toolbox = new Toolbox();  

    constructor(private http: Http){
        
    }

    public load (url: string, callbackSuccess?: Function, callbackFailure?: Function){
        this.toolbox.log(url);
        this.http.get(url).subscribe(
            (data: any) => this.manageData(callbackSuccess, data),
            (error: any) => this.manageError(callbackFailure, error)
        );
    }

    private manageData (callback: any, data: any){
        this.toolbox.log(data);
        this.menu = this.toolbox.parseJson(data._body);
        this.toolbox.writeToStorage("menus", this.menu, false);
        if (callback){
            callback(this.menu);
        }
    };

    private manageError (callback: any, error: any){
        console.log(error);
        if (callback){
            callback(error);
        }
    };

    public getMenu(){
        return this.toolbox.readFromStorage("menus");
    }

}