import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appReplaceDotWithComma]',
  standalone: true,
})
export class ReplaceDotWithCommaDirective {
  @Input() prefix: string = ''; // Adicionando o atributo para o prefixo
  decimalPlaces: number = 2;

  constructor(private readonly control: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Remove caracteres que não sejam números ou vírgulas
    let sanitizedValue = value.replace(/[^0-9,]/g, '');

    const parts = sanitizedValue.split(',');
    sanitizedValue = parts.shift()! + (parts.length > 0 ? ',' + parts.join('') : '');

    // Limita o número de casas decimais
    if (this.decimalPlaces > 0 && sanitizedValue.includes(',')) {
      const [integerPart, decimalPart] = sanitizedValue.split(',');
      sanitizedValue =
        integerPart + ',' + decimalPart.substring(0, this.decimalPlaces);
    }

    // Adiciona o prefixo
    const formattedValue = `${this.prefix}${sanitizedValue}`;

    // Atualiza o valor do controle
    this.control.control?.setValue(formattedValue);
  }
}
