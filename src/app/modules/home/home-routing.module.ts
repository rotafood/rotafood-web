import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasTokenGuard } from '../../core/guards/has-token/has-token.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogsOnlineComponent } from './pages/catalogs-online/catalogs-online.component';
import { CatalogOnlineContextComponent } from './pages/catalog-online-context/catalog-online-context.component';
import { ReviewOrderPageComponent } from './pages/review-order-page/review-order-page.component';
import { OrderStatusPageComponent } from './pages/order-status-page/order-status-page.component';

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
  },

  {
    path: 'cardapios/:onlineName/:catalogContext',
    component: CatalogOnlineContextComponent,
  },

  {
    path: 'cardapios/:onlineName/:catalogContext/revisar-pedido',
    component: ReviewOrderPageComponent
  },

  {
    path: 'cardapios/:onlineName/pedidos/:orderId',
    component: OrderStatusPageComponent
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
