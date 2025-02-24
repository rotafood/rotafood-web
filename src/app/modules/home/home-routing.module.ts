import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasTokenGuard } from '../../core/guards/has-token/has-token.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogsOnlineComponent } from './pages/catalogs-online/catalogs-online.component';
import { CatalogOnlineContextComponent } from './pages/catalogs-online/catalog-online-context/catalog-online-context.component';
import { ReviewOrderPageComponent } from './pages/review-order-page/review-order-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent, 
  },
  {
      path: 'entrar',
      component: LoginComponent, 
      canActivate: [hasTokenGuard]

  },
  {
      path: 'registrar',
      component: RegisterComponent,
      canActivate: [hasTokenGuard]
  },

  {
    path: 'cardapios/:onlineName',
    component: CatalogsOnlineComponent,
    children: [
      {
        path: ':catalogContext',
        component: CatalogOnlineContextComponent,
        children: [
          {
            path: 'revisar-pedido',
            component: ReviewOrderPageComponent
          }
        ]
      }
    ]
  },

  {
    path: 'login',
    redirectTo: 'entrar'
  },

  {
    path: 'register',
    redirectTo: 'registrar'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
