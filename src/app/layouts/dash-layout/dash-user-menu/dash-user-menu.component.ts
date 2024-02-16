import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CurrentlyUserService } from '../../../core/services/currently-user/currently-user.service';
import { MerchantUser } from '../../../core/interfaces/merchant-user';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-user-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './dash-user-menu.component.html',
  styleUrl: './dash-user-menu.component.scss'
})
export class DashUserMenuComponent {

  public user: MerchantUser | null = null
  constructor(
    private currentUser: CurrentlyUserService,
    private router : Router
    ){
    this.currentUser.getUser().subscribe(user => this.user = user)
  }

  public myPerfil() {
    this.router.navigate(['/perfil'])
  }

  public logout() {
    this.currentUser.logout()
    this.router.navigate([''])
  }

}
