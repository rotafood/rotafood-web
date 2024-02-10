import { Component } from '@angular/core';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [
    DefaultLayoutComponent
  ],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent {

}
