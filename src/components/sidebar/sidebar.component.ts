import {Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { GenericComponent } from '../../components/generic.component';
import { MenuService } from '../../services/menu.service';
import { ConfigurationService } from '../../services/configuration.service';
import { TranslateService } from '../../services/translate.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: []
})

export class SidebarComponent extends GenericComponent {
    tanslate(text: string): string {
        throw new Error("Method not implemented.");
    }
    connexion: any;
    menu: any;

    constructor (private menuService: MenuService, private router: Router, public configurationService: ConfigurationService, public translateService: TranslateService){
        super(configurationService, translateService);
    }

    @Output() menuClick: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit(){
        this.menuService.load('./assets/menu.json', (data: any) => this.menuLoaded(data));
    }

    private menuLoadedDocumentation(data: any){
        this.menu.sidebarMenu = data;
    }

    private menuLoaded(data: any){
        this.menu = data;
    }

    private menuLoadedFailure(data: any){
        console.log(data);
    }

    clickMenu(href: string){
        this.router.navigate([href]);
        this.menuClick.emit(href);
    }
}