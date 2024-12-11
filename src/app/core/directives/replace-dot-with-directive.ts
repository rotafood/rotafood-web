import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appReplaceDotWithComma]',
  standalone: true,
})
export class ReplaceDotWithCommaDirective {
 decimalPlaces: number = 2;

  constructor(private readonly control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    let sanitizedValue = value.replace(/[^0-9,]/g, '');

    const parts = sanitizedValue.split(',');
    sanitizedValue = parts.shift()! + (parts.length > 0 ? ',' + parts.join('') : '');

    if (this.decimalPlaces > 0 && sanitizedValue.includes(',')) {
      const [integerPart, decimalPart] = sanitizedValue.split(',');
      sanitizedValue =
        integerPart + ',' + decimalPart.substring(0, this.decimalPlaces);
    }

    this.control.control?.setValue(sanitizedValue);
  }
}
