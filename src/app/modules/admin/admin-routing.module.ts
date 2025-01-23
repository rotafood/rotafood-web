import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminComponent } from './pages/admin.component';
import { MerchantSettingsPageComponent } from './pages/merchant-settings-page/merchant-settings-page.component';
import { OrdersListPageComponent } from './pages/orders-list-page/orders-list-page.component';
import { CatalogsListPageComponent } from './pages/catalogs-list-page/catalogs-list-page.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminLayoutComponent,
    children: [
      {
        path: '', 
        component: AdminComponent
      },

      {
        path: 'cardapios', 
        children: [
          {
            path: '', 
            component: CatalogsListPageComponent
          },
        ]
      },

      {
        path: 'pedidos', 
        children: [
          {
            path: 'listar', 
            component: OrdersListPageComponent
          },
        ]
      },

      {
        path: 'configuracoes',
        children: [
          {
            path: '',
            component: MerchantSettingsPageComponent
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

 }
