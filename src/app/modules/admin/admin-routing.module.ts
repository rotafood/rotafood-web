import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminComponent } from './pages/admin.component';
import { CatalogsComponent } from './pages/catalogs/catalogs.component';
import { ItemsAndCategoriesPagesComponent } from './pages/items-and-categories-pages/items-and-categories-pages.component';
import { CatalogOnlineSettingsPageComponent } from './pages/catalog-online-settings-page/catalog-online-settings-page.component';
import { MerchantSettingsPageComponent } from './pages/merchant-settings-page/merchant-settings-page.component';

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
            component: CatalogsComponent
          },
        ]
      },

      {
        path: 'categorias-e-items', 
        children: [
          {
            path: '', 
            component: ItemsAndCategoriesPagesComponent
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
