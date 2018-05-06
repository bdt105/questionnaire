import { Component, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { Subject } from 'rxjs/Subject';
 
@Component({
  selector: 'confimation',
  templateUrl: './confimation.component.html'
})

export class ConfirmationComponent extends GenericComponent {

    public message: string;
    public bodyMessage: string;
    public title: string;
    public button1Function: Function;
    public button2Function: Function;
    public button1Label: string;
    public button2Label: string;
    public readOnly = true;

    public button1Click: Subject<boolean>; 
    public button2Click: Subject<boolean>; 
    
    public modalRef: BsModalRef;

    constructor(private modalService: BsModalService, public questionnaireService: QuestionnaireService, public miscellaneousService: MiscellaneousService){
        super(miscellaneousService);
    }

    ngOnInit() {
        this.button1Click = new Subject();
        this.button2Click = new Subject();
    }

    button1Clicked() {
        this.button1Click.next(true);
        this.modalRef.hide();
    }
   
    button2Clicked() {
        this.button2Click.next(true);
        this.modalRef.hide();
    }

}