import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

// Components
import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { LoginComponent } from '../components/login/login.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { QuestionnairesComponent } from '../components/questionnaire/questionnaires.component';
import { TesterComponent } from '../components/test/tester.component';
import { QuestionSimpleComponent } from '../components/question/questionSimple.component';
import { QuestionGroupComponent } from '../components/question/questionGroup.component';
import { QuestionEditComponent } from '../components/question/questionEdit.component';
import { QuestionsComponent } from '../components/question/questions.component';
import { QuestionCheckComponent } from '../components/question/questionCheck.component';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { QuestionnaireOneComponent } from '../components/questionnaire/questionnaireOne.component';
import { ConfirmationComponent } from '../components/standard/confirmation.component';
import { SearchComponent } from '../components/search/search.component';

// Sidebar module https://github.com/arkon/ng-sidebar
import { SidebarModule } from 'ng-sidebar';

// Bootstrap components https://valor-software.com/ngx-bootstrap
import { 
    AccordionModule, 
    AccordionConfig, 
    TabsModule,
    TypeaheadModule,
    PaginationModule,
    ModalModule,
    ProgressbarModule } from 'ngx-bootstrap';

// Confirmations https://mattlewis92.github.io/angular-confirmation-popover/
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

// https://github.com/maxisam/ngx-clipboard
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

// https://github.com/igghera/floating-action-menu
import { FloatingActionMenuModule } from 'ng2-floating-action-menu';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Services
import { MenuService } from '../services/menu.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { ConnexionTokenService } from 'bdt105angularconnexionservice';

// import { FormValidationService } from '../services/fromValidation.service';
import { AuthGuard } from '../services/auth.guard';
import { QuestionnaireService } from '../services/questionnaire.service';
import { GroupByPipe } from '../services/groupBy.pipe';
import { SafePipe } from '../services/safe.pipe';
import { MiscellaneousService } from '../services/miscellaneous.service';

export function init(configurationService: ConfigurationService) {
    return () => {
        configurationService.load("configurationQuestionnaire", "./assets/configuration.json", false);
        configurationService.load("translateQuestionnaire", "./assets/translateFR.json", false);
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        SidebarComponent,
        LoginComponent,
        AboutComponent,
        QuestionnairesComponent,
        QuestionnaireComponent,
        QuestionnaireOneComponent,
        TesterComponent,
        ConfirmationComponent,
        QuestionSimpleComponent,
        QuestionGroupComponent,
        QuestionEditComponent,        
        QuestionsComponent,
        QuestionCheckComponent,
        SearchComponent,
        GroupByPipe,
        SafePipe
    ],
    entryComponents: [
        ConfirmationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AccordionModule,
        HttpModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        ProgressbarModule.forRoot(),
        PaginationModule.forRoot(),
        ConfirmationPopoverModule.forRoot({"confirmButtonType": "danger"}),
        SidebarModule.forRoot(),
        ClipboardModule,
        FloatingActionMenuModule
    ],
    providers: [
        {
            'provide': APP_INITIALIZER,
            'useFactory': init,
            'deps': [ ConfigurationService ],
            'multi': true
        },
        AuthGuard, MenuService, AccordionConfig, ConfigurationService, MiscellaneousService, 
        ConnexionTokenService, QuestionnaireService, ClipboardService],
        bootstrap: [ AppComponent ]
    }
)


export class AppModule { 
}