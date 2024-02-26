import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminComponent } from './pages/admin.component';
import { ProductCategoryListComponent } from './pages/product-category/product-category-list/product-category-list.component';
import { ProductCategoryCreateComponent } from './pages/product-category/product-category-create/product-category-create.component';
import { ProductCategoryEditComponent } from './pages/product-category/product-category-edit/product-category-edit.component';

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
          {path: 'editar/:id', component: ProductCategoryEditComponent},
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
