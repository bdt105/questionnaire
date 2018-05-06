import {Component, Input, Output, EventEmitter} from '@angular/core';

import { MenuService } from '../../services/menu.service';
import { GenericComponent } from '../generic.component';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { ConnexionTokenService } from 'bdt105angularconnexionservice';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    providers: [MenuService]
})

export class NavbarComponent extends GenericComponent {
    public menu: any;
    public inputZone: string;
    
    @Output() clickSidebarMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor (private menuService: MenuService, public miscellaneousService: MiscellaneousService, public connexionTokenService: ConnexionTokenService){
        super(miscellaneousService);
    }
    
    toggleSidebar() {
        this.clickSidebarMenu.emit();
    }

    ngOnInit(){
        this.menuService.load('./assets/menu.json', (data: any) => this.menuLoaded(data));
    }

    private menuLoaded(data: any){
        this.menu = data;
        console.log(this.menu);
    }

    private menuLoadedFailure(data: any){
        console.log(data);
    }

    getCurrentUser(){
        let conn = this.connexionTokenService.get();
        return conn.decoded;
    }
}