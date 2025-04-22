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
    data: {
      title: 'RotaFood - Início'
    }
  },
  {
    path: 'entrar',
    component: LoginComponent,
    canActivate: [hasTokenGuard],
    data: {
      title: 'Entrar - RotaFood'
    }
  },
  {
    path: 'registrar',
    component: RegisterComponent,
    canActivate: [hasTokenGuard],
    data: {
      title: 'Registrar - RotaFood'
    }
  },
  {
    path: 'cardapios/:onlineName',
    component: CatalogsOnlineComponent,
    data: {
      title: 'Catálogo Online'
    }
  },
  {
    path: 'cardapios/:onlineName/:catalogContext',
    component: CatalogOnlineContextComponent,
    data: {
      title: 'Cardápio Online',
      metaDescription: 'Visualize os itens disponíveis para seu pedido no cardápio online.'
    }
  },
  {
    path: 'cardapios/:onlineName/:catalogContext/revisar-pedido',
    component: ReviewOrderPageComponent,
    data: {
      title: 'Revisar Pedido',
    }
  },
  {
    path: 'cardapios/:onlineName/pedidos/:orderId',
    component: OrderStatusPageComponent,
    data: {
      title: 'Status do Pedido'
    }
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
