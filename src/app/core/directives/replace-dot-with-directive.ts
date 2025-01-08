import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appReplaceDotWithComma]',
  standalone: true,
})
export class ReplaceDotWithCommaDirective {
  @Input() prefix: string = '';
  @Input() decimalPlaces: number = 2;
  private previousValue: string = ''; 

  constructor(private readonly control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (this.previousValue === value) {
      return;
    }

    let sanitizedValue = value.replace(/[^0-9,]/g, '');

    const parts = sanitizedValue.split(',');
    sanitizedValue = parts.shift()! + (parts.length > 0 ? ',' + parts.join('') : '');

    if (this.decimalPlaces > 0 && sanitizedValue.includes(',')) {
      const [integerPart, decimalPart] = sanitizedValue.split(',');
      sanitizedValue =
        integerPart + ',' + decimalPart.substring(0, this.decimalPlaces);
    }

    const formattedValue = `${this.prefix}${sanitizedValue}`;

    this.previousValue = formattedValue;
    if (this.control) {
      this.control.control?.setValue(formattedValue, { emitEvent: false });
    }
  }
}
