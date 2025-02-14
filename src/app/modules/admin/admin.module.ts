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
import { ItemPizzaCreateOrUpdateDialogComponent } from './components/item-pizza-create-or-update-dialog/item-pizza-create-or-update-dialog.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DefaultPackagingSelectorDialogComponent } from './components/default-packaging-selector-dialog/default-packaging-selector-dialog.component';
import { CatalogOnlineSettingsPageComponent } from './pages/catalog-online-settings-page/catalog-online-settings-page.component';
import { MerchantSettingsPageComponent } from './pages/merchant-settings-page/merchant-settings-page.component';
import { AddressAutocompleteGoogleMapsComponent } from '../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { PizzaToppingsUpdateOrCreateDialogComponent } from './components/pizza-toppings-update-or-create-dialog/pizza-toppings-update-or-create-dialog.component';
import { OrdersListPageComponent } from './pages/orders-list-page/orders-list-page.component';
import { CatalogsListPageComponent } from './pages/catalogs-list-page/catalogs-list-page.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ItemDefaultCreateOrUpdateDialogComponent } from './components/item-default-create-or-update-dialog/item-default-create-or-update-dialog.component';





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
    CategoryDefaultOrPizzaDialogComponent,
    ItemInstructedCreateDialogComponent,
    ItemPizzaCreateOrUpdateDialogComponent,
    CategoryUpdateOrCrateDialogComponent,
    MerchantSettingsPageComponent,
    DefaultPackagingSelectorDialogComponent,
    ItemDefaultCreateOrUpdateDialogComponent,
    CatalogOnlineSettingsPageComponent,
    ItemInstructedSelectorDialogComponent,
    OptionGroupUpdateOrCreateDialogComponent,
    ItemPreparedOrInstructedDialogComponent,
    PizzaToppingsUpdateOrCreateDialogComponent,
    CatalogsListPageComponent,
    OrdersListPageComponent,
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
    MatDatepickerModule,
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
    AddressAutocompleteGoogleMapsComponent,
    FooterComponent,
    NoDataContentComponent,
  ],

  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginator },
    {provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNativeDateAdapter()


  ],
  

})


export class AdminModule { }
