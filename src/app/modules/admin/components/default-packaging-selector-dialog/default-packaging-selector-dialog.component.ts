import { Component } from '@angular/core';
import { DefaultPackagingDto } from '../../../../core/interfaces/default-packaging';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DefaultPackagingsService } from '../../../../core/services/default-packagings/default-packagings.service';
import { PackagingUpdateOrCreateDialogComponent } from '../packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';

@Component({
  selector: 'app-default-packaging-selector-dialog',
  templateUrl: './default-packaging-selector-dialog.component.html',
  styleUrl: './default-packaging-selector-dialog.component.scss'
})
export class DefaultPackagingSelectorDialogComponent {
  packagings: DefaultPackagingDto[] = [];
  searchControl: FormControl = new FormControl('Saco', [Validators.required]);

  constructor(
    private readonly defaultPackagingsService: DefaultPackagingsService, 
    private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.searchControl.value) {
      this.defaultPackagingsService.getDefaultProducts(this.searchControl.value).subscribe(
        (packagings) => (this.packagings = packagings)
      );
    }
  }

  selectProduct(packaging: DefaultPackagingDto): void {
    this.dialog.open(PackagingUpdateOrCreateDialogComponent, {
      height: "90vh",
      width: "90vw",
      data: packaging
    })
  }

  clearSearch() {
    this.searchControl.setValue("")
  }
}