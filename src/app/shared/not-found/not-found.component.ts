import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterModule,
    DefaultLayoutComponent,
    MatButtonModule,
    FooterComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
