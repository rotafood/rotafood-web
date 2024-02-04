import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterModule,
    MainHeaderComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
