import { Component, Inject } from '@angular/core';
import { DefaultProduct } from '../../../../core/interfaces/catalog/default-product';
import { DefaultProductsService } from '../../../../core/services/default-products/default-producs.service';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemInstructedCreateDialogComponent } from './item-instructed-create-dialog/item-instructed-create-dialog.component';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';

@Component({
  selector: 'app-item-instructed-selector-dialog',
  templateUrl: './item-instructed-selector-dialog.component.html',
  styleUrl: './item-instructed-selector-dialog.component.scss'
})
export class ItemInstructedSelectorDialogComponent {
  products: DefaultProduct[] = [];
  searchControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  isMobile = false;

  constructor(
    private readonly defaultProductsService: DefaultProductsService, 
    public dialogRef: MatDialogRef<ItemInstructedCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {categoryId: string},
    private readonly dialog: MatDialog, private readonly windowService: WindowWidthService,
      ) { }
    
    
  ngOnInit() {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
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
      width: this.isMobile ? '100%' : '90%',
      height: this.isMobile ? '100%' : '90%',
      data: {product: product, categoryId: this.data.categoryId}
    }).afterClosed().subscribe(response => {
      if (response) {
        this.dialogRef.close(response)
      }
    })
  }

  clearSearch() {
    this.searchControl.setValue("")
  }
}

