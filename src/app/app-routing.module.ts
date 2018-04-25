import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { LoginComponent } from '../components/login/login.component';
import { UserComponent } from '../components/user/user.component';
import { QuestionnairesComponent } from '../components/questionnaire/questionnaires.component';
import { TesterComponent } from '../components/test/tester.component';
import { AuthGuard } from '../services/auth.guard';
import { SearchComponent } from '../components/search/search.component';
import { TestsComponent } from '../components/test/tests.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'tester', component: TesterComponent, canActivate: [AuthGuard] },
    { path: 'tests', component: TestsComponent, canActivate: [AuthGuard] },
    { path: 'inputs', component: QuestionnairesComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'search/:search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {

}