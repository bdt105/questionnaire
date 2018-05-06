import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';
import { Observable } from 'rxjs/Observable';

import { ConfigurationService } from "bdt105angularconfigurationservice";

@Injectable()
export class MiscellaneousService {

    private toolbox: Toolbox = new Toolbox(); 
    private translateData : any; 
    private currentText: string;
    private language = "FR";
    private url = './assets/translate' + this.language + '.json';
    private configurationKey = "configurationQuestionnaire";
    private translateKey = "translateQuestionnaire";

    constructor(public configurationService: ConfigurationService){
    }

    private get(storageKey: string, timer: number){
        let obj = this.toolbox.readFromStorage(this.configurationKey);
        return obj;
    }

    configuration(){
        return this.get(this.configurationKey, 3000);
    }

    translate(text: string){
        let translateData = this.get(this.translateKey, 3000);
        if (translateData){
            let t = this.toolbox.filterArrayOfObjects(translateData, "key", text);
            if (t && t.length > 0){ 
                return t[0].value;
            }
        }
        return text;
    }

    translation(){
        return this.get(this.translateKey, 3000);
    }

    getConfigurationPromise(){
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", false);
    }

    getTranslationPromise(){
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", false);
    }
}
