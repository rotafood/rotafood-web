import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DefaultFormContainerComponent } from '../../shared/default-form-container/default-form-container.component';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerButtonComponent } from '../../shared/spinner-button/spinner-button.component';
import { MatIconModule } from '@angular/material/icon';
import { AdminComponent } from './pages/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
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
import { AdminDrawerListComponent } from './components/admin-layout/admin-drawer/admin-drawer-list/admin-drawer-list.component';
import { NoDataContentComponent } from '../../shared/no-data-content/no-data-content.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LoadingSpinnerDialogComponent } from '../../shared/loading-spinner-dialog/loading-spinner-dialog.component';
import { CanDeleteDialogComponent } from '../../shared/can-delete-dialog/can-delete-dialog.component';
import { DefaultTableHeaderComponent } from './components/default-table-header/default-table-header.component';
import { DefaultTableCellComponent } from './components/default-table-cell/default-table-cell.component';
import { DefaultColumnsControlComponent } from './components/default-columns-control/default-columns-control.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomPaginator } from './components/custom-paginator/custom-paginator';
import { CatalogsComponent } from './pages/catalogs/catalogs.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CategoryUpdateOrCrateDialogComponent } from './components/category-update-or-crate-dialog/category-update-or-crate-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { OptionGroupUpdateOrCreateDialogComponent } from './components/option-group-update-or-create-dialog/option-group-update-or-create-dialog.component';
import { ItemUpdateOrCreateDialogComponent } from './components/item-update-or-create-dialog/item-update-or-create-dialog.component';
import { ImageSelectorComponent } from './components/image-selector/image-selector.component';
import { ReplaceDotWithCommaDirective } from '../../core/directives/replace-dot-with-directive';
import { PackagingUpdateOrCreateDialogComponent } from './components/packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';
import { SelectImageDialogComponent } from './components/image-selector/select-image-dialog/select-image-dialog.component';
import { StatusToggleComponent } from './components/status-slide-toggle/status-slide-toggle.component';
import { CategoryDefaultOrPizzaDialogComponent } from './components/category-default-or-pizza-dialog/category-default-or-pizza-dialog.component';
import { ItemPreparedOrInstructedDialogComponent } from './components/item-prepared-or-instructed-dialog/item-prepared-or-instructed-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemInstructedSelectorDialogComponent } from './components/item-instructed-selector-dialog/item-instructed-selector-dialog.component';
import { ItemInstructedCreateDialogComponent } from './components/item-instructed-create-dialog/item-instructed-create-dialog.component';
import { ItemsAndCategoriesPagesComponent } from './pages/items-and-categories-pages/items-and-categories-pages.component';
import { ItemPizzaCreateOrUpdateDialogComponent } from './components/item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DefaultPackagingSelectorDialogComponent } from './components/default-packaging-selector-dialog/default-packaging-selector-dialog.component';





@NgModule({
  declarations: [
    AdminDrawerComponent,
    AdminDrawerListComponent,
    AdminHeaderComponent,
    AdminLayoutComponent,
    AdminUserMenuComponent,
    AdminComponent,
    SelectImageDialogComponent,
    StatusToggleComponent,
    ImageSelectorComponent,
    PackagingUpdateOrCreateDialogComponent,
    CatalogsComponent,
    CategoryDefaultOrPizzaDialogComponent,
    ItemInstructedCreateDialogComponent,
    ItemPizzaCreateOrUpdateDialogComponent,
    CategoryUpdateOrCrateDialogComponent,
    DefaultPackagingSelectorDialogComponent,
    ItemsAndCategoriesPagesComponent,
    ItemUpdateOrCreateDialogComponent,
    ItemInstructedSelectorDialogComponent,
    OptionGroupUpdateOrCreateDialogComponent,
    ItemPreparedOrInstructedDialogComponent,
    DefaultTableHeaderComponent,
    DefaultTableCellComponent,
    DefaultColumnsControlComponent

  ],
  imports: [
    MatButtonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatProgressSpinner,
    MatRadioModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatNavList,
    MatMenuModule,
    MatFormFieldModule, 
    QRCodeModule,
    MatInputModule, 
    MatDialogModule,
    ReplaceDotWithCommaDirective,
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatStepperModule,
    MatSelectModule,
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

  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator },
    {provide: LOCALE_ID, useValue: 'pt-BR' },

  ],
  

})


export class AdminModule { }
