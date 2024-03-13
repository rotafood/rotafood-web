import { Component } from '@angular/core';
import { ProductService } from '../../../../../core/services/product/product.service';
import { ProductFormService } from '../../../../../core/services/product/product-form/product-form.service';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../../../core/interfaces/product';
import { Location } from '@angular/common';
import { DialogErrorContentComponent } from '../../../../../shared/dialog-error-content/dialog-error-content.component';
import { DialogSuccessComponent } from '../../../../../shared/dialog-success/dialog-success.component';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {
  public isLoading: boolean = false
  public image: File | null = null
  public images: File[] | null = null

  constructor(
    private productService:ProductService,
    public productForm: ProductFormService,
    private location: Location,
    private dialog: MatDialog,

  ) {}

  onSubmit() {
    if (this.productForm.isCompleted()) {
      this.productService.create(this.productForm.getData()).subscribe(
        {
          next: (response: Product) => {

            this.dialog.open(DialogSuccessComponent, {data: {
              message: `O categoria ${response.name} foi criada cm sucesso`,
              link: `admin/categorias/editar/${response.id}`
            }})

          },
          error: (error) => {
            this.dialog.open(DialogErrorContentComponent, {data: {
              message: `Erro${error.statusCode} - ${error.detail}`,
            }})
          }
        }
      )
    }
  }

  back() {
    this.location.back()
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.image = fileList[0];
    } else {
      this.image = null;
    }
  }

  onMultipleFilesSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.images = Array.from(fileList);
    } else {
      this.images = [];
    }
  }
  
  
}
