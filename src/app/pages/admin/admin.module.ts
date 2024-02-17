import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AdminComponent } from './admin.component';
import { ProductCategoryListComponent } from './product-category/product-category-list/product-category-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ProductCategoryCreateComponent } from './product-category/product-category-create/product-category-create.component';
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    AdminComponent,
    ProductCategoryListComponent,
    ProductCategoryCreateComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    DefaultFormContainerComponent,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    RouterModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    SpinnerButtonComponent,
    MatTableModule
  ]
})


export class AdminModule { }
