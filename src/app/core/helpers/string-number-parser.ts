import { DecimalPipe } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stringToNumber(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const formattedValue = value.replace(',', '.');
  const parsedValue = parseFloat(formattedValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
}

export function numberToString(value: number | null | undefined, decimal: number = 2): string {
    const decimalPipe = new DecimalPipe('pt-BR');
    if (value === null || value === undefined) {
        return '0,00';
    }
    return decimalPipe.transform(value, `1.2-${decimal}`, 'pt-BR') ?? '';
}



export function stringMinValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value?.replace(',', '.'));
    if (!isNaN(value) && value < min) {
      return { min: { requiredMin: min, actual: value } };
    }
    return null;
  };
}

export function stringMaxValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value?.replace(',', '.'));
    if (!isNaN(value) && value > max) {
      return { max: { requiredMax: max, actual: value } };
    }
    return null;
  };
}
