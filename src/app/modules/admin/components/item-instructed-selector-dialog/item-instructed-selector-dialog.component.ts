import { Component } from '@angular/core';
import { DefaultProduct } from '../../../../core/interfaces/default-product';
import { DefaultProductsService } from '../../../../core/services/default-products/default-producs.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ItemInstructedCreateDialogComponent } from '../item-instructed-create-dialog/item-instructed-create-dialog.component';

@Component({
  selector: 'app-item-instructed-selector-dialog',
  templateUrl: './item-instructed-selector-dialog.component.html',
  styleUrl: './item-instructed-selector-dialog.component.scss'
})
export class ItemInstructedSelectorDialogComponent {
  products: DefaultProduct[] = [];
  searchControl: FormControl = new FormControl('Coca', [Validators.required]);

  constructor(
    private readonly defaultProductsService: DefaultProductsService, 
    private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.searchControl.value) {
      this.defaultProductsService.getDefaultProducts(this.searchControl.value).subscribe(
        (products) => (this.products = products)
      );
    }
  }

  selectProduct(product: DefaultProduct): void {
    this.dialog.open(ItemInstructedCreateDialogComponent, {
      height: "90vh",
      width: "90vw",
      data: product
    })
  }

  clearSearch() {
    this.searchControl.setValue("")
  }
}

