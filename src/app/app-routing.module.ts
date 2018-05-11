import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { AboutComponent } from '@components/about/about.component';
import { LoginComponent } from '@components/login/login.component';
import { QuestionnairesLocalComponent } from '@components/questionnaire/questionnairesLocal.component';
import { QuestionnaireOneComponent } from '@components/questionnaire/questionnaireOne.component';
import { TesterComponent } from '@components/test/tester.component';
import { AuthGuard } from '@sharedServices/auth.guard';
import { SearchComponent } from '@components/search/search.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'tester', component: TesterComponent, canActivate: [AuthGuard] },
    { path: 'questionnaires', component: QuestionnairesLocalComponent, canActivate: [AuthGuard] },
    { path: 'questionnaire/:id', component: QuestionnaireOneComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'search/:search', component: SearchComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {

}