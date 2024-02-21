import { CanActivateFn, Router } from '@angular/router';
import { CurrentlyUserService } from '../../services/currently-user/currently-user.service';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

export const logedGuard: CanActivateFn = (route, state) => {
  
  const currentUserService = inject(CurrentlyUserService)
  const routerService = inject(Router)
  const authService = inject(AuthService)
  if (!currentUserService.hasLogged()) {
      return routerService.createUrlTree(['/login'])
  }
  if (currentUserService.needRefresh()) {
      authService.refreshToken()
  }
  return true
};
