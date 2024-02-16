import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-button',
  standalone: true,
  imports: [
    MatButton,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './spinner-button.component.html',
  styleUrl: './spinner-button.component.scss'
})
export class SpinnerButtonComponent {
  @Input() isLoading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: 'primary'|'accent' = 'primary';
  @Input() class: string = ''; // Vincula a classe do elemento hospedeiro

}
