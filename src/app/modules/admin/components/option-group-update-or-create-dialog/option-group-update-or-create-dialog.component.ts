import { Component, Inject } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OptionGroupDto } from '../../../../core/interfaces/order/option-group';
import { OptionDto } from '../../../../core/interfaces/order/option';
import { Status } from '../../../../core/enums/status';
import { ContextModifierDto } from '../../../../core/interfaces/catalog/context-modifier';
import { CatalogContext, catalogContextToString } from '../../../../core/enums/catalog-context';
import { numberToString, stringToNumber } from '../../../../core/helpers/string-number-parser';
import { OptionGroupsService } from '../../../../core/services/option-groups/option-groups.service';
import { OptionGroupType } from '../../../../core/enums/option-group-type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Serving } from '../../../../core/enums/serving';

function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length < min) {
      return { minLengthArray: { requiredLength: min, actualLength: control.value.length } };
    }
    return null;
  };
}

@Component({
  selector: 'app-option-group-update-or-create-dialog',
  templateUrl: './option-group-update-or-create-dialog.component.html',
  styleUrls: ['./option-group-update-or-create-dialog.component.scss']
})
export class OptionGroupUpdateOrCreateDialogComponent {
  optionGroupForm: FormGroup;
  statusOptions = Object.values(Status);

  constructor(
    private readonly optionGroupsServices: OptionGroupsService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
    public dialogRef: MatDialogRef<OptionGroupUpdateOrCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OptionGroupDto | null
  ) {
    this.optionGroupForm = new FormGroup({
      id: new FormControl(data?.id ?? null),
      name: new FormControl(data?.name ?? '', Validators.required),
      status: new FormControl(data?.status ?? Status.AVAILIABLE, Validators.required),
      optionGroupType: new FormControl(data?.optionGroupType ?? OptionGroupType.DEFAULT, Validators.required),
      options: new FormArray(data?.options?.map(option => this.createOptionForm(option)) ?? [], minLengthArray(1)),
      iFoodOptionGroupId: new FormControl(data?.iFoodOptionGroupId ?? null)
    });
  }

  getCatalogContextToString(value: any): string {
    if (value in CatalogContext) {
      return catalogContextToString[value as CatalogContext];
    }
    return '';
  }

  get optionsFormArray(): FormArray {
    return this.optionGroupForm.get('options') as FormArray;
  }

  createOptionForm(option?: OptionDto): FormGroup {
    return new FormGroup({
      id: new FormControl(option?.id ?? null),
      index: new FormControl(option?.index ?? null, Validators.required),
      status: new FormControl(option?.status ?? Status.AVAILIABLE, Validators.required),
      
      contextModifiers: new FormArray((option?.contextModifiers ?? this.defaultContextModifiers()).map((m: ContextModifierDto) => this.createContextModifierForm(m))),
      product: new FormGroup({
        id: new FormControl(option?.product?.id ?? null),
        name: new FormControl(option?.product?.name ?? ''),
        description: new FormControl(option?.product?.description ?? ''),
        serving: new FormControl(Serving.NOT_APPLICABLE),
        imagePath: new FormControl(option?.product?.imagePath ?? ''),
      }),
    });
  }

  updateOptionIndices(): void {
    this.optionsFormArray.controls.forEach((control, index) => {
      control.get('index')?.setValue(index);
    });
  }

  defaultContextModifiers() {
    return [
      { catalogContext: CatalogContext.TABLE, status: Status.AVAILIABLE, price: { value: 0, originalValue: 0 } },
      { catalogContext: CatalogContext.DELIVERY, status: Status.AVAILIABLE, price: { value: 0, originalValue: 0 } },
      { catalogContext: CatalogContext.IFOOD, status: Status.AVAILIABLE, price: { value: 0, originalValue: 0 } }
    ];
  }


  moveOptionUp(index: number): void {
    if (index > 0) {
      const options = this.optionsFormArray;
      const currentOption = options.at(index);
      options.removeAt(index);
      options.insert(index - 1, currentOption);
    }
  }
  
  moveOptionDown(index: number): void {
    if (index < this.optionsFormArray.length - 1) {
      const options = this.optionsFormArray;
      const currentOption = options.at(index);
      options.removeAt(index);
      options.insert(index + 1, currentOption);
    }
  }
  

  createContextModifierForm(contextModifier?: ContextModifierDto): FormGroup {
    return new FormGroup({
      id: new FormControl(contextModifier?.id ?? null),
      catalogContext: new FormControl(contextModifier?.catalogContext ?? '', Validators.required),
      status: new FormControl(contextModifier?.status ?? true, Validators.required),
      price: new FormGroup({
        id: new FormControl(contextModifier?.price?.id ?? null),
        value: new FormControl(numberToString(contextModifier?.price?.value, 2, 'R$: ') ?? null, Validators.required),
        originalValue: new FormControl(numberToString(contextModifier?.price?.originalValue, 2, 'R$: ') ?? null),
      }),
    });
  }
  
  getContextModifiersFormArray(optionIndex: number): FormArray {
    return this.optionsFormArray.at(optionIndex).get('contextModifiers') as FormArray;
  }
  
  updateImagePath(imagePath: string, index: number): void {
    const productGroup = this.optionsFormArray.at(index).get('product') as FormGroup;
    if (productGroup) {
      productGroup.get('imagePath')?.setValue(imagePath);
    }
  }
  

  addOption(): void {
    this.optionsFormArray.push(this.createOptionForm());
    this.updateOptionIndices()
  }

  removeOption(index: number): void {
    this.optionsFormArray.removeAt(index);
  }

  formsValids() {
    return this.optionGroupForm.valid && this.optionsFormArray.controls.every(control => control.valid)
  }

  onSubmit(): void {
    if (this.formsValids()) {
      const optionGroup = this.optionGroupForm.value;
  
      optionGroup.options = optionGroup.options.map((option: any, index: number) => {
        return {
          ...option,
          index: index,
          contextModifiers: option.contextModifiers.map((contextModifier: any) => ({
            ...contextModifier, 
            price: {
              ...contextModifier.price,
              value: stringToNumber(contextModifier.price.value),
              originalValue: stringToNumber(contextModifier.price.originalValue),
            },
          })),
        };
      });
  
      this.optionGroupsServices.updateOrCreate(optionGroup as OptionGroupDto).subscribe({
        next: (response) => {
          this.snackbar.open('O grupo de complementos foi criado/atualizado com sucesso!', 'fechar', { duration: 3000 });
          this.dialogRef.close(response);
          this.router.navigate([this.router.url]);
        },
        error: (errors) => {
          this.snackbar.open(errors.error, 'fechar');
        }
      });
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
