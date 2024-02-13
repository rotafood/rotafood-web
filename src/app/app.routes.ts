import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoutingComponent } from './pages/routing/routing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';
import { DashComponent } from './pages/dash/dash.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent, 
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent, 
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent,
        pathMatch: 'full'

    },
    {
        path: 'routing',
        component: RoutingComponent, 
        pathMatch: 'full'
    },
    {
        path: 'test',
        redirectTo: 'routing'
    },
    {
        path: 'dash',
        component: DashComponent, 
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

