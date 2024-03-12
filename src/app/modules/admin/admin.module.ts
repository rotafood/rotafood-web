import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AdminComponent } from './pages/admin.component';
import { ProductCategoryListComponent } from './pages/product-category/product-category-list/product-category-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ProductCategoryCreateComponent } from './pages/product-category/product-category-create/product-category-create.component';
import {MatTableModule} from '@angular/material/table';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AdminDrawerComponent } from './components/admin-layout/admin-drawer/admin-drawer.component';
import { AdminHeaderComponent } from './components/admin-layout/admin-header/admin-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminUserMenuComponent } from './components/admin-layout/admin-user-menu/admin-user-menu.component';
import { adminDrawerListComponent } from './components/admin-layout/admin-drawer/admin-drawer-list/admin-drawer-list.component';
import { NoDataContentComponent } from '../../shared/no-data-content/no-data-content.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LoadingSpinnerDialogComponent } from '../../shared/loading-spinner-dialog/loading-spinner-dialog.component';
import { ProductCategoryEditComponent } from './pages/product-category/product-category-edit/product-category-edit.component';
import { CanDeleteDialogComponent } from '../../shared/can-delete-dialog/can-delete-dialog.component';
import { DefaultTableHeaderComponent } from './components/default-table-header/default-table-header.component';
import { DefaultTableCellComponent } from './components/default-table-cell/default-table-cell.component';
import { DefaultColumnsControlComponent } from './components/default-columns-control/default-columns-control.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AdminDrawerComponent,
    adminDrawerListComponent,
    AdminHeaderComponent,
    AdminLayoutComponent,
    AdminUserMenuComponent,
    AdminComponent,
    ProductCategoryListComponent,
    ProductCategoryCreateComponent,
    ProductCategoryEditComponent,
    DefaultTableHeaderComponent,
    DefaultTableCellComponent,
    DefaultColumnsControlComponent

  ],
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    MatNavList,
    MatMenuModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DefaultFormContainerComponent,
    LoadingSpinnerComponent,
    LoadingSpinnerDialogComponent,
    CanDeleteDialogComponent,
    SpinnerButtonComponent,
    FooterComponent,
    NoDataContentComponent,
  ],

})


export class AdminModule { }
