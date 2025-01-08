import { Component, Inject } from '@angular/core';
import { DefaultPackagingDto } from '../../../../core/interfaces/default-packaging';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    private readonly dialogRef: MatDialogRef<DefaultPackagingSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { searchTerm?: string } | undefined,
    private readonly dialog: MatDialog) {
      if (this.data?.searchTerm) {
        this.searchControl.setValue(this.data.searchTerm)
      }
    }

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
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
      this.dialogRef.close();
    });
  }
  
  clearSearch() {
    this.searchControl.setValue("")
  }
}