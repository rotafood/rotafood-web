import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { AdminComponent } from './admin.component';
import { ProductCategoryListComponent } from './product-category/product-category-list/product-category-list.component';
import { ProductCategoryCreateComponent } from './product-category/product-category-create/product-category-create.component';

const routes: Routes = [
  {
    path: '', 
    component: AdminLayoutComponent,
    children: [
      {path: '', component: AdminComponent},

      {
        path: 'categorias', 
        children: [
          {path: '', component: ProductCategoryListComponent},
          {path: 'novo', component: ProductCategoryCreateComponent},
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
