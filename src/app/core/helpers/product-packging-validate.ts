import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateProductPackagings(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const packagingType = group.get('packagingType')?.value;
      const productPackagings = group.get('productPackagings') as FormArray;
      if (packagingType === 'PACKAGING' && productPackagings.length === 0) return { invalidSideBag: true };
      return null;
    };
  }